export default function ResultsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-xl shrink-0" />
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card p-3 flex items-center gap-3" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="skeleton h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3.5 w-40 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
