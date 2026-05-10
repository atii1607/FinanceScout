import { SimpleArticle } from "@/components/site/simple-article";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function IletisimPage() {
  return (
    <SimpleArticle
      title="İletişim"
      description="Bu demo için iletişim kanalları yer tutucudur."
    >
      <p>
        Kurumsal iletişim adresleri ve destek hatları ürünleştirme sürecinde burada yayınlanacaktır. Teknik geri bildirim
        için geliştirici dokümantasyonunuza başlıklı bir konu ile issue açmanızı öneririz.
      </p>
      <ul className="text-heading list-inside list-disc space-y-2">
        <li>E-posta: destek@finance-scout.demo (örnek)</li>
        <li>Çalışma saatleri: Pazartesi–Cuma 09:00–18:00 (örnek)</li>
      </ul>
    </SimpleArticle>
  );
}
