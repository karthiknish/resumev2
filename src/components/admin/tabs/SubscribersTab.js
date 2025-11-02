import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Mail, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui table

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
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
          <Mail className="w-5 h-5 text-primary" /> Newsletter Subscribers ({subscribers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-red-500">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && subscribers.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <h3 className="text-base font-heading font-semibold text-slate-900">
              No subscribers yet
            </h3>
            <p className="text-sm text-slate-600">
              Your newsletter is waiting for its first subscriber.
            </p>
          </div>
        )}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-slate-50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subscribed On
                  </TableHead>
                  {/* <TableHead className="text-right text-slate-500">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber._id}
                    className="border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-700 py-3">
                      {subscriber.email}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="font-medium text-slate-600">
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
