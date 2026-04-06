import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PurchaseSuccessPage() {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Purchase Successful!</CardTitle>
          <CardDescription>
            Your pixel block is now live on the grid.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Your ad is now visible to everyone visiting MyOneDollarAd.com. You
            can manage your pixels from the dashboard.
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <Link href="/">View Grid</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
