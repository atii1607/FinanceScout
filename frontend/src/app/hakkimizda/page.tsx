import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurumsal",
};

export default function HakkimizdaPage() {
  return (
    <SimpleArticle
      title="Hakkımızda"
      description="FinanceScout; şeffaf süreçler ve ölçülebilir özetler etrafında şekillenen bir dijital analiz deneyimidir."
    >
      <p>
        Amacımız, karmaşık piyasa verisini anlaşılır görünümler ve tutarlı metriklerle sunmaktır. Bu sürüm bir demo ve
        öğrenme platformudur; gerçek bankacılık veya aracılık hizmeti sunmaz.
      </p>
      <p>
        Ürün yol haritamız; güvenilir veri kaynakları, açıklanabilir modeller ve kullanıcı denetimini ön planda tutan
        özellikler üzerine kuruludur.
      </p>
    </SimpleArticle>
  );
}
