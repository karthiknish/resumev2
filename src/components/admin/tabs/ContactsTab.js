import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal"; // Import the Modal component

function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page (can be made configurable)

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        console.log("Number of contacts:", data.data.length);
        setContacts(data.data);
      } else {
        setError("Failed to load contacts or invalid data format.");
        setContacts([]);
      }
    } catch (e) {
      console.error("Error fetching contacts:", e);
      setError(`Failed to fetch contacts: ${e.message}`);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle row click and open modal
  const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  // Function to handle deleting a contact
  const handleDeleteContact = async (contactId) => {
    if (!contactId) return;

    if (window.confirm("Are you sure you want to delete this contact entry?")) {
      try {
        const response = await fetch(`/api/contacts/${contactId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to delete contact: ${response.status}`
          );
        }

        // Remove deleted contact from state
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== contactId)
        );
        closeModal(); // Close modal after successful deletion
        // Optionally add a success notification here
      } catch (err) {
        console.error("Error deleting contact:", err);
        alert(`Error deleting contact: ${err.message}`);
      }
    }
  };

  return (
    <FadeIn>
      <Card className="glow-card">
        <CardHeader className="bg-black rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
            Contact Form Entries
          </CardTitle>
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
        </CardHeader>
        <CardContent className="bg-gray-900 p-0">
          {isLoading ? (
            <p className="text-gray-300 p-4 text-center">Loading contacts...</p>
          ) : error ? (
            <p className="text-red-500 p-4 text-center">{error}</p>
          ) : filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 border-b-2">
                    <TableHead className="text-gray-300 py-3 px-4 font-bold">
                      Name
                    </TableHead>
                    <TableHead className="text-gray-300 py-3 px-4 font-bold">
                      Email
                    </TableHead>
                    <TableHead className="text-gray-300 py-3 px-4 font-bold">
                      Message
                    </TableHead>
                    <TableHead className="text-gray-300 py-3 px-4 font-bold text-right">
                      Date Received
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Map over currentContacts for pagination */}
                  {currentContacts.map((contact) => (
                    <TableRow
                      key={contact._id}
                      className="border-gray-700 hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => handleRowClick(contact)} // Add onClick handler
                    >
                      <TableCell className="font-medium text-white py-3 px-4">
                        {contact.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300 py-3 px-4">
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {contact.email || "N/A"}
                        </a>
                      </TableCell>
                      <TableCell className="text-gray-300 py-3 px-4 max-w-sm truncate">
                        {contact.message || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-400 py-3 px-4 text-right">
                        {format(
                          new Date(contact.createdAt || new Date()),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-400 p-4 text-center">
              No contact entries found
              {searchTerm ? " matching your search" : ""}.
            </p>
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 p-4 border-t border-gray-700">
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for displaying full contact entry */}
      {/* Ensure props match the refactored Modal: isOpen, onClose, children */}
      {selectedContact && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* Content goes inside as children */}
          <h2 className="text-2xl font-bold mb-4 text-white">
            Contact Entry Details
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Name:</strong> {selectedContact.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${selectedContact.email}`}
                className="text-blue-400 hover:underline"
              >
                {selectedContact.email || "N/A"}
              </a>
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {format(
                new Date(selectedContact.createdAt || new Date()),
                "MMM dd, yyyy 'at' HH:mm"
              )}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p>
                <strong>Message:</strong>
              </p>
              <p className="whitespace-pre-wrap break-words">
                {selectedContact.message || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-6 text-right">
            {/* Delete Button */}
            <Button
              onClick={() => handleDeleteContact(selectedContact._id)}
              className="bg-red-600 hover:bg-red-700 text-white mr-2" // Added margin
            >
              Delete
            </Button>
            {/* Close Button */}
            <Button
              onClick={closeModal}
              className="bg-gray-600 hover:bg-gray-700 text-white" // Adjusted close button style
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </FadeIn>
  );
}

export default ContactsTab;
