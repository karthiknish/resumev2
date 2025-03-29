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
      // TODO: Implement API call to DELETE /api/contacts?id=... or /api/contacts/[id]
      toast.info(`Delete functionality for contact ${id} not yet implemented.`);
      // Example:
      // const response = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('Failed to delete contact');
      // setContacts(prev => prev.filter(c => c._id !== id));
      // toast.success("Contact deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete contact.");
    }
  };

  return (
    <Card className="border-gray-700 bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" /> Contact Form Submissions (
          {contacts.length})
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
        {!isLoading && !error && contacts.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No contact submissions yet.
          </p>
        )}
        {!isLoading && !error && contacts.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Message</TableHead>
                  <TableHead className="text-gray-300">Received On</TableHead>
                  {/* <TableHead className="text-right text-gray-300">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow
                    key={contact._id}
                    className="border-gray-800 hover:bg-gray-800/50 align-top"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-400 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-pre-wrap break-words">
                      {" "}
                      {/* Allow message wrapping */}
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span>{contact.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(contact.createdAt)}
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
