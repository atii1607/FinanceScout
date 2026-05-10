from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


AssetClassParam = Literal["auto", "crypto", "fx", "stock"]


class ForecastRequest(BaseModel):
    symbol: str = Field(..., min_length=1, description="Yahoo Finance ticker, e.g. BTC-USD, EURUSD=X")
    history_days: int = Field(default=365, ge=30, le=3650)
    forecast_days: int = Field(default=9, ge=1, le=90)
    asset_class: AssetClassParam = Field(
        default="auto",
        description="auto: ticker kalıbından tahmin; aksi halde Prophet/volatilite profili sabitlenir.",
    )
    train_until: str | None = Field(
        default=None,
        description="YYYY-MM-DD — modele bu tarihe kadar (dahil) veri gösterilir; sonrası gerçek fiyatlarla kıyaslanır.",
    )
    data_start: str | None = Field(
        default=None,
        description="İndirme başlangıcı (YYYY-MM-DD). train_until kullanılıyorsa boş bırakılırsa train_until - 18 yıl.",
    )


class SeriesPoint(BaseModel):
    ds: str
    y: float | None = None
    yhat: float | None = None
    yhat_lower: float | None = None
    yhat_upper: float | None = None


class Metrics(BaseModel):
    rmse: float | None = None
    mae: float | None = None
    volatility_daily: float | None = None
    volatility_annualized: float | None = None
    volatility_annualization_days: int | None = None
    holdout_points: int | None = None
    mean_bias: float | None = Field(
        None,
        description="Ortalama (tahmin - gerçek); pozitif ise model genelde yukarı sapmıştır.",
    )


class ForecastResponse(BaseModel):
    symbol: str
    asset_class: str
    history: list[SeriesPoint]
    forecast: list[SeriesPoint]
    backtest_metrics: Metrics
    train_until_used: str | None = None
    holdout_actual: list[SeriesPoint] | None = None
    holdout_predicted: list[SeriesPoint] | None = None


class BacktestRequest(BaseModel):
    symbol: str = Field(..., min_length=1)
    history_days: int = Field(default=365, ge=30, le=3650)
    test_fraction: float = Field(default=0.2, gt=0.05, lt=0.5)
    asset_class: AssetClassParam = Field(default="auto")
    train_until: str | None = Field(default=None, description="YYYY-MM-DD kesit modu (forecast ile aynı)")
    data_start: str | None = Field(default=None)


class BacktestResponse(BaseModel):
    symbol: str
    asset_class: str
    metrics: Metrics
    test_actual: list[SeriesPoint]
    test_predicted: list[SeriesPoint]


class HealthResponse(BaseModel):
    status: str
