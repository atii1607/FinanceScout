"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { fetchMarketSummary, type MarketItem } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketSummary() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMarketSummary()
      .then((res) => {
        if (res && res.length > 0) {
          setData(res);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-white/40">
          Piyasa verileri şu an yüklenemedi. Lütfen backend sunucusunun çalıştığından emin olun.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {data.map((item) => {
        const isUp = item.change_pct >= 0;
        return (
          <div
            key={item.symbol}
            className="group flex flex-col justify-between rounded-2xl border border-white/12 bg-white/8 p-4 transition-colors hover:bg-white/12"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                {item.symbol}
              </span>
              <span className="mt-1 truncate text-sm font-semibold text-white/90">
                {item.name}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-mono text-lg font-bold text-white">
                {item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <div
                className={`flex items-center gap-0.5 text-xs font-bold ${
                  isUp ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {Math.abs(item.change_pct).toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
