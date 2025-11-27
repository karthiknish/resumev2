import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Mail, CalendarDays, User, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // For potential delete action

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/contacts"); // Fetch from the contacts endpoint
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch contacts");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setContacts(data.data);
        } else {
          setContacts([]);
          setError("No contacts found or invalid response format");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Could not load contacts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []); // Fetch only once on mount

  // Placeholder for delete functionality
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact message?")) {
      return;
    }
    try {
      toast.info(`Delete functionality for contact ${id} not yet implemented.`);
    } catch (err) {
      toast.error(err.message || "Failed to delete contact.");
    }
  };

  return (
    <Card className="rounded-2xl border border-border bg-card text-foreground shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-heading font-semibold text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          Contact Form Submissions ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-5 shadow-sm">
              <div className="text-3xl animate-spin">💬</div>
              <span className="text-base font-semibold text-foreground">
                Loading contacts...
              </span>
            </div>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-6 py-5 text-center shadow-sm">
              <div className="mb-4 text-6xl">😕</div>
              <h3 className="mb-2 text-xl font-heading font-semibold text-destructive">
                Oops! Something went wrong
              </h3>
              <p className="font-medium text-destructive">Error: {error}</p>
            </div>
          </div>
        )}
        {!isLoading && !error && contacts.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <div className="rounded-xl border border-border bg-muted/50 px-6 py-5 text-center shadow-sm">
              <div className="mb-4 text-6xl">📭</div>
              <h3 className="mb-2 text-xl font-heading font-semibold text-foreground">
                No Contact Submissions Yet
              </h3>
              <p className="font-medium text-muted-foreground">
                When users submit the contact form, they'll appear here!
              </p>
            </div>
          </div>
        )}
        {!isLoading && !error && contacts.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50">
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Received On</TableHead>
                  {/* <TableHead className="text-right text-gray-700 font-bold text-lg">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow
                    key={contact._id}
                    className="align-top border-b border-border transition-colors duration-200 hover:bg-muted/50"
                  >
                    <TableCell className="text-base font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-primary/20 bg-primary/10 p-1">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-medium text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-lg border border-primary/20 bg-primary/10 p-1">
                          <MessageCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                        </div>
                        <span className="font-medium text-muted-foreground">{contact.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="rounded-lg border border-primary/20 bg-primary/10 p-1">
                          <CalendarDays className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-muted-foreground">
                          {formatDate(contact.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-right">
                       <Button variant="destructive" size="sm" onClick={() => handleDelete(contact._id)}>Delete</Button>
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
