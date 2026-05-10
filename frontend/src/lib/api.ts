const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const NETWORK_HINT =
  "Tarayıcı API sunucusuna bağlanamadı. Backend çalışıyor mu? `backend` klasöründe: uvicorn main:app --reload --port 8000";

function isLikelyNetworkFailure(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as Error).name;
  const msg = String((err as Error).message ?? "");
  return (
    name === "TypeError" ||
    name === "NetworkError" ||
    msg.includes("NetworkError") ||
    msg.includes("Failed to fetch") ||
    msg.includes("Load failed")
  );
}

async function netFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (err) {
    if (isLikelyNetworkFailure(err)) throw new Error(NETWORK_HINT);
    throw err;
  }
}

export type SeriesPoint = {
  ds: string;
  y?: number | null;
  yhat?: number | null;
  yhat_lower?: number | null;
  yhat_upper?: number | null;
};

export type Metrics = {
  rmse?: number | null;
  mae?: number | null;
  volatility_daily?: number | null;
  volatility_annualized?: number | null;
  volatility_annualization_days?: number | null;
  holdout_points?: number | null;
  mean_bias?: number | null;
};

export type AssetClassParam = "auto" | "crypto" | "fx" | "stock";

export type ForecastApiResponse = {
  symbol: string;
  asset_class: string;
  history: SeriesPoint[];
  forecast: SeriesPoint[];
  backtest_metrics: Metrics;
  train_until_used?: string | null;
  holdout_actual?: SeriesPoint[] | null;
  holdout_predicted?: SeriesPoint[] | null;
};

export type BacktestApiResponse = {
  symbol: string;
  asset_class: string;
  metrics: Metrics;
  test_actual: SeriesPoint[];
  test_predicted: SeriesPoint[];
};

async function parseErrorDetail(res: Response): Promise<string> {
  try {
    const j: unknown = await res.json();
    if (j && typeof j === "object" && "detail" in j) {
      const d = (j as { detail: unknown }).detail;
      if (typeof d === "string") return d;
      return JSON.stringify(d);
    }
  } catch {
    /* ignore */
  }
  try {
    return await res.text();
  } catch {
    return res.statusText;
  }
}

export async function fetchSymbols(q?: string): Promise<string[]> {
  const url = new URL("/symbols/search", BASE);
  if (q?.trim()) url.searchParams.set("q", q.trim());
  const res = await netFetch(url.toString());
  if (!res.ok) throw new Error(await parseErrorDetail(res));
  const j = (await res.json()) as { symbols?: string[] };
  return j.symbols ?? [];
}

export async function postForecast(body: {
  symbol: string;
  history_days: number;
  forecast_days: number;
  asset_class?: AssetClassParam;
  train_until?: string;
  data_start?: string;
}): Promise<ForecastApiResponse> {
  const res = await netFetch(`${BASE}/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorDetail(res));
  return (await res.json()) as ForecastApiResponse;
}

export async function postBacktest(body: {
  symbol: string;
  history_days: number;
  test_fraction: number;
  asset_class?: AssetClassParam;
  train_until?: string;
  data_start?: string;
}): Promise<BacktestApiResponse> {
  const res = await netFetch(`${BASE}/backtest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorDetail(res));
  return (await res.json()) as BacktestApiResponse;
}
