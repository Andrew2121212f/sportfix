import { TournamentGroupSkeleton } from "@/components/ui/skeletons";

export default function MatchesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-xl shrink-0" />
        ))}
      </div>
      <TournamentGroupSkeleton rows={4} />
      <TournamentGroupSkeleton rows={3} />
      <TournamentGroupSkeleton rows={4} />
    </div>
  );
}
