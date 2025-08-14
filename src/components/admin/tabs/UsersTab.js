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
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white p-6 flex flex-row items-center justify-between">
          <CardTitle
            className="text-2xl font-black text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            👥 User Management
          </CardTitle>
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-white/90 backdrop-blur-sm border-2 border-blue-200 text-gray-800 placeholder-gray-500 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
          />
        </CardHeader>
        <CardContent className="bg-blue-50 p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-600 font-medium">
                Loading users...
              </span>
            </div>
          ) : error ? (
            <div className="text-center p-10">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-200 shadow-lg m-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200 border-b-2">
                      <TableHead className="text-blue-700 py-4 px-6 font-bold text-lg">
                        👤 Name
                      </TableHead>
                      <TableHead className="text-blue-700 py-4 px-6 font-bold text-lg">
                        📧 Email
                      </TableHead>
                      <TableHead className="text-blue-700 py-4 px-6 font-bold text-lg">
                        💼 Role
                      </TableHead>
                      <TableHead className="text-blue-700 py-4 px-6 font-bold text-lg text-right">
                        📅 Joined
                      </TableHead>
                      {/* Add Actions header if needed later */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="border-blue-100 hover:bg-blue-50 transition-all duration-300"
                      >
                        <TableCell className="font-semibold text-gray-800 py-4 px-6">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-700 py-4 px-6">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-700 py-4 px-6">
                          <Badge
                            variant={
                              user.role === "admin" || user.isAdmin
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              user.role === "admin" || user.isAdmin
                                ? "bg-red-100 text-red-700 border border-red-200 font-bold"
                                : "bg-blue-100 text-blue-700 border border-blue-200 font-medium"
                            }
                          >
                            {user.role || (user.isAdmin ? "Admin" : "User")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 py-4 px-6 text-right font-medium">
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
                <div className="flex justify-center items-center space-x-4 p-6 border-t-2 border-blue-200 bg-blue-50">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 rounded-xl font-medium"
                  >
                    Previous
                  </Button>
                  <span className="text-blue-700 font-bold px-4 py-2 bg-white/80 rounded-xl border border-blue-200">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 rounded-xl font-medium"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3
                className="text-xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                No users found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "No users match your search criteria."
                  : "No users have been created yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default UsersTab;
