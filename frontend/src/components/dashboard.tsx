"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { PriceChart, type ChartRow } from "@/components/price-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssetClassParam, BacktestApiResponse, ForecastApiResponse, Metrics } from "@/lib/api";
import { fetchSymbols, postBacktest, postForecast } from "@/lib/api";
import {
  INSTRUMENT_CATEGORY_META,
  INSTRUMENTS_BY_CATEGORY,
  type InstrumentCategoryId,
} from "@/lib/instruments";

function buildForecastChartData(res: ForecastApiResponse): ChartRow[] {
  const hist: ChartRow[] = res.history.map((h) => ({
    ds: h.ds,
    actual: h.y ?? undefined,
    fit: h.yhat ?? undefined,
    future: undefined,
    lower: h.yhat_lower ?? undefined,
    upper: h.yhat_upper ?? undefined,
  }));
  const fut: ChartRow[] = res.forecast.map((f) => ({
    ds: f.ds,
    actual: undefined,
    fit: undefined,
    future: f.yhat ?? undefined,
    lower: f.yhat_lower ?? undefined,
    upper: f.yhat_upper ?? undefined,
  }));
  return [...hist, ...fut];
}

function buildBacktestChartData(bt: BacktestApiResponse): ChartRow[] {
  const rows = new Map<string, ChartRow>();
  for (const a of bt.test_actual) {
    rows.set(a.ds, {
      ds: a.ds,
      actual: a.y ?? undefined,
      fit: undefined,
      future: undefined,
      lower: undefined,
      upper: undefined,
    });
  }
  for (const p of bt.test_predicted) {
    const cur = rows.get(p.ds) ?? { ds: p.ds };
    rows.set(p.ds, {
      ...cur,
      ds: p.ds,
      future: p.yhat ?? undefined,
      lower: p.yhat_lower ?? undefined,
      upper: p.yhat_upper ?? undefined,
    });
  }
  return Array.from(rows.values()).sort((a, b) => a.ds.localeCompare(b.ds));
}

function fmtNum(n: number | null | undefined, digits = 4) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function fmtPct(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${(n * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}

function riskFromVol(annual?: number | null) {
  if (annual === null || annual === undefined || Number.isNaN(annual)) {
    return { label: "Belirsiz", className: "bg-muted text-muted-foreground" };
  }
  if (annual < 0.15)
    return {
      label: "Daha sakin",
      className:
        "bg-blue-950/25 text-blue-950 dark:bg-blue-950/45 dark:text-blue-100",
    };
  if (annual < 0.35)
    return {
      label: "Orta",
      className:
        "bg-amber-950/22 text-amber-950 dark:bg-amber-950/40 dark:text-amber-50",
    };
  return {
    label: "Daha hareketli",
    className:
      "bg-rose-950/22 text-rose-950 dark:bg-rose-950/42 dark:text-rose-50",
  };
}

function assetLabelTr(ac: string) {
  if (ac === "crypto") return "Kripto";
  if (ac === "fx") return "Döviz";
  if (ac === "stock") return "Hisse senedi";
  return ac;
}

function MetricTile({
  title,
  hint,
  value,
}: {
  title: string;
  hint: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-heading text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
      <div className="text-heading pt-1 text-xl font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

function MetricsSection({
  title,
  m,
  trainUntil,
}: {
  title: string;
  m: Metrics;
  trainUntil?: string | null;
}) {
  const risk = riskFromVol(m.volatility_annualized);
  const rmseHint =
    trainUntil && m.holdout_points != null
      ? `Model ${trainUntil} tarihine kadar eğitildi; bu tarihten sonraki gerçek kapanışlarla karşılaştırıldı (${m.holdout_points} ortak işlem günü). Rakam düştükçe tahmin gerçeğe yakın demektir.`
      : "Son tutulan test penceresinde hatanın büyüklüğü. Rakam düştükçe model gerçek fiyata daha yakın demektir.";
  const biasFinite = m.mean_bias != null && Number.isFinite(m.mean_bias);

  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-heading text-heading text-xl font-semibold tracking-tight">{title}</h2>
      {trainUntil ? (
        <p className="border-primary/35 bg-muted/25 text-muted-foreground border-l-[3px] px-4 py-3 text-sm leading-relaxed">
          <strong className="text-heading">Kesit modu:</strong> Model veriyi yalnızca{" "}
          <strong className="text-heading">{trainUntil}</strong> tarihine kadar «gördü». Bu tarihten sonraki gerçek fiyatlar,
          modele kapalı kalarak karşılaştırmada kullanıldı — böylece «bilmediği dönem» hatasını ölçebilirsiniz.
        </p>
      ) : null}
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        <MetricTile title="RMSE" hint={rmseHint} value={fmtNum(m.rmse)} />
        <MetricTile
          title="MAE"
          hint="Ortalama mutlak sapma; RMSE ile birlikte yorumlanır. Küçük olması iyidir."
          value={fmtNum(m.mae)}
        />
        <MetricTile
          title="Günlük oynaklık"
          hint="Son günlük kapanışlara göre, bir günden diğerine sıçrama özeti."
          value={fmtPct(m.volatility_daily)}
        />
        <MetricTile
          title="Yıllıklaştırılmış oynaklık"
          hint={
            m.volatility_annualization_days != null
              ? `Günlük oynaklığı yıla ölçeklemek için √${m.volatility_annualization_days} kullanıldı (bilgi amaçlı).`
              : "Günlük oynaklığın kabaca yıllık karşılığı (bilgi amaçlı)."
          }
          value={
            <div className="flex flex-col gap-1">
              <span>{fmtPct(m.volatility_annualized)}</span>
            </div>
          }
        />
        <div className="flex flex-col gap-2 py-1">
          <p className="text-heading text-sm font-semibold">Risk özeti</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Yıllıklaştırılmış oynaklığa göre kabaca bir etiket; yatırım tavsiyesi değildir.
          </p>
          <span className={`mt-1 inline-flex w-fit rounded-md px-2.5 py-1 text-sm font-medium ${risk.className}`}>
            {risk.label}
          </span>
        </div>
      </div>
      {biasFinite ? (
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong className="text-heading">Ortalama sapma (bias):</strong> tahminler gerçek fiyatın ortalama olarak{" "}
          <strong className="text-heading">{fmtNum(m.mean_bias)}</strong> kadar{" "}
          {(m.mean_bias as number) > 0 ? "üzerinde" : "altında"} kalmış. İleri tahminlerde düzeltme çarpanı düşünmek
          isterseniz bu işareti referans alabilirsiniz (otomatik uygulanmaz).
        </p>
      ) : null}
    </section>
  );
}

export function Dashboard() {
  const [symbol, setSymbol] = useState("USDTRY=X");
  const [assetClass, setAssetClass] = useState<AssetClassParam>("fx");
  const [pickerCategory, setPickerCategory] = useState<InstrumentCategoryId>("fx");
  const [pickerQuery, setPickerQuery] = useState("");
  const [historyDays, setHistoryDays] = useState(365);
  const [forecastDays, setForecastDays] = useState(9);
  const [useTrainCutoff, setUseTrainCutoff] = useState(false);
  const [trainUntil, setTrainUntil] = useState("2022-12-31");
  const [dataStart, setDataStart] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastApiResponse | null>(null);
  const [backtest, setBacktest] = useState<BacktestApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSymbols()
      .then((s) => {
        if (!cancelled) setSuggestions(s);
      })
      .catch(() => {
        /* offline API — ignore */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const forecastChart = useMemo(() => (forecast ? buildForecastChartData(forecast) : []), [forecast]);
  const backtestChart = useMemo(() => (backtest ? buildBacktestChartData(backtest) : []), [backtest]);

  const symUpper = symbol.trim().toUpperCase();
  const filteredPickerRows = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const list = INSTRUMENTS_BY_CATEGORY[pickerCategory];
    if (!q) return list;
    return list.filter(
      (row) => row.label.toLowerCase().includes(q) || row.symbol.toLowerCase().includes(q),
    );
  }, [pickerCategory, pickerQuery]);

  const pickerSelectionLabel = useMemo(() => {
    for (const { id } of INSTRUMENT_CATEGORY_META) {
      const hit = INSTRUMENTS_BY_CATEGORY[id].find((r) => r.symbol === symUpper);
      if (hit) return hit.label;
    }
    return null;
  }, [symUpper]);

  async function run() {
    setError(null);
    setForecast(null);
    setBacktest(null);
    setLoading(true);
    try {
      const sym = symbol.trim().toUpperCase();
      if (!sym) throw new Error("Lütfen bir sembol yazın (örnek: BTC-USD).");

      const fc = await postForecast({
        symbol: sym,
        history_days: historyDays,
        forecast_days: forecastDays,
        asset_class: assetClass,
        ...(useTrainCutoff && trainUntil.trim()
          ? { train_until: trainUntil.trim(), data_start: dataStart.trim() || undefined }
          : {}),
      });
      setForecast(fc);

      const holdoutReady =
        Boolean(fc.train_until_used) &&
        Boolean(fc.holdout_actual?.length) &&
        Boolean(fc.holdout_predicted?.length);

      if (holdoutReady && fc.holdout_actual && fc.holdout_predicted) {
        setBacktest({
          symbol: fc.symbol,
          asset_class: fc.asset_class,
          metrics: fc.backtest_metrics,
          test_actual: fc.holdout_actual,
          test_predicted: fc.holdout_predicted,
        });
      } else {
        try {
          const bt = await postBacktest({
            symbol: sym,
            history_days: historyDays,
            test_fraction: 0.2,
            asset_class: assetClass,
            ...(useTrainCutoff && trainUntil.trim()
              ? { train_until: trainUntil.trim(), data_start: dataStart.trim() || undefined }
              : {}),
          });
          setBacktest(bt);
        } catch (be) {
          setBacktest(null);
          const msg = be instanceof Error ? be.message : String(be);
          setError(
            `Ana tahmin hazır; «Geçmişe dönük test» sekmesi için ek grafik alınamadı. Geçmiş aralığını veya kesit tarihini kontrol edin. (${msg})`,
          );
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg ||
          "İstek başarısız oldu. Sembolün doğru olduğundan emin olun; sunucunun çalıştığını kontrol edin (localhost:8000).",
      );
    } finally {
      setLoading(false);
    }
  }

  const showEmptyHint = !forecast && !loading;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-0 md:pb-20">
      <section className="flex flex-col gap-8">
        <header className="space-y-2">
          <h2 className="font-heading text-heading text-2xl font-semibold tracking-tight">Analiz ayarları</h2>
          <p className="text-muted-foreground max-w-3xl text-[15px] leading-relaxed">
            Aşağıdaki listede yaygın dövizler, kripto paralar, BIST ve örnek hisseler yer alır; tek tıkla Yahoo Finance
            kodu ve model profili ayarlanır. Liste dışı bir sembol için alttaki gelişmiş seçeneği açın.
          </p>
        </header>
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 md:p-5">
            <div className="flex flex-col gap-1">
              <p className="text-heading text-sm font-medium">Varlık seç</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Sol sütunda kategori, sağda arama ve liste. Bir satıra tıklayınca hem kod hem model profili güncellenir.
              </p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Kategori</Label>
                <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
                  {INSTRUMENT_CATEGORY_META.map((c) => (
                    <Button
                      key={c.id}
                      type="button"
                      variant={pickerCategory === c.id ? "secondary" : "outline"}
                      size="sm"
                      className="h-auto min-h-10 shrink-0 justify-start whitespace-normal px-3 py-2 text-left"
                      onClick={() => setPickerCategory(c.id)}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{c.title}</span>
                        <span className="text-muted-foreground text-xs font-normal leading-snug">{c.blurb}</span>
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex min-h-0 flex-col gap-2">
                <Label htmlFor="picker_search" className="text-xs font-medium text-muted-foreground">
                  Liste ve arama
                </Label>
                <Input
                  id="picker_search"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="İsim veya kod yazın (ör. dolar, THYAO)…"
                  autoComplete="off"
                  className="text-base"
                />
                <div
                  role="listbox"
                  aria-label="Seçilebilir varlıklar"
                  className="border-input bg-background max-h-56 overflow-y-auto rounded-lg border shadow-xs"
                >
                  {filteredPickerRows.length === 0 ? (
                    <p className="text-muted-foreground p-4 text-sm leading-relaxed">Eşleşen sonuç yok.</p>
                  ) : (
                    filteredPickerRows.map((row) => {
                      const active = symUpper === row.symbol;
                      return (
                        <button
                          key={row.symbol}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setSymbol(row.symbol);
                            setAssetClass(row.profile);
                          }}
                          className={`hover:bg-muted/80 flex w-full flex-col gap-0.5 border-b border-border/60 px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 ${
                            active ? "bg-primary/12" : ""
                          }`}
                        >
                          <span className="text-heading font-medium leading-snug">{row.label}</span>
                          <span className="text-muted-foreground font-mono text-xs tracking-tight">{row.symbol}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="border-border/60 mt-4 border-t pt-4">
              <p className="text-sm leading-relaxed">
                <span className="text-muted-foreground">Şu an seçili:</span>{" "}
                <strong className="text-heading">{pickerSelectionLabel ?? "Özel / listede yok"}</strong>
                {symUpper ? (
                  <>
                    {" "}
                    <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{symUpper}</code>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <details className="group rounded-xl border border-border/50 bg-muted/15 px-4 py-3 open:bg-muted/25">
            <summary className="cursor-pointer list-none text-sm font-medium leading-relaxed outline-none marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="text-heading underline-offset-2 group-open:underline">
                İleri: Kendi Yahoo Finance sembolümü yazarım
              </span>
              <span className="text-muted-foreground font-normal">
                {" "}
                — Liste dışı hisse veya döviz kodu (ör. <code className="rounded bg-muted px-1 py-0.5 text-xs">USDTRY=X</code>
                ).
              </span>
            </summary>
            <div className="mt-4 flex flex-col gap-2 pb-1">
              <Label htmlFor="symbol">Sembol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Örn. BTC-USD, EURUSD=X, THYAO.IS"
                autoComplete="off"
                className="text-base font-mono"
              />
              {suggestions.length > 0 ? (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Sunucudan örnekler: {suggestions.slice(0, 8).join(" · ")}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Kodu Yahoo Finance’te gördüğünüz «Ticker» ile birebir yazın.
                </p>
              )}
            </div>
          </details>

          <div className="rounded-xl border border-border/50 bg-muted/15 px-4 py-4">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                className="border-input text-primary focus-visible:ring-ring mt-1 size-4 shrink-0 rounded border shadow-xs"
                checked={useTrainCutoff}
                onChange={(e) => setUseTrainCutoff(e.target.checked)}
              />
              <span className="text-sm leading-relaxed">
                <span className="text-heading font-medium">Eğitimi belirli tarihte kes</span>
                <span className="text-muted-foreground">
                  {" "}
                  — Model bu tarihe kadar olan günlük kapanışları görür; sonrasını tahmin eder ve indirdiğimiz gerçek
                  fiyatlarla RMSE / MAE hesaplarız (ör. 2022 sonrasını bilerek karşılaştırma).
                </span>
              </span>
            </label>
            {useTrainCutoff ? (
              <div className="mt-4 grid gap-4 border-t border-border/60 pt-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="train_until">Son eğitim günü (dahil)</Label>
                  <Input
                    id="train_until"
                    type="date"
                    value={trainUntil}
                    onChange={(e) => setTrainUntil(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Öneri: uzun kıyas için hisselerde <code className="rounded bg-muted px-1">2022-12-31</code> gibi bir
                    tarih deneyin; veri Yahoo’dan başlangıç tarihine kadar indirilir.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="data_start">Veri başlangıcı (isteğe bağlı)</Label>
                  <Input
                    id="data_start"
                    type="date"
                    value={dataStart}
                    onChange={(e) => setDataStart(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Boş bırakılırsa sistem otomatik olarak yaklaşık 18 yıl geriye gider. İsterseniz daha kısa bir aralık
                    seçerek indirmeyi hızlandırabilirsiniz.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="asset" className="text-base">
                Model profili
              </Label>
              <select
                id="asset"
                value={assetClass}
                aria-label="Varlık türü veya otomatik profil"
                onChange={(e) => setAssetClass(e.target.value as AssetClassParam)}
                className="border-input bg-background dark:bg-input/30 h-10 w-full rounded-lg border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="auto">Otomatik (sembolden tahmin et)</option>
                <option value="crypto">Kripto için ayarla</option>
                <option value="fx">Döviz için ayarla</option>
                <option value="stock">Hisse için ayarla</option>
              </select>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Listeden seçince uygun profil atanır; özel sembollerde «Otomatik» veya elle seçim kullanın.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hist" className="text-base">
                Kaç günlük geçmiş?
              </Label>
              <Input
                id="hist"
                type="number"
                min={60}
                max={3650}
                value={historyDays}
                disabled={useTrainCutoff}
                onChange={(e) => setHistoryDays(Number(e.target.value))}
                className="text-base"
              />
              <p className="text-muted-foreground text-xs leading-relaxed">
                {useTrainCutoff
                  ? "Kesit modunda «Kaç günlük geçmiş» kullanılmaz; bunun yerine veri başlangıcı ve kesit tarihi kullanılır."
                  : "Model ne kadar uzun geçmiş görürse o kadar bağlam alır; çok kısa seçmeyin (en az 60 önerilir)."}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fh" className="text-base">
                Kaç gün ilerisini tahmin et?
              </Label>
              <Input
                id="fh"
                type="number"
                min={1}
                max={90}
                value={forecastDays}
                onChange={(e) => setForecastDays(Number(e.target.value))}
                className="text-base"
              />
              <p className="text-muted-foreground text-xs leading-relaxed">
                Varsayılan 9 gündür. Uzun ufuklar belirsizliği artırır; demo için kısa tutmak daha sağlıklıdır.
              </p>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/35 bg-destructive/8 px-4 py-3 text-sm leading-relaxed text-destructive"
            >
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 border-t border-border/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground order-2 text-xs leading-relaxed sm:order-1">
            Arka uç adresi: <code className="rounded bg-muted px-1 py-0.5">{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}</code>
          </p>
          <Button type="button" size="lg" className="order-1 w-full sm:order-2 sm:w-auto" disabled={loading} onClick={run}>
            {loading ? "Hesaplanıyor…" : "Tahmini göster"}
          </Button>
        </div>
      </section>

      {showEmptyHint ? (
        <div className="border-border/45 py-14 text-center">
          <p className="text-muted-foreground mx-auto max-w-md text-[15px] leading-relaxed">
            Henüz sonuç yok. Yukarıdan listeden bir varlık seçip (veya gelişmiş seçenekten sembol yazıp){" "}
            <strong className="text-heading font-medium">Tahmini göster</strong>
            dediğinizde burada grafik ve özet metrikler belirir.
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">Veri indiriliyor ve model çalışıyor; genelde birkaç saniye sürer.</p>
          <Skeleton className="h-11 w-full max-w-lg rounded-lg" />
          <Skeleton className="h-[380px] w-full rounded-xl" />
        </div>
      ) : null}

      {forecast && !loading ? (
        <>
          <MetricsSection
            title="Özet metrikler (bilgi amaçlı)"
            m={forecast.backtest_metrics}
            trainUntil={forecast.train_until_used}
          />

          <Tabs defaultValue="forecast" className="gap-6">
            <TabsList variant="line" className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="forecast">Tahmin grafiği</TabsTrigger>
              <TabsTrigger value="backtest">Geçmişe dönük test</TabsTrigger>
            </TabsList>
            <TabsContent value="forecast" className="mt-0 outline-none">
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-heading text-xl font-semibold">{forecast.symbol}</h3>
                  <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                    Kullanılan profil: <strong className="text-heading">{assetLabelTr(forecast.asset_class)}</strong>
                    {forecast.train_until_used ? (
                      <>
                        . <strong className="text-heading">Kesit tarihi:</strong> {forecast.train_until_used} — model bu
                        tarihten sonraki gerçek kapanışları eğitimde kullanmadı; grafikte hem gerçek hem tahmin birlikte
                        görünür.
                      </>
                    ) : null}{" "}
                    Ana renkli çizgi gerçek kapanışları gösterir; daha açık ton modelin geçmiş uyumunu; vurgulu ton ileri
                    tahmini temsil eder (kesit kullanıldıysa gerçek çizgi sonrasında da görünür). Kesik çizgiler kabaca üst/
                    alt bandı işaret eder.
                  </p>
                </div>
                <div className="border-border/45 border-t pt-8">
                  <PriceChart data={forecastChart} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="backtest" className="mt-0 outline-none">
              {backtest ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading text-heading text-xl font-semibold">Geçmişe dönük test</h3>
                    <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                      {forecast.train_until_used
                        ? `Model ${forecast.train_until_used} tarihine kadar eğitildi; grafikte bu tarihten sonra gerçek fiyat ile model çıktısı yan yana. Üstteki RMSE/MAE bu «bilinmeyen dönem» için hesaplanır.`
                        : `Verinin son %20'lik bölümünde modelin tahmini ile gerçek kapanış karşılaştırılır; üstteki RMSE ve MAE bu yöntemden gelir. Bu, geleceği garanti etmez.`}
                    </p>
                  </div>
                  <div className="border-border/45 border-t pt-8">
                    <PriceChart data={backtestChart} />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground border-border/45 border-t py-12 text-center text-[15px] leading-relaxed">
                  Bu sekme için grafik yüklenemedi. «Kaç günlük geçmiş» değerini yükseltip yeniden deneyebilirsiniz.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : null}

    </div>
  );
}
