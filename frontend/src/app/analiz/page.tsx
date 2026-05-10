import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/site/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analiz merkezi",
};

export default function AnalizPage() {
  return (
    <>
      <PageHeader
        title="Analiz merkezi"
        description="Varlık seçin veya sembol girin; geçmiş kapanışlara dayalı özet tahmin ve geçmişe dönük test grafiklerini tek ekranda görün. Tüm çıktılar bilgilendirme amaçlıdır."
      />
      <Dashboard />
    </>
  );
}
