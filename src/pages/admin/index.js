import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineFileAdd,
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineMessage,
  AiOutlineDelete,
  AiOutlineRobot,
  AiOutlineClockCircle,
} from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";

// Digital Clock Component
function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setBlinking((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = format(time, "EEE, MMM d, yyyy");

  // Format time parts separately to add blinking colon
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg text-white">
        <AiOutlineClockCircle className="mr-2 text-blue-400" />
        <span className="font-mono text-xl flex items-center">
          {hours}
          <span
            className={`mx-0.5 ${
              blinking ? "opacity-100" : "opacity-40"
            } transition-opacity duration-300`}
          >
            :
          </span>
          {minutes}
          <span
            className={`mx-0.5 ${
              blinking ? "opacity-100" : "opacity-40"
            } transition-opacity duration-300`}
          >
            :
          </span>
          {seconds}
        </span>
      </div>
      <div className="text-gray-400 mt-1 text-sm">{formattedDate}</div>
    </div>
  );
}

function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogDates, setBlogDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postsOnSelectedDate, setPostsOnSelectedDate] = useState([]);

  // Contact state
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactPage, setContactPage] = useState(1);
  const [contactPagination, setContactPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/blog");
        const result = await response.json();

        if (result.success) {
          setBlogPosts(result.data);

          // Extract dates for the calendar
          const dates = result.data.map((post) => new Date(post.createdAt));
          setBlogDates(dates);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchBlogPosts();
    }
  }, [session]);

  // Fetch contacts when tab changes or page changes
  useEffect(() => {
    if (activeTab === "contacts" && session) {
      fetchContacts();
    }
  }, [activeTab, contactPage, session]);

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await fetch(`/api/contacts?page=${contactPage}`);
      const result = await response.json();

      if (result.success) {
        setContacts(result.data);
        setContactPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh contacts after deletion
        fetchContacts();
      } else {
        alert("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Error deleting contact");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleContactPageChange = (newPage) => {
    if (newPage > 0 && newPage <= contactPagination.totalPages) {
      setContactPage(newPage);
    }
  };

  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactDetails = () => {
    setSelectedContact(null);
  };

  useEffect(() => {
    // Find posts on the selected date
    if (blogPosts.length > 0 && selectedDate) {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
      const filteredPosts = blogPosts.filter((post) => {
        const postDate = format(new Date(post.createdAt), "yyyy-MM-dd");
        return postDate === selectedDateStr;
      });
      setPostsOnSelectedDate(filteredPosts);
    }
  }, [selectedDate, blogPosts]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Function to check if a date has blog posts
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      const hasPost = blogDates.some(
        (blogDate) => format(new Date(blogDate), "yyyy-MM-dd") === dateStr
      );

      return hasPost ? (
        <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
      ) : null;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <style jsx global>{`
          .react-calendar {
            width: 100%;
            max-width: 100%;
            background: #1f2937;
            color: white;
            border-radius: 8px;
            border: 1px solid #374151;
            font-family: "Calendas", Arial, sans-serif;
          }
          .react-calendar__tile {
            padding: 10px;
            color: white;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #374151;
            border-radius: 6px;
          }
          .react-calendar__tile--active {
            background: #3b82f6 !important;
            border-radius: 6px;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #374151;
            border-radius: 6px;
          }
          .react-calendar__month-view__weekdays__weekday {
            color: #9ca3af;
          }
          .react-calendar__navigation button {
            color: white;
          }
        `}</style>
      </Head>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-4xl font-medium text-white font-calendas mb-4 md:mb-0">
              Admin Dashboard
            </h1>
            <DigitalClock />
          </div>

          {/* Admin Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              } transition-all duration-200`}
            >
              <AiOutlineDashboard className="mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              } transition-all duration-200`}
            >
              <AiOutlineCalendar className="mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === "contacts"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              } transition-all duration-200`}
            >
              <AiOutlineMessage className="mr-2" />
              Contact Messages
            </button>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/admin/blog/create"
                className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
              >
                <AiOutlineFileAdd className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
                <span className="text-white text-lg font-calendas">
                  Create Blog
                </span>
              </Link>

              <Link
                href="/admin/blog/ai-create"
                className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
              >
                <AiOutlineRobot className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
                <span className="text-white text-lg font-calendas">
                  AI Blog Creator
                </span>
              </Link>

              <Link
                href="/admin/blog/edit"
                className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
              >
                <AiOutlineEdit className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
                <span className="text-white text-lg font-calendas">
                  Edit/Delete Blog
                </span>
              </Link>

              {/* Recent Blog Posts Summary */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-medium mb-4 text-white font-calendas">
                  Recent Blog Posts
                </h2>
                {isLoading ? (
                  <p className="text-gray-400">Loading blog posts...</p>
                ) : blogPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-white">
                      <thead className="bg-gray-700 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3 rounded-tl-lg">Title</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogPosts.slice(0, 5).map((post) => (
                          <tr
                            key={post._id}
                            className="border-b border-gray-700"
                          >
                            <td className="px-6 py-4 font-medium">
                              {post.title}
                            </td>
                            <td className="px-6 py-4">
                              {format(new Date(post.createdAt), "MMM dd, yyyy")}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  post.isPublished
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {post.isPublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                href={`/admin/blog/edit?id=${post._id}`}
                                className="text-blue-500 hover:text-blue-400 mr-4"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-gray-400 hover:text-white"
                                target="_blank"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">No blog posts found.</p>
                )}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {activeTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-medium mb-4 text-white font-calendas">
                  Blog Post Calendar
                </h2>
                <p className="text-gray-400 mb-4">
                  Dates with blog posts are marked with a blue dot
                </p>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full"
                />
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-medium mb-4 text-white font-calendas">
                  Posts on {format(selectedDate, "MMMM d, yyyy")}
                </h2>
                {postsOnSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {postsOnSelectedDate.map((post) => (
                      <div
                        key={post._id}
                        className="p-4 bg-gray-700 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              post.isPublished
                                ? "bg-green-900 text-green-300"
                                : "bg-yellow-900 text-yellow-300"
                            }`}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                          <div>
                            <Link
                              href={`/admin/blog/edit?id=${post._id}`}
                              className="text-blue-500 hover:text-blue-400 mr-3"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-gray-400 hover:text-white"
                              target="_blank"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    No posts published on this date.
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <Link
                    href="/admin/blog/create"
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <AiOutlineFileAdd className="mr-2" />
                    Create New Blog Post
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Contacts View */}
          {activeTab === "contacts" && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-medium mb-4 text-white font-calendas">
                Contact Form Messages
              </h2>

              {contactsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-white">Loading contact messages...</div>
                </div>
              ) : contacts.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-white">
                      <thead className="bg-gray-700 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3 rounded-tl-lg">Name</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr
                            key={contact._id}
                            className="border-b border-gray-700"
                          >
                            <td className="px-6 py-4 font-medium">
                              {contact.name}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {contact.email}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              {format(
                                new Date(contact.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => viewContactDetails(contact)}
                                className="text-blue-500 hover:text-blue-400 mr-4"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact._id)}
                                className="text-red-500 hover:text-red-400"
                                disabled={deleteLoading}
                              >
                                {deleteLoading ? "Deleting..." : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {contactPagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button
                        onClick={() => handleContactPageChange(contactPage - 1)}
                        disabled={contactPage === 1}
                        className={`px-3 py-1 rounded ${
                          contactPage === 1
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                      >
                        Previous
                      </button>
                      <div className="px-3 py-1 bg-gray-700 rounded text-white">
                        Page {contactPage} of {contactPagination.totalPages}
                      </div>
                      <button
                        onClick={() => handleContactPageChange(contactPage + 1)}
                        disabled={contactPage === contactPagination.totalPages}
                        className={`px-3 py-1 rounded ${
                          contactPage === contactPagination.totalPages
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400 py-8 text-center">
                  No contact messages found.
                </p>
              )}

              {/* Contact Details Modal */}
              {selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-medium text-white">
                        Message from {selectedContact.name}
                      </h3>
                      <button
                        onClick={closeContactDetails}
                        className="text-gray-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">From:</p>
                        <p className="text-white">
                          {selectedContact.name} ({selectedContact.email})
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Date:</p>
                        <p className="text-white">
                          {format(
                            new Date(selectedContact.createdAt),
                            "MMMM d, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Message:</p>
                        <div className="bg-gray-700 p-4 rounded-lg mt-2 text-white whitespace-pre-wrap">
                          {selectedContact.message}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-gray-700 mt-4">
                        <button
                          onClick={() =>
                            handleDeleteContact(selectedContact._id)
                          }
                          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          disabled={deleteLoading}
                        >
                          <AiOutlineDelete className="mr-2" />
                          {deleteLoading ? "Deleting..." : "Delete Message"}
                        </button>

                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <AiOutlineMessage className="mr-2" />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
