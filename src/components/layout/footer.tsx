import Link from "next/link";
import { CheckSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span>hirecheck.io</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link href="/analyze" className="hover:text-foreground transition-colors">Analyze</Link>
          <a href="mailto:hello@hirecheck.io" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} hirecheck.io — AI analysis, not career advice.
        </p>
      </div>
    </footer>
  );
}
