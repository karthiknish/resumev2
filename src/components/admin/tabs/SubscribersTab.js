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
    <Card className="border-gray-700 bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" /> Newsletter Subscribers (
          {subscribers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        {error && !isLoading && (
          <p className="text-red-400 text-center py-10">Error: {error}</p>
        )}
        {!isLoading && !error && subscribers.length === 0 && (
          <p className="text-gray-400 text-center py-10">No subscribers yet.</p>
        )}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Subscribed On</TableHead>
                  {/* Add Actions column later if needed */}
                  {/* <TableHead className="text-right text-gray-300">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber._id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(subscriber.subscribedAt)}
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
