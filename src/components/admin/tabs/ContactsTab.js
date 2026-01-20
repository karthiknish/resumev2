import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Mail, CalendarDays, User, MessageCircle, AlertCircle, Inbox, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableRowSkeleton } from "@/components/ui/loading-states";

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

export default function ContactsTab({ onUnreadCountUpdate }) {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const CONTACTS_PER_PAGE = 10;

  // Fetch contacts when page changes
  useEffect(() => {
    const fetchContacts = async (page) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/contacts?page=${page}&limit=${CONTACTS_PER_PAGE}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch contacts");
        }
        const data = await response.json();
        if (data.success && data.data && data.data.contacts) {
          setContacts(data.data.contacts);
          setTotalPages(data.data.pagination?.totalPages || 1);
          setTotalContacts(data.data.pagination?.total || 0);
        } else {
          setContacts([]);
          setTotalPages(1);
          setTotalContacts(0);
          setError("No contacts found or invalid response format");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Could not load contacts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Placeholder for delete functionality
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact message?")) {
      return;
    }
    
    // Find the contact to check if it's unread
    const contactToDelete = contacts.find(c => c._id === id);
    const wasUnread = contactToDelete && !contactToDelete.isRead;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete contact");
      }

      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Contact message deleted successfully.");

      // Update unread count if we deleted an unread message
      if (wasUnread && typeof onUnreadCountUpdate === "function") {
        onUnreadCountUpdate((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete contact.");
    }
  };

  const handleToggleRead = async (contact) => {
    const newStatus = !contact.isRead;
    try {
      const response = await fetch("/api/contacts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: contact._id,
          isRead: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update contact status");
      }

      setContacts((prev) =>
        prev.map((c) => (c._id === contact._id ? { ...c, isRead: newStatus } : c))
      );

      // Update unread count
      if (typeof onUnreadCountUpdate === "function") {
        onUnreadCountUpdate((prev) => 
          newStatus ? Math.max(0, (prev || 0) - 1) : (prev || 0) + 1
        );
      }

      toast.success(`Message marked as ${newStatus ? "read" : "unread"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update contact status.");
    }
  };

  return (
    <Card className="rounded-2xl border border-border bg-card text-foreground shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-heading font-semibold text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          Contact Form Submissions ({totalContacts})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50">
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Received On
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-b border-border">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-6 py-5 text-center shadow-sm">
              <div className="mb-4 flex justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
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
              <div className="mb-4 flex justify-center">
                <Inbox className="w-12 h-12 text-muted-foreground" />
              </div>
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
          <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50">
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Received On
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </TableHead>
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
                        {!contact.isRead && (
                          <span
                            className="flex h-2 w-2 rounded-full bg-primary"
                            title="New message"
                            aria-label="New unread message"
                          ></span>
                        )}
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
                        <span className="font-medium text-muted-foreground">
                          {contact.message}
                        </span>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 rounded-lg p-0 ${contact.isRead ? "text-muted-foreground" : "text-primary"}`}
                          onClick={() => handleToggleRead(contact)}
                          aria-label={contact.isRead ? "Mark as unread" : "Mark as read"}
                          title={contact.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {contact.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 rounded-lg px-3 text-xs font-semibold"
                          onClick={() => handleDelete(contact._id)}
                          aria-label="Delete contact submission"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-4 py-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || isLoading}
                className="rounded-xl border border-border bg-card px-4 py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/50 disabled:opacity-40"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="rounded-xl border border-border bg-muted/50 px-4 py-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isLoading}
                className="rounded-xl border border-border bg-card px-4 py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/50 disabled:opacity-40"
                aria-label="Go to next page"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
      </CardContent>
    </Card>
  );
}
