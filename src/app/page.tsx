import { Dashboard } from "@/components/dashboard";
import { getSalesData } from "@/lib/sales-data";

export const revalidate = 3600;

export default async function Home() {
  let rows;
  let error: string | null = null;

  try {
    rows = await getSalesData();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">매출 대시보드</h1>
        <p className="text-sm text-text-muted">공식몰 일별 매출 데이터 기반</p>
      </header>

      {error || !rows ? (
        <div className="rounded-lg border border-line bg-surface p-6 text-sm text-delta-bad">
          데이터를 불러오지 못했습니다: {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-6 text-sm text-text-muted">
          표시할 데이터가 없습니다.
        </div>
      ) : (
        <Dashboard rows={rows} />
      )}
    </div>
  );
}
