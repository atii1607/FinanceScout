import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yardım Merkezi",
};

export default function YardimPage() {
  return (
    <SimpleArticle
      title="Yardım Merkezi"
      description="FinanceScout platformu hakkında merak ettiğiniz soruların yanıtları, kullanım kılavuzları ve teknik destek detayları."
    >
      <section>
        <h2>Platforma Başlarken</h2>
        <p>
          FinanceScout, piyasa verilerini analiz etmek ve geleceğe yönelik öngörüler oluşturmak için tasarlanmış bir 
          karar destek mekanizmasıdır. Platformu en verimli şekilde kullanmak için şu adımları izleyebilirsiniz:
        </p>
        <ul>
          <li><strong>Sembol Seçimi:</strong> Analiz merkezinde, incelemek istediğiniz hisse senedi, döviz veya kripto varlık sembolünü arama kutusuna yazın.</li>
          <li><strong>Zaman Aralığı:</strong> Verilerin ne kadar geriye gitmesini istediğinizi seçin. Genellikle daha uzun tarihsel veri, modellerin mevsimsellik etkilerini daha iyi kavramasını sağlar.</li>
          <li><strong>Tahmin Parametreleri:</strong> Öngörü süresini (örn: 30 gün) belirleyerek algoritmanın gelecek projeksiyonunu oluşturun.</li>
        </ul>
      </section>

      <section>
        <h2>Sıkça Sorulan Sorular (SSS)</h2>
        
        <h3>Analiz ve Grafik Ekranı Neden Yüklenmiyor?</h3>
        <p>
          Grafiklerin veya analiz sonuçlarının ekrana gelmemesi genellikle geçici bağlantı veya tarayıcı 
          kaynaklı durumlardan meydana gelmektedir. Böyle bir durumla karşılaştığınızda aşağıdaki adımları 
          kontrol edebilirsiniz:
        </p>
        <ul>
          <li><strong>Sayfa Yenileme ve İnternet Bağlantısı:</strong> İnternet bağlantınızın aktif olduğunu doğruladıktan sonra sayfayı yenileyerek veri akışını tekrar tetikleyebilirsiniz.</li>
          <li><strong>Tarayıcı Eklentileri:</strong> Kullandığınız bazı reklam engelleyiciler (ad-blocker) veya katı gizlilik eklentileri, platformun veri sağlayıcı servislerle kurduğu güvenli bağlantıyı kesintiye uğratabilir. Sorun devam ederse platformu gizli sekmede veya eklentileri devre dışı bırakarak test edebilirsiniz.</li>
          <li><strong>Hatalı Sembol:</strong> Girdiğiniz sembol Yahoo Finance veri tabanında bulunmuyor olabilir. Lütfen sembolün doğruluğunu kontrol edin (Örn: BIST hisseleri için sonuna .IS ekleyin; THYAO.IS gibi).</li>
        </ul>

        <h3>Tahminler ne kadar güvenilir?</h3>
        <p>
          Platformumuz <strong>Prophet</strong> algoritmasını kullanır. Tahminler, geçmiş verilerdeki trendleri ve mevsimsellikleri baz alır. 
          Grafiklerde gördüğünüz gölgeli alanlar %95 güven aralığını temsil eder. Ancak unutulmamalıdır ki; ani haber akışları, jeopolitik krizler 
          veya beklenmedik piyasa şokları matematiksel modeller tarafından önceden bilinemez.
        </p>

        <h3>Veriler ne sıklıkla güncelleniyor?</h3>
        <p>
          Verilerimiz Yahoo Finance üzerinden anlık veya gecikmeli olarak çekilmektedir. Analiz başlattığınız anda en güncel 
          piyasa verileri çekilerek modellerimiz o anki duruma göre yeniden eğitilir ve sonuçlar üretilir.
        </p>
      </section>

      <section>
        <h2>Teknik Kavramlar ve Sözlük</h2>
        <p>
          Analiz sonuçlarını daha iyi yorumlamanıza yardımcı olacak bazı temel terimler:
        </p>
        <ul>
          <li><strong>RMSE (Kök Ortalama Kare Hata):</strong> Tahminlerin gerçek verilerden ne kadar saptığını gösterir. Bu değer ne kadar düşükse, modelin geçmiş performansı o kadar tutarlıdır.</li>
          <li><strong>Trend:</strong> Varlığın uzun vadeli yönünü ifade eder.</li>
          <li><strong>Mevsimsellik (Seasonality):</strong> Haftalık, aylık veya yıllık döngülerde tekrarlayan hareketleri gösterir.</li>
        </ul>
      </section>

      <section>
        <h2>Bize Ulaşın</h2>
        <p>
          Yardım merkezinde cevabını bulamadığınız sorularınız için <strong>İletişim</strong> sayfamız üzerinden 
          destek ekibimize mesaj gönderebilirsiniz. Teknik hataları bildirirken lütfen aldığınız hata mesajını ve 
          kullandığınız sembolü belirtmeyi unutmayın.
        </p>
      </section>
    </SimpleArticle>
  );
}
