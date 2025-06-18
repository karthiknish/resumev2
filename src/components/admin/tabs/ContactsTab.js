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
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-2xl rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-black text-gray-800" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          Contact Form Submissions ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
              <div className="animate-spin text-3xl">💬</div>
              <span className="text-gray-700 font-bold text-xl">Loading contacts...</span>
            </div>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          </div>
        )}
        {!isLoading && !error && contacts.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                No Contact Submissions Yet
              </h3>
              <p className="text-gray-600 font-medium">When users submit the contact form, they'll appear here!</p>
            </div>
          </div>
        )}
        {!isLoading && !error && contacts.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-200 hover:bg-purple-50/50">
                  <TableHead className="text-gray-700 font-bold text-lg">Name</TableHead>
                  <TableHead className="text-gray-700 font-bold text-lg">Email</TableHead>
                  <TableHead className="text-gray-700 font-bold text-lg">Message</TableHead>
                  <TableHead className="text-gray-700 font-bold text-lg">Received On</TableHead>
                  {/* <TableHead className="text-right text-gray-700 font-bold text-lg">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow
                    key={contact._id}
                    className="border-purple-100 hover:bg-purple-50/30 transition-colors duration-200 align-top"
                  >
                    <TableCell className="font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors duration-200"
                      >
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-pre-wrap break-words">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mt-1">
                          <MessageCircle className="w-4 h-4 text-white flex-shrink-0" />
                        </div>
                        <span className="text-gray-700 font-medium">{contact.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <CalendarDays className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{formatDate(contact.createdAt)}</span>
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
