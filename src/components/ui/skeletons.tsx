// Контентные скелетоны — повторяют layout реальных компонентов

/** Скелетон одной строки матча */
function MatchRowSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Статус / время */}
      <div className="w-11 sm:w-14 shrink-0 flex justify-center">
        <div className="skeleton h-5 w-8 rounded" />
      </div>

      {/* Команды + счёт */}
      <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-end gap-2">
          <div className="skeleton h-3.5 w-20 rounded" />
          <div className="skeleton h-6 w-6 rounded-full shrink-0" />
        </div>
        <div className="skeleton h-7 w-14 rounded-lg" />
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-6 rounded-full shrink-0" />
          <div className="skeleton h-3.5 w-20 rounded" />
        </div>
      </div>

      {/* Коэффициенты (только десктоп) */}
      <div className="hidden lg:flex items-center gap-1 shrink-0">
        <div className="skeleton h-7 w-11 rounded-lg" />
        <div className="skeleton h-7 w-11 rounded-lg" />
        <div className="skeleton h-7 w-11 rounded-lg" />
      </div>
    </div>
  );
}

/** Скелетон группы турнира (заголовок + N строк матчей) */
export function TournamentGroupSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      {/* Заголовок турнира */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-surface/50">
        <div className="skeleton h-5 w-5 rounded-md shrink-0" />
        <div className="skeleton h-3.5 w-32 rounded" />
        <div className="ml-auto skeleton h-3 w-16 rounded" />
      </div>

      {/* Строки матчей */}
      <div className="divide-y divide-border">
        {[...Array(rows)].map((_, i) => (
          <MatchRowSkeleton key={i} index={i} />
        ))}
      </div>

      {/* Футер */}
      <div className="px-4 py-2.5 border-t border-border flex justify-center">
        <div className="skeleton h-3.5 w-28 rounded" />
      </div>
    </div>
  );
}

/** Скелетон карточки новости */
export function NewsCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="card overflow-hidden flex gap-3 p-3"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="skeleton w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

/** Скелетон элемента Popular Leagues */
export function PopularLeagueSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="card p-3 flex items-center gap-3"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3.5 w-28 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
      <div className="skeleton h-5 w-8 rounded-md" />
    </div>
  );
}
