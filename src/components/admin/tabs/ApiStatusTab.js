import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Helper component for individual API status
const ApiStatusCard = ({ title, testEndpoint, usageEndpoint }) => {
  const [status, setStatus] = useState("pending"); // 'pending', 'success', 'error'
  const [message, setMessage] = useState("Checking...");
  const [usage, setUsage] = useState(null); // { count: number, limit: number } | null
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  const checkStatus = async () => {
    setStatus("pending");
    setMessage("Checking...");
    try {
      // Use GET for GNews test, POST for others
      const method = title.startsWith("GNews") ? "GET" : "POST";
      const response = await fetch(testEndpoint, { method });
      const data = await response.json();
      if (response.ok && data.success !== false) {
        setStatus("success");
        setMessage(data.message || "API Operational");
      } else {
        setStatus("error");
        setMessage(data.message || `Test failed (Status: ${response.status})`);
      }
    } catch (error) {
      setStatus("error");
      setMessage(`Network error or API unreachable: ${error.message}`);
    }
  };

  const fetchUsage = async () => {
    if (!usageEndpoint) return;
    setIsLoadingUsage(true);
    setUsage(null);
    try {
      const response = await fetch(usageEndpoint);
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        const usageData = data.data;
        if (usageData && typeof usageData.count === "number") {
          const limit = usageData.apiName === "gnews" ? 100 : null;
          setUsage({ count: usageData.count, limit });
        } else {
          if (usageEndpoint.includes("gnews")) {
            setUsage({ count: 0, limit: 100 });
          } else {
            setUsage(null);
          }
          console.warn("No usage data found for today, assuming 0.", data.data);
        }
      } else {
        console.error("Failed to fetch usage:", data.message);
        toast.error(
          `Could not fetch usage for ${title}: ${
            data.message || "Unknown error"
          }`
        );
        setUsage(null);
      }
    } catch (error) {
      console.error(`Error fetching API usage for ${title}:`, error);
      toast.error(`Error fetching usage for ${title}.`);
      setUsage(null);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  useEffect(() => {
    checkStatus();
    fetchUsage();
  }, [testEndpoint, usageEndpoint]);

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-white"; // Brighter green
      case "error":
        return "text-red-500"; // Brighter red
      default:
        return "text-gray-400";
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <Badge
            variant={getBadgeVariant()}
            className={`ml-2 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="ml-1.5">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Make message text brighter on success/error */}
        <p className={`text-sm ${getStatusColor()} mb-2`}>{message}</p>
        {usageEndpoint && (
          <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-400">
            {isLoadingUsage ? (
              <span className="flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Loading
                usage...
              </span>
            ) : usage !== null && usage.limit !== null ? (
              <span>
                Usage Today: {usage.count} / {usage.limit} requests
              </span>
            ) : usage !== null && usage.count !== null ? (
              <span>Usage Today: {usage.count} requests</span>
            ) : (
              <span>Usage data unavailable.</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ApiStatusTab() {
  // Define API test endpoints here, separating Gemini models
  const apiEndpoints = [
    {
      title: "Gemini Flash",
      testEndpoint:
        "/api/admin/test-gemini-models?model=gemini-1.5-flash-latest",
    },
    {
      title: "Gemini Pro",
      testEndpoint: "/api/admin/test-gemini-models?model=gemini-pro",
    }, // Assuming 'gemini-pro' is the identifier
    { title: "Pexels API", testEndpoint: "/api/admin/test-pexels" },
    {
      title: "GNews API",
      testEndpoint: "/api/ai/get-trending-news",
      usageEndpoint: "/api/admin/api-usage?apiName=gnews",
    },
    { title: "MongoDB Connection", testEndpoint: "/api/admin/test-mongodb" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-4">
        API Status Dashboard
      </h2>
      <p className="text-gray-400 mb-6">
        Check the operational status and usage of integrated third-party APIs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apiEndpoints.map((api) => (
          <ApiStatusCard
            key={api.title}
            title={api.title}
            testEndpoint={api.testEndpoint}
            usageEndpoint={api.usageEndpoint}
          />
        ))}
      </div>
    </div>
  );
}
