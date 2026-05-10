from __future__ import annotations

import math
from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data_service import fetch_history, fetch_history_range
from model_profiles import get_profile, resolve_asset_class
from prophet_service import backtest_split, cutoff_train_forecast, fit_and_forecast
from schemas import (
    BacktestRequest,
    BacktestResponse,
    ForecastRequest,
    ForecastResponse,
    HealthResponse,
    Metrics,
    SeriesPoint,
)

app = FastAPI(title="FinanceScout API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://[::1]:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _finite_or_none(x: Any) -> float | None:
    if x is None:
        return None
    try:
        xf = float(x)
    except (TypeError, ValueError):
        return None
    if math.isnan(xf) or math.isinf(xf):
        return None
    return xf


def _metrics_from_dict(d: dict[str, Any]) -> Metrics:
    return Metrics(
        rmse=_finite_or_none(d.get("rmse")),
        mae=_finite_or_none(d.get("mae")),
        volatility_daily=_finite_or_none(d.get("volatility_daily")),
        volatility_annualized=_finite_or_none(d.get("volatility_annualized")),
        volatility_annualization_days=d.get("volatility_annualization_days"),
        holdout_points=d.get("holdout_points"),
        mean_bias=_finite_or_none(d.get("mean_bias")),
    )


def _load_history(req_symbol: str, history_days: int, train_until: str | None, data_start: str | None) -> pd.DataFrame:
    symbol = req_symbol.strip().upper()
    if train_until:
        tu = pd.Timestamp(train_until).normalize()
        start_s = data_start or (tu - pd.DateOffset(years=18)).strftime("%Y-%m-%d")
        return fetch_history_range(symbol, start=start_s, end=None)
    return fetch_history(symbol, history_days)


def _history_points_from_fc(hist: pd.DataFrame, hist_fc: pd.DataFrame) -> list[SeriesPoint]:
    points: list[SeriesPoint] = []
    for _, row in hist.iterrows():
        ds = row["ds"]
        match = hist_fc[hist_fc["ds"].dt.normalize() == ds.normalize()]
        if not match.empty:
            r = match.iloc[0]
            points.append(
                SeriesPoint(
                    ds=ds.strftime("%Y-%m-%d"),
                    y=float(row["y"]),
                    yhat=float(r["yhat"]),
                    yhat_lower=float(r["yhat_lower"]),
                    yhat_upper=float(r["yhat_upper"]),
                )
            )
        else:
            points.append(SeriesPoint(ds=ds.strftime("%Y-%m-%d"), y=float(row["y"])))
    return points


def _row_to_point_forecast(row: pd.Series) -> SeriesPoint:
    return SeriesPoint(
        ds=row["ds"].strftime("%Y-%m-%d"),
        y=None,
        yhat=float(row["yhat"]),
        yhat_lower=float(row["yhat_lower"]),
        yhat_upper=float(row["yhat_upper"]),
    )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


STATIC_SYMBOL_SUGGESTIONS = [
    "BTC-USD",
    "ETH-USD",
    "EURUSD=X",
    "USDTRY=X",
    "GC=F",
    "THYAO.IS",
    "^GSPC",
    "AAPL",
]


@app.get("/symbols/search")
def symbols_search(q: str = Query("", min_length=0, max_length=32)) -> dict:
    q_up = q.strip().upper()
    if not q_up:
        return {"symbols": STATIC_SYMBOL_SUGGESTIONS}
    hits = [s for s in STATIC_SYMBOL_SUGGESTIONS if q_up in s]
    return {"symbols": hits[:20]}


@app.post("/forecast", response_model=ForecastResponse)
def forecast(body: ForecastRequest) -> ForecastResponse:
    try:
        asset_class = resolve_asset_class(body.symbol, body.asset_class)
        profile = get_profile(asset_class)
        hist = _load_history(body.symbol, body.history_days, body.train_until, body.data_start)

        train_until_used: str | None = None
        holdout_actual: list[SeriesPoint] | None = None
        holdout_predicted: list[SeriesPoint] | None = None

        if body.train_until:
            tu = pd.Timestamp(body.train_until).normalize().tz_localize(None)
            train_until_used = tu.strftime("%Y-%m-%d")
            fc_keep, fut_tail, merged_holdout, mdict = cutoff_train_forecast(hist, tu, body.forecast_days, profile)

            history_points = _history_points_from_fc(hist, fc_keep)
            forecast_points = [_row_to_point_forecast(row) for _, row in fut_tail.iterrows()]
            metrics = _metrics_from_dict(mdict)

            if len(merged_holdout) > 0:
                holdout_actual = [
                    SeriesPoint(ds=r["ds"].strftime("%Y-%m-%d"), y=float(r["y"])) for _, r in merged_holdout.iterrows()
                ]
                holdout_predicted = [
                    SeriesPoint(
                        ds=r["ds"].strftime("%Y-%m-%d"),
                        yhat=float(r["yhat"]),
                        yhat_lower=float(r["yhat_lower"]),
                        yhat_upper=float(r["yhat_upper"]),
                    )
                    for _, r in merged_holdout.iterrows()
                ]

            return ForecastResponse(
                symbol=body.symbol.strip().upper(),
                asset_class=asset_class,
                history=history_points,
                forecast=forecast_points,
                backtest_metrics=metrics,
                train_until_used=train_until_used,
                holdout_actual=holdout_actual,
                holdout_predicted=holdout_predicted,
            )

        hist_fc, fut_fc = fit_and_forecast(hist, body.forecast_days, profile)
        mdict, _, _ = backtest_split(hist, test_fraction=0.2, profile=profile)

        history_points = _history_points_from_fc(hist, hist_fc)
        forecast_points = [_row_to_point_forecast(row) for _, row in fut_fc.iterrows()]
        metrics = _metrics_from_dict(mdict)

        return ForecastResponse(
            symbol=body.symbol.strip().upper(),
            asset_class=asset_class,
            history=history_points,
            forecast=forecast_points,
            backtest_metrics=metrics,
            train_until_used=None,
            holdout_actual=None,
            holdout_predicted=None,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Upstream or model error: {e!s}") from e


@app.post("/backtest", response_model=BacktestResponse)
def backtest(body: BacktestRequest) -> BacktestResponse:
    try:
        asset_class = resolve_asset_class(body.symbol, body.asset_class)
        profile = get_profile(asset_class)
        hist = _load_history(body.symbol, body.history_days, body.train_until, body.data_start)

        if body.train_until:
            tu = pd.Timestamp(body.train_until).normalize().tz_localize(None)
            _fc_keep, _fut_tail, merged_holdout, mdict = cutoff_train_forecast(hist, tu, forecast_days=30, profile=profile)

            if len(merged_holdout) < 3:
                raise ValueError("Kesit modunda karşılaştırılacak yeterli tarih yok (train_until çok geç olabilir).")

            test_actual = [
                SeriesPoint(ds=r["ds"].strftime("%Y-%m-%d"), y=float(r["y"])) for _, r in merged_holdout.iterrows()
            ]
            test_predicted = [
                SeriesPoint(
                    ds=r["ds"].strftime("%Y-%m-%d"),
                    yhat=float(r["yhat"]),
                    yhat_lower=float(r["yhat_lower"]),
                    yhat_upper=float(r["yhat_upper"]),
                )
                for _, r in merged_holdout.iterrows()
            ]

            metrics = _metrics_from_dict(mdict)

            return BacktestResponse(
                symbol=body.symbol.strip().upper(),
                asset_class=asset_class,
                metrics=metrics,
                test_actual=test_actual,
                test_predicted=test_predicted,
            )

        mdict, actual_df, pred_df = backtest_split(hist, body.test_fraction, profile=profile)

        test_actual = [
            SeriesPoint(ds=r["ds"].strftime("%Y-%m-%d"), y=float(r["y"])) for _, r in actual_df.iterrows()
        ]
        test_predicted = [
            SeriesPoint(
                ds=r["ds"].strftime("%Y-%m-%d"),
                yhat=float(r["yhat"]),
                yhat_lower=float(r["yhat_lower"]),
                yhat_upper=float(r["yhat_upper"]),
            )
            for _, r in pred_df.iterrows()
        ]

        metrics = _metrics_from_dict(mdict)

        return BacktestResponse(
            symbol=body.symbol.strip().upper(),
            asset_class=asset_class,
            metrics=metrics,
            test_actual=test_actual,
            test_predicted=test_predicted,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Upstream or model error: {e!s}") from e
