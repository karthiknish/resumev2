import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

// Helper component for individual API status
const ApiStatusCard = ({ title, testEndpoint, usageEndpoint, method = "GET" }) => {
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
      const res = await fetch(testEndpoint, { method });
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
    <Card className="bg-card border border-border transition-shadow duration-200 shadow-sm hover:shadow-md rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading font-semibold flex items-center justify-between text-foreground">
          <span className="flex items-center gap-2">{title}</span>
          <Badge
            variant={getBadgeVariant()}
            className="ml-2 text-xs font-semibold rounded-lg px-2 py-1"
          >
            {getStatusIcon()}
            <span className="ml-1">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm font-medium mb-3 text-muted-foreground">{message}</p>
        {usageEndpoint && (
          <div className="mt-3 pt-3 border-t border-border rounded-lg bg-muted/50 p-3">
            {isLoadingUsage ? (
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading usage...</span>
              </div>
            ) : usage !== null && usage.limit !== null ? (
              <div className="text-foreground font-semibold">
                <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <span>Usage Today</span>
                  <span className="text-sm font-bold text-foreground">
                    {usage.count} / {usage.limit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-300"
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
              <div className="text-foreground font-semibold text-sm">
                <span className="flex items-center gap-2">
                  <span>Usage Today:</span>{" "}
                  <span className="font-bold text-base">{usage.count}</span>{" "}
                  requests
                </span>
              </div>
            ) : (
              <div className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
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
  // Define API test endpoints here
  const apiEndpoints = [
    {
      title: "Gemini Flash",
      testEndpoint: "/api/admin/test-gemini-models?model=gemini-3-flash-preview",
      method: "POST",
    },
    {
      title: "Pexels API",
      testEndpoint: "/api/admin/test-pexels",
      method: "POST",
    },
    {
      title: "GNews API",
      testEndpoint: "/api/ai/get-trending-news",
      usageEndpoint: "/api/admin/api-usage?apiName=gnews",
      method: "GET",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
            API Status Dashboard
          </h2>
        </div>
        <p className="text-base text-muted-foreground font-medium max-w-2xl mx-auto">
          Monitor the operational status and usage of all integrated third-party
          APIs in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {apiEndpoints.map((api, index) => (
          <div
            key={api.title}
            className="transition-transform duration-200 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <ApiStatusCard
              title={api.title}
              testEndpoint={api.testEndpoint}
              usageEndpoint={api.usageEndpoint}
              method={api.method}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
