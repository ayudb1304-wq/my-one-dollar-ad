import { TOTAL_PIXELS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <p>
          {TOTAL_PIXELS.toLocaleString()} pixels &middot; $1 each &middot; Own a
          piece of the internet
        </p>
        <p>&copy; {new Date().getFullYear()} MyOneDollarAd.com</p>
      </div>
    </footer>
  );
}
