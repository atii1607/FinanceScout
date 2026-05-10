from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

AssetClass = Literal["crypto", "fx", "stock"]

AUTO_SENTINEL = "auto"


@dataclass(frozen=True)
class ProphetModelProfile:
    """Tek Prophet kod yolu; varlık sınıfına göre parametre ve volatilite varsayımları."""

    asset_class: AssetClass
    changepoint_prior_scale: float
    seasonality_mode: Literal["additive", "multiplicative"]
    volatility_annualization: int


def _profiles() -> dict[AssetClass, ProphetModelProfile]:
    return {
        "stock": ProphetModelProfile(
            asset_class="stock",
            changepoint_prior_scale=0.05,
            seasonality_mode="additive",
            volatility_annualization=252,
        ),
        "fx": ProphetModelProfile(
            asset_class="fx",
            changepoint_prior_scale=0.05,
            seasonality_mode="additive",
            volatility_annualization=252,
        ),
        "crypto": ProphetModelProfile(
            asset_class="crypto",
            changepoint_prior_scale=0.09,
            seasonality_mode="multiplicative",
            volatility_annualization=365,
        ),
    }


def get_profile(asset_class: AssetClass) -> ProphetModelProfile:
    return _profiles()[asset_class]


_CRYPTO_PAIR = re.compile(r"^[A-Z0-9^.]{1,12}-(USD|EUR|TRY|USDT)$")


def infer_asset_class(symbol: str) -> AssetClass:
    """Ticker kalıbına göre sınıf tahmini (MVP sezgisel kurallar)."""
    s = symbol.strip().upper()
    if "=X" in s:
        return "fx"
    if _CRYPTO_PAIR.match(s):
        return "crypto"
    return "stock"


def resolve_asset_class(symbol: str, requested: str | None) -> AssetClass:
    """requested: 'auto' veya None → çıkarım; aksi halde sabit sınıf."""
    if requested is None or requested == AUTO_SENTINEL:
        return infer_asset_class(symbol)
    if requested not in ("crypto", "fx", "stock"):
        raise ValueError(f"Invalid asset_class '{requested}'. Use auto, crypto, fx, or stock.")
    return requested  # type: ignore[return-value]
