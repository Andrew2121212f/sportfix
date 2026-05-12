import { TournamentGroupSkeleton } from "@/components/ui/skeletons";

// Лоадер для главной страницы (dashboard)
export default function HomeLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {/* Live секция */}
          <div className="flex items-center gap-2">
            <div className="skeleton h-2.5 w-2.5 rounded-full" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
          <TournamentGroupSkeleton rows={3} />
          <TournamentGroupSkeleton rows={3} />

          {/* Prematch секция */}
          <div className="skeleton h-4 w-32 rounded mt-4" />
          <TournamentGroupSkeleton rows={4} />
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          <div className="skeleton h-4 w-28 rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-3 flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-28 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
