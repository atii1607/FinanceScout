import type { AssetClassParam } from "@/lib/api";

/** Yahoo Finance ticker + Türkçe etiket + önerilen model profili */

export type InstrumentCategoryId = "fx" | "crypto" | "bist" | "us_stock" | "index" | "commodity";

export type InstrumentOption = {
  symbol: string;
  label: string;
  profile: Exclude<AssetClassParam, "auto">;
};

export const INSTRUMENT_CATEGORY_META: {
  id: InstrumentCategoryId;
  title: string;
  blurb: string;
}[] = [
  { id: "fx", title: "Döviz kurları", blurb: "Çoğu çift Yahoo’da =X ile biter." },
  { id: "crypto", title: "Kripto", blurb: "ABD doları bazlı pariteler (-USD)." },
  { id: "bist", title: "Borsa İstanbul", blurb: "Türk hisseleri (.IS)." },
  { id: "us_stock", title: "ABD hisseleri", blurb: "Örnek tek tek hisseler." },
  { id: "index", title: "Endeksler", blurb: "Küresel ve BIST endeksleri." },
  { id: "commodity", title: "Emtia", blurb: "Altın, petrol vb. (=F)." },
];

export const INSTRUMENTS_BY_CATEGORY: Record<InstrumentCategoryId, InstrumentOption[]> = {
  fx: [
    { symbol: "USDTRY=X", label: "ABD Doları / Türk Lirası", profile: "fx" },
    { symbol: "EURTRY=X", label: "Euro / Türk Lirası", profile: "fx" },
    { symbol: "GBPTRY=X", label: "Sterlin / Türk Lirası", profile: "fx" },
    { symbol: "EURUSD=X", label: "Euro / ABD Doları", profile: "fx" },
    { symbol: "GBPUSD=X", label: "Sterlin / ABD Doları", profile: "fx" },
    { symbol: "USDJPY=X", label: "ABD Doları / Japon Yeni", profile: "fx" },
    { symbol: "USDCHF=X", label: "ABD Doları / İsviçre Frangı", profile: "fx" },
    { symbol: "AUDUSD=X", label: "Avustralya Doları / ABD Doları", profile: "fx" },
    { symbol: "USDCAD=X", label: "ABD Doları / Kanada Doları", profile: "fx" },
    { symbol: "NZDUSD=X", label: "Yeni Zelanda Doları / ABD Doları", profile: "fx" },
  ],
  crypto: [
    { symbol: "BTC-USD", label: "Bitcoin", profile: "crypto" },
    { symbol: "ETH-USD", label: "Ethereum", profile: "crypto" },
    { symbol: "SOL-USD", label: "Solana", profile: "crypto" },
    { symbol: "XRP-USD", label: "XRP", profile: "crypto" },
    { symbol: "BNB-USD", label: "BNB", profile: "crypto" },
    { symbol: "DOGE-USD", label: "Dogecoin", profile: "crypto" },
  ],
  bist: [
    { symbol: "THYAO.IS", label: "Türk Hava Yolları", profile: "stock" },
    { symbol: "AKBNK.IS", label: "Akbank", profile: "stock" },
    { symbol: "GARAN.IS", label: "Garanti BBVA", profile: "stock" },
    { symbol: "BIMAS.IS", label: "BİM", profile: "stock" },
    { symbol: "ASELS.IS", label: "ASELSAN", profile: "stock" },
    { symbol: "TUPRS.IS", label: "Tüpraş", profile: "stock" },
    { symbol: "KCHOL.IS", label: "Koç Holding", profile: "stock" },
    { symbol: "EREGL.IS", label: "Ereğli Demir Çelik", profile: "stock" },
    { symbol: "SAHOL.IS", label: "Sabancı Holding", profile: "stock" },
    { symbol: "FROTO.IS", label: "Ford Otosan", profile: "stock" },
    { symbol: "SISE.IS", label: "Şişecam", profile: "stock" },
    { symbol: "YKBNK.IS", label: "Yapı Kredi", profile: "stock" },
  ],
  us_stock: [
    { symbol: "AAPL", label: "Apple", profile: "stock" },
    { symbol: "MSFT", label: "Microsoft", profile: "stock" },
    { symbol: "GOOGL", label: "Alphabet (Google)", profile: "stock" },
    { symbol: "AMZN", label: "Amazon", profile: "stock" },
    { symbol: "META", label: "Meta", profile: "stock" },
    { symbol: "NVDA", label: "NVIDIA", profile: "stock" },
    { symbol: "TSLA", label: "Tesla", profile: "stock" },
    { symbol: "AMD", label: "AMD", profile: "stock" },
    { symbol: "JPM", label: "JPMorgan", profile: "stock" },
    { symbol: "V", label: "Visa", profile: "stock" },
  ],
  index: [
    { symbol: "^GSPC", label: "S&P 500", profile: "stock" },
    { symbol: "^DJI", label: "Dow Jones", profile: "stock" },
    { symbol: "^IXIC", label: "Nasdaq Composite", profile: "stock" },
    { symbol: "^VIX", label: "VIX", profile: "stock" },
    { symbol: "XU100.IS", label: "BIST 100", profile: "stock" },
  ],
  commodity: [
    { symbol: "GC=F", label: "Altın vadeli", profile: "stock" },
    { symbol: "SI=F", label: "Gümüş vadeli", profile: "stock" },
    { symbol: "CL=F", label: "Ham petrol (WTI)", profile: "stock" },
    { symbol: "NG=F", label: "Doğalgaz", profile: "stock" },
    { symbol: "BZ=F", label: "Brent petrol", profile: "stock" },
  ],
};
