import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Send,
  Eye,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterTab() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  // Fetch subscriber count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/subscribers");
        const data = await response.json();
        if (data.success) {
          setSubscriberCount(data.data?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch subscriber count:", error);
      }
    };
    fetchCount();
  }, []);

  const handleSendTest = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in subject and content");
      return;
    }
    if (!testEmail.trim() || !testEmail.includes("@")) {
      toast.error("Please enter a valid test email");
      return;
    }

    setIsSendingTest(true);
    try {
      const response = await fetch("/api/admin/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, previewText, testEmail }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Test email sent to ${testEmail}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in subject and content");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send this newsletter to ${subscriberCount} subscribers?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, previewText }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          `Newsletter sent to ${data.sentCount} subscribers!`
        );
        setLastSent({
          subject,
          sentCount: data.sentCount,
          failedCount: data.failedCount || 0,
          timestamp: new Date().toISOString(),
        });
        // Clear form
        setSubject("");
        setContent("");
        setPreviewText("");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send newsletter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Total Subscribers
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {subscriberCount}
                </p>
              </div>
            </div>
            {lastSent && (
              <div className="text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-muted-foreground">Last Sent</p>
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {lastSent.subject}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {lastSent.sentCount} delivered
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compose Newsletter */}
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3 sm:pb-4 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-heading font-semibold text-foreground">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            Compose Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-5">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-xs sm:text-sm font-medium text-foreground">
              Subject Line
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Weekly Tech Insights: AI, Web Dev & More"
              className="bg-background text-sm"
            />
          </div>

          {/* Preview Text */}
          <div className="space-y-2">
            <Label htmlFor="preview" className="text-xs sm:text-sm font-medium text-foreground">
              Preview Text <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="preview"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="This week: exploring the latest in AI and web development..."
              className="bg-background text-sm"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Shown in email previews before opening
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs sm:text-sm font-medium text-foreground">
              Email Content <span className="text-muted-foreground">(HTML supported)</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<p>Hello!</p><p>Here are this week's highlights...</p>"
              className="min-h-[150px] sm:min-h-[200px] bg-background font-mono text-xs sm:text-sm"
            />
          </div>

          {/* Preview Toggle */}
          <AnimatePresence>
            {showPreview && content && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 sm:p-4 bg-muted rounded-xl border border-border">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Preview
                  </p>
                  <div
                    className="prose prose-xs sm:prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Email */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="testEmail" className="text-xs sm:text-sm font-medium text-foreground">
                Test Email
              </Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-background text-sm"
              />
            </div>
            <Button
              onClick={handleSendTest}
              disabled={isSendingTest || !subject || !content}
              variant="outline"
              className="shrink-0 sm:h-10 h-9 text-xs sm:text-sm"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Send Test
                </>
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!content}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
            <Button
              onClick={handleSendNewsletter}
              disabled={isLoading || !subject || !content || subscriberCount === 0}
              className="w-full sm:w-auto sm:ml-auto text-xs sm:text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                  Sending to {subscriberCount}...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Send to {subscriberCount} Subscribers
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-muted/50 border border-border shadow-sm rounded-2xl">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex gap-2.5 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="font-medium">Tips for a great newsletter:</p>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
                <li>Keep subject lines under 50 characters</li>
                <li>Use preview text to complement the subject</li>
                <li>Always send a test email first</li>
                <li>Use simple HTML - complex layouts may break in some clients</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
