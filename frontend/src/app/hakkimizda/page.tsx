import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurumsal",
};

export default function HakkimizdaPage() {
  return (
    <SimpleArticle
      title="Hakkımızda"
      description="FinanceScout; karmaşık piyasa verilerini stratejik öngörülere dönüştüren, modern, dinamik ve şeffaf bir finansal analiz ekosistemidir."
    >
      <section>
        <p>
          FinanceScout, finans dünyasının bilgi kirliliğini ve gürültüsünü minimize etmek, yatırımcıların 
          veri odaklı karar alma süreçlerini desteklemek amacıyla geliştirilmiş ileri nesil bir dijital platformdur. 
          Amacımız, sadece anlık fiyat hareketlerini listelemek değil; bu hareketlerin arkasında yatan makro ve mikro 
          trendleri, döngüsel hareketleri ve olası gelecek senaryolarını bilimsel ve matematiksel modellerle herkes 
          için anlaşılır kılmaktır.
        </p>
      </section>

      <section>
        <h2>Teknolojimiz ve Yaklaşımımız</h2>
        <p>
          Platformumuzun analitik çekirdeğinde, zaman serisi tahminlemesinde küresel standartları belirleyen ve Meta 
          (Facebook) tarafından açık kaynaklı olarak geliştirilen <strong>Prophet</strong> kütüphanesi 
          yer almaktadır. Bu ileri seviye ekonometrik ve matematiksel modelleme altyapısı sayesinde piyasa verilerini şu bileşenlerle işliyoruz:
        </p>
        <ul>
          <li>
            <strong>Gelişmiş Trend Analizi:</strong> Fiyat hareketlerindeki uzun vadeli eğilimleri; yıllık, haftalık ve günlük mevsimsellik etkilerinden tamamen arındırarak en saf haliyle sunuyoruz. Bu sayede piyasa tuzaklarını daha net analiz edebilirsiniz.
          </li>
          <li>
            <strong>Güven Aralıklı Gelecek Öngörüleri:</strong> Geçmiş fiyat hareketleri ve hacim verilerini derinlemesine inceleyerek, gelecek dönemlere ait tahminleri tek bir veri noktası yerine, matematiksel olasılıklara dayanan dinamik güven aralıkları (%95 olasılık bantları) ile üretiyoruz.
          </li>
          <li>
            <strong>Matematiksel Doğrulama ve Volatilite Takibi:</strong> Algoritmalarımızın ürettiği tahminlerin başarısını ve sapma paylarını RMSE (Kök Ortalama Kare Hata) ve MAE (Ortalama Mutlak Hata) gibi finansal istatistik metrikleriyle anlık olarak test ediyor, piyasa oynaklığını matematiksel olarak ölçüyoruz.
          </li>
        </ul>
      </section>

      <section>
        <h2>Kapsamlı Küresel Veri Ağı</h2>
        <p>
          Borsa İstanbul&apos;dan (BIST) Wall Street endekslerine, yüksek volatiliteye sahip kripto para piyasalarından 
          küresel emtia ve döviz paritelerine (Forex) kadar oldukça geniş bir finansal spektrumda analiz imkanı tanıyoruz. 
          Gelişmiş <strong>Yahoo Finance API</strong> entegrasyonumuz ve optimize edilmiş veri çekme 
          mimarimiz sayesinde, küresel piyasaların nabzını milisaniyeler düzeyinde tutarak stratejilerinize hız kazandırıyoruz.
        </p>
      </section>

      <section>
        <h2>Kurucu Ekibimiz</h2>
        <p>
          FinanceScout, teknoloji ve finansın kesişim kümesinde değer üretmeyi hedefleyen, analitik düşünce yapısına sahip 
          vizyoner bir çekirdek ekip tarafından hayata geçirilmiştir. Sürdürülebilir finansal teknolojiler geliştirmek adına 
          çalışmalarımızı küresel standartlarda sürdürüyoruz:
        </p>
        <ul>
          <li>
            <strong>Kurucu Ortak & Yazılım Geliştirici:</strong> Mehmet Emin Küçükkurt
          </li>
          <li>
            <strong>Veri Bilimcisi:</strong> Ahmet Topçu
          </li>
          <li>
            <strong>Finansal Analist:</strong> Ataman Gazozcu
          </li>
        </ul>
      </section>

      <section>
        <h2>Önemli Not</h2>
        <p>
          FinanceScout bir demo, araştırma ve öğrenme platformudur. Sunulan analizler, tahminler ve grafikler 
          tamamen algoritmik modellerin matematiksel çıktılarıdır ve kesinlikle <strong>yatırım tavsiyesi niteliği taşımaz</strong>. 
          Platformumuz üzerinde gerçek bir bankacılık, portföy yönetimi, yatırım danışmanlığı veya aracılık hizmeti sunulmamaktadır.
        </p>
      </section>
    </SimpleArticle>
  );
}