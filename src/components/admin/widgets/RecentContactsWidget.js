import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { ContactListItemSkeleton } from "@/components/ui/loading-states";
import { EmptyState } from "@/components/ui/empty-state";

// Helper to format date relative to now
const formatRelativeDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    console.error("Error formatting relative date:", dateString, e);
    return dateString; // Fallback
  }
};

export default function RecentContactsWidget() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch only the 5 most recent contacts
        const response = await fetch("/api/contacts?limit=5");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch recent contacts"
          );
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setContacts(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
        toast.error(`Could not load recent contacts: ${err.message}`);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentContacts();
  }, []);

  return (
    <Card className="border-gray-700 bg-gray-900 text-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recent Contacts</CardTitle>
        <Mail className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-4">
        {isLoading && <ContactListItemSkeleton />}
        {error && !isLoading && (
          <div className="flex justify-center items-center flex-grow">
            <p className="text-red-400 text-center">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && contacts.length === 0 && (
          <div className="flex-grow">
            <EmptyState
              title="No recent contacts"
              description="Contact form submissions will appear here"
              illustration="inbox"
              className="py-6"
            />
          </div>
        )}
        {!isLoading && !error && contacts.length > 0 && (
          <div className="space-y-4 flex-grow">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-shrink-0 pt-1">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {contact.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />{" "}
                    {formatRelativeDate(contact.createdAt)}
                  </p>
                </div>
                {/* Optional: Add a button/link to view the full message if needed */}
              </div>
            ))}
          </div>
        )}
        {/* Link to view all contacts */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-600 hover:bg-gray-700"
            asChild
          >
            <Link href="/admin?tab=Contacts">View All Contacts</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
