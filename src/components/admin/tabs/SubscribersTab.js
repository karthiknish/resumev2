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
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-black" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          <Mail className="w-6 h-6" /> 📧 Newsletter Subscribers ({subscribers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && subscribers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              No subscribers yet
            </h3>
            <p className="text-gray-600">Your newsletter is waiting for its first subscriber!</p>
          </div>
        )}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-200 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-green-200 hover:bg-green-50">
                  <TableHead className="text-green-700 font-bold text-lg">📧 Email</TableHead>
                  <TableHead className="text-green-700 font-bold text-lg">📅 Subscribed On</TableHead>
                  {/* Add Actions column later if needed */}
                  {/* <TableHead className="text-right text-green-700">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber._id}
                    className="border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300"
                  >
                    <TableCell className="font-semibold text-gray-800 py-4">
                      {subscriber.email}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{formatDate(subscriber.subscribedAt)}</span>
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
