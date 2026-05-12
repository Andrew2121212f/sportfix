export default function EventDetailLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="skeleton h-5 w-32 rounded" />

      <div className="card flex items-center gap-3 px-4 py-3">
        <div className="skeleton h-7 w-7 rounded-md shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
        </div>
      </div>

      <div className="card p-6 sm:p-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="skeleton h-5 w-24 rounded" />
          </div>
          <div className="skeleton h-12 w-24 rounded-lg" />
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="skeleton h-5 w-24 rounded" />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
        </div>
      </div>

      <div className="skeleton h-14 w-full rounded-2xl" />
    </div>
  );
}
