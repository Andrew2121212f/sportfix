import { TournamentGroupSkeleton } from "@/components/ui/skeletons";

export default function LiveLoading() {
  return (
    <div className="space-y-4">
      {/* Sport tabs skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-xl shrink-0" />
        ))}
      </div>
      {/* Match groups */}
      <TournamentGroupSkeleton rows={3} />
      <TournamentGroupSkeleton rows={2} />
      <TournamentGroupSkeleton rows={3} />
    </div>
  );
}
