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
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between text-gray-800">
          <span className="flex items-center gap-3">
            <div className="text-2xl">
              {title.includes('Gemini') ? '🧠' : 
               title.includes('Pexels') ? '📸' : 
               title.includes('GNews') ? '📰' : 
               title.includes('MongoDB') ? '🗄️' : '⚡'}
            </div>
            {title}
          </span>
          <Badge
            variant={getBadgeVariant()}
            className={`ml-2 font-bold rounded-xl px-3 py-1 ${
              status === 'success' 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : status === 'error'
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {getStatusIcon()}
            <span className="ml-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-lg font-medium mb-4 ${
          status === 'success' 
            ? 'text-green-700' 
            : status === 'error'
            ? 'text-red-700'
            : 'text-gray-600'
        }`}>
          {message}
        </p>
        {usageEndpoint && (
          <div className="mt-4 pt-4 border-t-2 border-purple-100 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 p-4">
            {isLoadingUsage ? (
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="animate-spin text-lg">⚡</div>
                Loading usage...
              </div>
            ) : usage !== null && usage.limit !== null ? (
              <div className="text-gray-700 font-semibold">
                <div className="flex items-center justify-between mb-2">
                  <span>Usage Today:</span>
                  <span className="text-lg font-black">{usage.count} / {usage.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((usage.count / usage.limit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : usage !== null && usage.count !== null ? (
              <div className="text-gray-700 font-semibold">
                <span className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Usage Today: <span className="font-black text-lg">{usage.count}</span> requests
                </span>
              </div>
            ) : (
              <div className="text-gray-500 font-medium flex items-center gap-2">
                <span className="text-xl">❓</span>
                Usage data unavailable
              </div>
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
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-6xl animate-pulse">⚡</div>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            API Status Dashboard
          </h2>
        </div>
        <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto">
          Monitor the operational status and usage of all integrated third-party APIs in real-time.
          <span className="inline-block ml-2 text-2xl">🔍</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {apiEndpoints.map((api, index) => (
          <div
            key={api.title}
            className="transform transition-all duration-300 hover:scale-105"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <ApiStatusCard
              title={api.title}
              testEndpoint={api.testEndpoint}
              usageEndpoint={api.usageEndpoint}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
