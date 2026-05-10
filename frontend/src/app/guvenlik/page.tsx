import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Güvenlik",
};

export default function GuvenlikPage() {
  return (
    <SimpleArticle
      title="Güvenlik ve güven"
      description="Demo mimarisinde verinin nasıl işlendiği ve nelere dikkat etmeniz gerektiği."
    >
      <p>
        FinanceScout tarayıcınızdan doğrudan kendi çalıştırdığınız arka uca bağlanır; kimlik doğrulama veya ödeme verisi
        talep etmez. Üretim ortamında HTTPS ve erişim günlükleri standart olarak kullanılmalıdır.
      </p>
      <p>
        Sonuçlar makine öğrenmesi tabanlıdır ve geçmiş performans geleceği yansıtmaz. Gerçek işlemler için düzenleyici
        gerekliliklere ve kurum içi risk politikalarına uyun.
      </p>
      <p>
        Güvenlik ile ilgili sorularınız için iletişim kanallarımızdan bize ulaşabilirsiniz (demo iletişim bilgileri Yakında
        alanında yer alır).
      </p>
    </SimpleArticle>
  );
}
