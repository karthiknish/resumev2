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
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-heading font-semibold text-slate-900">
            User Management
          </CardTitle>
          <Input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-slate-500">
                Loading users...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-red-500">{error}</p>
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">
                        Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">
                        Role
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3 text-right">
                        Joined
                      </TableHead>
                      {/* Add Actions header if needed later */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-700 py-3 px-4">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-600 py-3 px-4">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-600 py-3 px-4">
                          <Badge
                            variant={
                              user.role === "admin" || user.isAdmin
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              user.role === "admin" || user.isAdmin
                                ? "bg-red-100 text-red-600 border border-red-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }
                          >
                            {user.role || (user.isAdmin ? "Admin" : "User")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 py-3 px-4 text-right text-sm">
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
                <div className="flex justify-center items-center gap-3 px-4 py-4 border-t border-slate-200">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-2">
              <h3 className="text-base font-heading font-semibold text-slate-900">
                No users found
              </h3>
              <p className="text-sm text-slate-600">
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
