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

  const checkStatus = async () => {
    setStatus("pending");
    setMessage("Checking...");
    try {
      const res = await fetch(testEndpoint);
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("API reachable");
    } catch (_e) {
      setStatus("error");
      setMessage("API unreachable");
    }

    if (usageEndpoint) {
      try {
        setIsLoadingUsage(true);
        const res = await fetch(usageEndpoint);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data && data.count != null) {
          setUsage({ count: data.count, limit: data.limit ?? null });
        } else {
          setUsage(null);
        }
      } catch (_e) {
        setUsage(null);
      } finally {
        setIsLoadingUsage(false);
      }
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between text-foreground">
          <span className="flex items-center gap-3">{title}</span>
          <Badge
            variant={getBadgeVariant()}
            className="ml-2 font-bold rounded-xl px-3 py-1"
          >
            {getStatusIcon()}
            <span className="ml-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-4 text-foreground/80">{message}</p>
        {usageEndpoint && (
          <div className="mt-4 pt-4 border-t-2 border-primary/10 rounded-xl bg-card p-4">
            {isLoadingUsage ? (
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading usage...</span>
              </div>
            ) : usage !== null && usage.limit !== null ? (
              <div className="text-foreground font-semibold">
                <div className="flex items-center justify-between mb-2">
                  <span>Usage Today:</span>
                  <span className="text-lg font-black">
                    {usage.count} / {usage.limit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-brandSecondary h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (usage.count / usage.limit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : usage !== null && usage.count !== null ? (
              <div className="text-foreground font-semibold">
                <span className="flex items-center gap-2">
                  <span>Usage Today:</span>{" "}
                  <span className="font-black text-lg">{usage.count}</span>{" "}
                  requests
                </span>
              </div>
            ) : (
              <div className="text-muted-foreground font-medium flex items-center gap-2">
                <span>Usage data unavailable</span>
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
    },
    {
      title: "Pexels API",
      testEndpoint: "/api/admin/test-pexels",
    },
    {
      title: "GNews API",
      testEndpoint: "/api/ai/get-trending-news",
      usageEndpoint: "/api/admin/api-usage?apiName=gnews",
    },
    {
      title: "MongoDB Connection",
      testEndpoint: "/api/admin/test-mongodb",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2
            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            API Status Dashboard
          </h2>
        </div>
        <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto">
          Monitor the operational status and usage of all integrated third-party
          APIs in real-time.
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
