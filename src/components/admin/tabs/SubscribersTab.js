import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/ui/loading-states";
import { EmptyTable } from "@/components/ui/empty-state";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    // Use UK format
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/subscribers"); // Fetch from the new endpoint
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch subscribers");
        }
        const data = await response.json();
        setSubscribers(data.data || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Could not load subscribers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-foreground">
          <Mail className="w-5 h-5 text-primary" /> Newsletter Subscribers ({subscribers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading && (
          <div className="overflow-x-auto bg-card rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subscribed On
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="py-3">
                      <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-destructive">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && subscribers.length === 0 && (
          <div className="overflow-x-auto bg-card rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subscribed On
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <EmptyTable
                  title="No subscribers yet"
                  description="Your newsletter is waiting for its first subscriber."
                  illustration="mail"
                  colSpan={2}
                />
              </TableBody>
            </Table>
          </div>
        )}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="overflow-x-auto bg-card rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subscribed On
                  </TableHead>
                  {/* <TableHead className="text-right text-slate-500">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber._id}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-3">
                      {subscriber.email}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="font-medium text-muted-foreground">
                          {formatDate(subscriber.subscribedAt)}
                        </span>
                      </div>
                    </TableCell>
                    {/* Add Action buttons later if needed */}
                    {/* <TableCell className="text-right">
                       <Button variant="destructive" size="sm" onClick={() => handleDelete(subscriber._id)}>Delete</Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
