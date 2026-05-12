import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
        <Newspaper className="h-8 w-8 text-brand-orange" />
      </div>
      <h1 className="text-2xl font-extrabold">Article not found</h1>
      <p className="text-text-muted max-w-md">
        The article you’re looking for doesn’t exist or was removed. Maybe try our latest news?
      </p>
      <Link
        href="/en/news"
        className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:brightness-110 transition-all"
      >
        Browse news
      </Link>
    </div>
  );
}
