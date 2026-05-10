import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK aydınlatma",
};

export default function KvkkPage() {
  return (
    <SimpleArticle
      title="KVKK aydınlatma metni"
      description="Örnek yer tutucu — gerçek başvurular için hukuki metin hazırlanmalıdır."
    >
      <p>
        Veri sorumlusu, işleme amaçları, hukuki sebepler, aktarılan alıcı grupları ve ilgili kişinin hakları bu bölümde
        açıklanmalıdır. Demo ortamında gerçek kişisel veri işlenmemektedir.
      </p>
      <p>
        Taleplerinizi iletmek için iletişim sayfasındaki kanallar (yer tutucu) kullanılabilir.
      </p>
    </SimpleArticle>
  );
}
