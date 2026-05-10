import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yardım merkezi",
};

export default function YardimPage() {
  return (
    <SimpleArticle
      title="Yardım merkezi"
      description="Sık sorulan başlıkların özeti; detaylı dokümantasyon için geliştirici notlarına bakın."
    >
      <section className="space-y-2">
        <h2 className="font-heading text-heading text-lg font-semibold">Analiz neden yüklenmiyor?</h2>
        <p>
          Yerel geliştirmede arka ucun çalıştığından ve tarayıcının engellemediğinden emin olun. «NetworkError» genelde
          API adresinin yanlış olması veya sunucunun kapalı olmasından kaynaklanır.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-heading text-heading text-lg font-semibold">Sembol nereden geliyor?</h2>
        <p>
          Liste Yahoo Finance kodlarıyla uyumludur; liste dışı için gelişmiş seçenekten kod girebilirsiniz.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-heading text-heading text-lg font-semibold">Bu sonuçlar tavsiye mi?</h2>
        <p>Hayır. Grafik ve metrikler yalnızca bilgilendirme ve öğrenme içindir.</p>
      </section>
    </SimpleArticle>
  );
}
