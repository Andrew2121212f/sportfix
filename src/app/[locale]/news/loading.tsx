import { NewsCardSkeleton } from "@/components/ui/skeletons";

export default function NewsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-20 rounded-xl shrink-0" />
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="skeleton aspect-video lg:min-h-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <NewsCardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
