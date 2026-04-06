import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg text-muted-foreground">
        This pixel hasn&apos;t been claimed yet.
      </p>
      <Button asChild>
        <Link href="/">Back to the Grid</Link>
      </Button>
    </div>
  );
}
