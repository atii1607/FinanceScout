import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetler",
};

export default function HizmetlerPage() {
  return (
    <SimpleArticle
      title="Hizmetler"
      description="Şu an sunduğumuz çözümler ve yakında genişletilebilecek başlıkların özeti."
    >
      <section className="space-y-3">
        <h2 className="font-heading text-heading text-lg font-semibold">Piyasa analizi</h2>
        <p>
          Yahoo Finance uyumlu sembollerle günlük kapanış serisi indirilir; Prophet tabanlı çekirdek ile kısa ufuklu tahmin
          çizgisi ve isteğe bağlı kesit tarihi ile geçmişe dönük karşılaştırma üretilir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-heading text-lg font-semibold">Özet metrikler</h2>
        <p>
          RMSE, MAE ve basit oynaklık özetleri analiz ekranında yer alır; bunlar model davranışına dair yön gösterici
          bilgilerdir, garanti veya getiri taahhüdü değildir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-heading text-lg font-semibold">Yol haritası (yer tutucu)</h2>
        <p>
          Çoklu portföy, uyarılar ve rapor dışa aktarım gibi özellikler için sayfalar ve API tasarımı hazırlık aşamasındadır.
        </p>
      </section>
    </SimpleArticle>
  );
}
