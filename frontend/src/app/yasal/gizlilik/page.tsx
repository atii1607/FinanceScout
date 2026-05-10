import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik bildirimi",
};

export default function GizlilikPage() {
  return (
    <SimpleArticle
      title="Gizlilik bildirimi"
      description="Örnek metin — hukuki danışmanlık yerine geçmez."
    >
      <p>
        Bu platform demo kapsamındadır. Kişisel veri işleme faaliyetleri gerçek bir üretim ortamına göre tanımlanmalı ve
        ilgili mevzuata uygun aydınlatma metinleri hazırlanmalıdır.
      </p>
      <p>
        Çerez ve günlük politikaları, üçüncü taraf entegrasyonları ve saklama süreleri için bu sayfa güncellenecektir.
      </p>
    </SimpleArticle>
  );
}
