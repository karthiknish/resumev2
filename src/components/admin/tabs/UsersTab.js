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
import { Badge } from "@/components/ui/badge"; // To display roles/status

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Users per page

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users"); // Fetch from the new endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setError("Failed to load users or invalid data format.");
        setUsers([]);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(`Failed to fetch users: ${e.message}`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <FadeIn>
      <Card className="glow-card">
        <CardHeader className="bg-black rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
            User Management
          </CardTitle>
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
        </CardHeader>
        <CardContent className="bg-gray-900 p-0">
          {isLoading ? (
            <p className="text-gray-300 p-4 text-center">Loading users...</p>
          ) : error ? (
            <p className="text-red-500 p-4 text-center">{error}</p>
          ) : currentUsers.length > 0 ? (
            <>
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
                        Role
                      </TableHead>
                      <TableHead className="text-gray-300 py-3 px-4 font-bold text-right">
                        Joined
                      </TableHead>
                      {/* Add Actions header if needed later */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="border-gray-700 hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium text-white py-3 px-4">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300 py-3 px-4">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300 py-3 px-4">
                          <Badge
                            variant={
                              user.role === "admin" || user.isAdmin
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              user.role === "admin" || user.isAdmin
                                ? "bg-red-700 text-white"
                                : "bg-gray-600 text-gray-200"
                            }
                          >
                            {user.role || (user.isAdmin ? "Admin" : "User")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 py-3 px-4 text-right">
                          {format(
                            new Date(user.createdAt || new Date()),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        {/* Add Actions cell if needed */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            </>
          ) : (
            <p className="text-gray-400 p-4 text-center">
              No users found{searchTerm ? " matching your search" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default UsersTab;
