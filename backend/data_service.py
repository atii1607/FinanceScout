from __future__ import annotations

import numpy as np
import pandas as pd
import yfinance as yf


def fetch_history(symbol: str, history_days: int) -> pd.DataFrame:
    """Download daily OHLCV; returns DataFrame with DatetimeIndex and 'Close' column."""
    symbol = symbol.strip().upper()
    df = yf.download(
        symbol,
        period=f"{history_days}d",
        interval="1d",
        progress=False,
        auto_adjust=False,
    )
    if df is None or df.empty:
        raise ValueError(f"No data returned for symbol '{symbol}'. Check the ticker.")

    # Flatten MultiIndex columns when yfinance returns tuple levels
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if "Close" not in df.columns:
        raise ValueError(f"Unexpected response shape for '{symbol}' (missing Close).")

    close = df["Close"].astype(float)
    close = close.dropna()
    if close.empty:
        raise ValueError(f"Close series is empty for '{symbol}'.")

    out = close.reset_index()
    # Column may be 'Date' or index name from reset_index
    date_col = out.columns[0]
    out = out.rename(columns={date_col: "ds", "Close": "y"})
    out["ds"] = pd.to_datetime(out["ds"]).dt.normalize().dt.tz_localize(None)
    out = out.drop_duplicates(subset=["ds"]).sort_values("ds").reset_index(drop=True)
    return out[["ds", "y"]]


def fetch_history_range(symbol: str, start: str, end: str | None = None) -> pd.DataFrame:
    """İki tarih arası günlük kapanış (kesit analizi ve tarih sonrası karşılaştırma için)."""
    symbol = symbol.strip().upper()
    # Yahoo Finance `end` çoğu sürümde üst sınırı hariç tutar; bir gün ileri vererek bugünü dahil etmeye çalış.
    end_param = end
    if end_param:
        end_ts = pd.Timestamp(end_param).normalize() + pd.Timedelta(days=1)
        end_param = end_ts.strftime("%Y-%m-%d")

    if end_param:
        df = yf.download(
            symbol,
            start=start,
            end=end_param,
            interval="1d",
            progress=False,
            auto_adjust=False,
        )
    else:
        df = yf.download(
            symbol,
            start=start,
            interval="1d",
            progress=False,
            auto_adjust=False,
        )
    if df is None or df.empty:
        raise ValueError(f"No data returned for symbol '{symbol}' in range {start} → {end or 'now'}.")

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if "Close" not in df.columns:
        raise ValueError(f"Unexpected response shape for '{symbol}' (missing Close).")

    close = df["Close"].astype(float)
    close = close.dropna()
    if close.empty:
        raise ValueError(f"Close series is empty for '{symbol}'.")

    out = close.reset_index()
    date_col = out.columns[0]
    out = out.rename(columns={date_col: "ds", "Close": "y"})
    out["ds"] = pd.to_datetime(out["ds"]).dt.normalize().dt.tz_localize(None)
    out = out.drop_duplicates(subset=["ds"]).sort_values("ds").reset_index(drop=True)
    return out[["ds", "y"]]


def daily_returns_volatility(prices: pd.Series, annualization: int = 252) -> tuple[float, float]:
    """Log-return daily std and annualized std."""
    r = np.log(prices / prices.shift(1)).dropna()
    if len(r) < 2:
        return float("nan"), float("nan")
    daily = float(r.std(ddof=1))
    annual = daily * (annualization**0.5)
    return daily, annual
