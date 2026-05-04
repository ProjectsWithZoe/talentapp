import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span>TalentApp</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <Button asChild size="sm">
            <Link href="/analyze">Check My Resume</Link>
          </Button>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
