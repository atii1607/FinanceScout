import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik",
};

export default function GizlilikGuvenlikPage() {
  return (
    <SimpleArticle
      title="Gizlilik ve Güvenlik"
      description="Verilerinizin nasıl işlendiği, platform güvenliği ve gizlilik politikalarımız hakkında kapsamlı bilgiler."
    >
      <section>
        <h2>Gizlilik Politikamız</h2>
        <p>
          FinanceScout, kullanıcılarının dijital gizliliğini korumayı en üst düzey önceliği olarak kabul eder. 
          Platformumuz, kişisel verilerinizi toplamaz, saklamaz veya üçüncü taraflarla paylaşmaz.
        </p>
        
        <h3>Çerezler ve İzleme Teknolojileri</h3>
        <p>
          Platformumuz, sadece temel işlevselliği sağlamak ve kullanıcı deneyimini iyileştirmek amacıyla minimum 
          düzeyde teknik çerez kullanabilir. Bu çerezler:
        </p>
        <ul>
          <li><strong>Oturum Yönetimi:</strong> Uygulamanın kararlı çalışmasını sağlar.</li>
          <li><strong>Performans:</strong> Platformun hızını ve hata raporlarını anonim olarak izlememize yardımcı olur.</li>
        </ul>
      </section>

      <section>
        <h2>Güvenlik Standartlarımız</h2>
        <p>
          FinanceScout, modern web güvenliği standartlarına uygun bir mimari ile inşa edilmiştir. Veri akışınız ve 
          platform içi etkileşimleriniz şu katmanlarla korunur:
        </p>
        <ul>
          <li><strong>Veri Minimizasyonu:</strong> Tahminleme süreçlerinde sadece halka açık piyasa verileri kullanılır. Kullanıcılara ait hiçbir özel finansal veri talep edilmez.</li>
          <li><strong>Güvenli API Entegrasyonu:</strong> Yahoo Finance ve diğer veri sağlayıcılar ile kurulan bağlantılar, güvenli protokoller üzerinden yönetilir.</li>
        </ul>
      </section>

      <section>
        <h2>Kullanıcı Sorumluluğu</h2>
        <p>
          Her ne kadar biz platform düzeyinde her türlü önlemi alsak da, uç nokta güvenliği kullanıcıların sorumluluğundadır. 
          Güvenli bir deneyim için güncel tarayıcılar kullanmanızı ve güvenilmeyen ağlarda işlem yapmamanızı öneririz.
        </p>
      </section>

      <section>
        <h2>Üçüncü Taraf Bağlantıları</h2>
        <p>
          Sayfalarımızda yer alan dış bağlantıların (Örn: Yahoo Finance, haber kaynakları) kendilerine ait gizlilik 
          politikaları bulunmaktadır. FinanceScout, bu dış mecraların içeriklerinden veya veri politikalarından 
          sorumlu tutulamaz.
        </p>
      </section>

      <section>
        <h2>İletişim ve Bildirimler</h2>
        <p>
          Güvenlik açıklarını bildirmek veya gizlilik politikasındaki haklarınız hakkında bilgi almak için 
          <strong>iletisim@financescout.com</strong> adresi üzerinden bizimle irtibata geçebilirsiniz.
        </p>
      </section>

      <section>
        <p className="text-sm italic">
          Son Güncelleme: 18 Mayıs 2026
        </p>
      </section>
    </SimpleArticle>
  );
}
