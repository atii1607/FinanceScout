from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error

from data_service import daily_returns_volatility
from model_profiles import ProphetModelProfile, get_profile


def cutoff_train_forecast(
    full: pd.DataFrame,
    train_until: pd.Timestamp,
    forecast_days: int,
    profile: ProphetModelProfile,
) -> tuple[pd.DataFrame, pd.DataFrame, dict[str, Any]]:
    """
    Model yalnızca train_until (dahil) tarihine kadar görür; sonrası için tahmin üretilir ve
    veri setinde varsa gerçek kapanışlarla karşılaştırılır (RMSE/MAE).

    Döndürür:
      pred_bands: ds, yhat, yhat_lower, yhat_upper (train sonrası + ileri ufuk)
      future_tail: son gerçek tarihten sonraki saf tahmin satırları (forecast_days kadar takvim günü)
      metrics: rmse/mae tutulan bölümde; volatilite tüm seri üzerinden
    """
    df = _prophet_ready(full)
    train_until = pd.Timestamp(train_until).normalize().tz_localize(None)

    if df.ds.min() > train_until:
        raise ValueError("train_until, indirilen verinin başından önce olamaz.")

    train = df.loc[df["ds"] <= train_until].copy()
    holdout = df.loc[df["ds"] > train_until].copy()

    if len(train) < 14:
        raise ValueError("Eğitim için yeterli satır yok (train_until çok erken veya veri kısa).")

    last_train = train["ds"].max()
    last_actual = df["ds"].max()

    horizon_days = int((last_actual.normalize() - last_train.normalize()).days) + int(forecast_days) + 7
    horizon_days = max(horizon_days, forecast_days + 7)

    m = _build_prophet(len(train), profile)
    m.fit(train[["ds", "y"]])

    future = m.make_future_dataframe(periods=horizon_days, freq="D")
    fc = m.predict(future)

    merged_holdout = pd.merge(
        holdout[["ds", "y"]],
        fc[["ds", "yhat", "yhat_lower", "yhat_upper"]],
        on="ds",
        how="inner",
    )

    metrics: dict[str, Any] = {
        "volatility_daily": float("nan"),
        "volatility_annualized": float("nan"),
        "volatility_annualization_days": profile.volatility_annualization,
        "holdout_points": int(len(merged_holdout)),
    }

    vol_d, vol_a = daily_returns_volatility(df["y"], annualization=profile.volatility_annualization)
    metrics["volatility_daily"] = vol_d
    metrics["volatility_annualized"] = vol_a

    if len(merged_holdout) >= 3:
        y_true = merged_holdout["y"].astype(float).values
        y_hat = merged_holdout["yhat"].astype(float).values
        metrics["rmse"] = float(np.sqrt(mean_squared_error(y_true, y_hat)))
        metrics["mae"] = float(mean_absolute_error(y_true, y_hat))
        metrics["mean_actual"] = float(np.mean(y_true))
        metrics["mean_bias"] = float(np.mean(y_hat - y_true))
    else:
        metrics["rmse"] = float("nan")
        metrics["mae"] = float("nan")
        metrics["mean_actual"] = float("nan")
        metrics["mean_bias"] = float("nan")

    fc_keep = fc[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()

    future_tail = fc_keep.loc[fc_keep["ds"] > last_actual].head(int(forecast_days)).copy()

    return fc_keep, future_tail, merged_holdout, metrics


def _prophet_ready(df: pd.DataFrame) -> pd.DataFrame:
    p = df.copy()
    p = p.dropna(subset=["y"])
    p["ds"] = pd.to_datetime(p["ds"]).dt.tz_localize(None)
    return p.reset_index(drop=True)


def _build_prophet(train_rows: int, profile: ProphetModelProfile) -> Prophet:
    yearly = train_rows > 180
    return Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=yearly,
        changepoint_prior_scale=profile.changepoint_prior_scale,
        seasonality_mode=profile.seasonality_mode,
    )


def fit_and_forecast(
    history: pd.DataFrame,
    forecast_days: int,
    profile: ProphetModelProfile | None = None,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    prof = profile or get_profile("stock")
    train = _prophet_ready(history)
    if len(train) < 14:
        raise ValueError("Need at least 14 historical rows after cleaning for Prophet.")

    m = _build_prophet(len(train), prof)
    m.fit(train[["ds", "y"]])

    future = m.make_future_dataframe(periods=forecast_days, freq="D")
    fc = m.predict(future)

    hist_ds = set(train["ds"].dt.normalize())

    hist_part = fc[fc["ds"].dt.normalize().isin(hist_ds)].copy()
    fut_part = fc[~fc["ds"].dt.normalize().isin(hist_ds)].copy()
    fut_part = fut_part.head(forecast_days)
    return hist_part, fut_part


def backtest_split(
    history: pd.DataFrame,
    test_fraction: float,
    profile: ProphetModelProfile | None = None,
) -> tuple[dict[str, Any], pd.DataFrame, pd.DataFrame]:
    prof = profile or get_profile("stock")
    df = _prophet_ready(history)
    n = len(df)
    if n < 30:
        raise ValueError("Need at least 30 rows for backtesting.")

    split = int(n * (1.0 - test_fraction))
    split = max(split, 14)
    if n - split < 5:
        split = n - 5

    train = df.iloc[:split].copy()
    test = df.iloc[split:].copy()

    m = _build_prophet(len(train), prof)
    m.fit(train[["ds", "y"]])

    periods = len(test)
    future = m.make_future_dataframe(periods=periods, freq="D")
    fc = m.predict(future)

    merged = pd.merge(
        test[["ds", "y"]],
        fc[["ds", "yhat", "yhat_lower", "yhat_upper"]],
        on="ds",
        how="inner",
    )

    if len(merged) < 3:
        raise ValueError("Too few overlapping calendar dates between model output and test window.")

    y_true = merged["y"].astype(float).values
    y_hat = merged["yhat"].astype(float).values

    rmse = float(np.sqrt(mean_squared_error(y_true, y_hat)))
    mae = float(mean_absolute_error(y_true, y_hat))

    vol_d, vol_a = daily_returns_volatility(df["y"], annualization=prof.volatility_annualization)

    metrics = {
        "rmse": rmse,
        "mae": mae,
        "volatility_daily": vol_d,
        "volatility_annualized": vol_a,
        "volatility_annualization_days": prof.volatility_annualization,
    }

    actual_df = merged[["ds", "y"]].copy()
    pred_df = merged[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
    return metrics, actual_df, pred_df
