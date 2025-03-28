import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for body
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters, AiOutlineDelete } from "react-icons/ai";

function BytesTab() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    headline: "",
    body: "",
    imageUrl: "",
    link: "",
  });

  useEffect(() => {
    fetchBytes();
  }, []);

  const fetchBytes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bytes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setBytes(data.data);
      } else {
        setError("Failed to load bytes or invalid data format.");
        setBytes([]);
      }
    } catch (e) {
      console.error("Error fetching bytes:", e);
      setError(`Failed to fetch bytes: ${e.message}`);
      setBytes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.headline || !formState.body) {
      setError("Headline and Body are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bytes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create byte");
      }
      // Add new byte to the top of the list and reset form
      setBytes([result.data, ...bytes]);
      setFormState({ headline: "", body: "", imageUrl: "", link: "" });
    } catch (err) {
      console.error("Error creating byte:", err);
      setError(err.message || "Failed to create byte");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (byteId) => {
    if (!byteId) return;
    if (window.confirm("Are you sure you want to delete this byte?")) {
      try {
        const response = await fetch(`/api/bytes/${byteId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to delete byte: ${response.status}`
          );
        }
        // Remove from state
        setBytes((prevBytes) =>
          prevBytes.filter((byte) => byte._id !== byteId)
        );
      } catch (err) {
        console.error("Error deleting byte:", err);
        alert(`Error deleting byte: ${err.message}`);
      }
    }
  };

  return (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create New Byte Form */}
        <div className="md:col-span-1">
          <Card className="glow-card">
            <CardHeader className="bg-black rounded-t-lg">
              <CardTitle className="text-xl font-medium text-white font-calendas glow-blue">
                Create New Byte
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-900 p-4 space-y-4">
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Headline*
                  </label>
                  <Input
                    name="headline"
                    value={formState.headline}
                    onChange={handleInputChange}
                    maxLength={200}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Body*
                  </label>
                  <Textarea
                    name="body"
                    value={formState.body}
                    onChange={handleInputChange}
                    maxLength={500}
                    required
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {500 - formState.body.length} characters remaining
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL (Optional)
                  </label>
                  <Input
                    name="imageUrl"
                    type="url"
                    value={formState.imageUrl}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Link (Optional)
                  </label>
                  <Input
                    name="link"
                    type="url"
                    value={formState.link}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  ) : null}
                  {isSubmitting ? "Saving..." : "Save Byte"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Existing Bytes */}
        <div className="md:col-span-2">
          <Card className="glow-card">
            <CardHeader className="bg-black rounded-t-lg">
              <CardTitle className="text-xl font-medium text-white font-calendas glow-blue">
                Existing Bytes
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-900 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <p className="text-gray-300 text-center">Loading bytes...</p>
              ) : error && !bytes.length ? ( // Show error only if list is empty
                <p className="text-red-500 text-center">{error}</p>
              ) : bytes.length > 0 ? (
                bytes.map((byte) => (
                  <div
                    key={byte._id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {byte.headline}
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">{byte.body}</p>
                      {byte.link && (
                        <a
                          href={byte.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Link
                        </a>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created:{" "}
                        {format(new Date(byte.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-gray-700 ml-4"
                      onClick={() => handleDelete(byte._id)}
                    >
                      <AiOutlineDelete />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">
                  No bytes created yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
}

export default BytesTab;
