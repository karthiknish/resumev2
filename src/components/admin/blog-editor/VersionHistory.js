import { useState, useEffect } from "react";
import { History, RotateCcw, Eye, Loader2, X, FileText, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import TipTapRenderer from "@/components/TipTapRenderer";

/**
 * VersionHistory component - Displays version history for blog posts
 * Allows viewing and restoring previous versions
 */
export default function VersionHistory({ blogId, currentVersion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");

  useEffect(() => {
    if (isOpen && blogId) {
      fetchVersions();
    }
  }, [isOpen, blogId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blog/versions?blogId=${blogId}`);
      const data = await res.json();
      if (data.success) {
        // Sort versions by versionNumber descending (newest first)
        const sortedVersions = [...data.data.versions].sort(
          (a, b) => b.versionNumber - a.versionNumber
        );
        setVersions(sortedVersions);
      } else {
        toast.error(data.message || "Failed to load version history");
      }
    } catch (error) {
      toast.error("Failed to load version history");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (version) => {
    setPreviewVersion(version);
  };

  const handleRestoreClick = (version) => {
    setSelectedVersion(version);
    setShowRestoreDialog(true);
    setChangeDescription("");
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;

    setIsRestoring(true);
    try {
      const res = await fetch(`/api/blog/versions?blogId=${blogId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionNumber: selectedVersion.versionNumber,
          changeDescription,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Restored to version ${selectedVersion.versionNumber}`);
        setShowRestoreDialog(false);
        setIsOpen(false);
        // Trigger page reload to reflect changes
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to restore version");
      }
    } catch (error) {
      toast.error("Failed to restore version");
    } finally {
      setIsRestoring(false);
    }
  };

  const formatRelativeTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const getWordCount = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.split(" ").filter(Boolean).length;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            Version History
            {currentVersion && (
              <Badge variant="secondary" className="ml-1">
                v{currentVersion}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this blog post.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No version history available yet.</p>
                <p className="text-sm mt-1">
                  Versions are automatically created when you save changes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.versionNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border transition-colors ${
                        previewVersion?.versionNumber === version.versionNumber
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                version.versionNumber === currentVersion
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              v{version.versionNumber}
                              {version.versionNumber === currentVersion && " (Current)"}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(version.createdAt)}
                            </span>
                          </div>

                          <h4 className="font-semibold text-foreground truncate mb-1">
                            {version.title}
                          </h4>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {version.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {getWordCount(version.content)} words
                            </span>
                            {version.category && (
                              <span className="px-2 py-0.5 rounded-full bg-muted text-foreground">
                                {version.category}
                              </span>
                            )}
                            {version.tags && version.tags.length > 0 && (
                              <span className="truncate">
                                {version.tags.slice(0, 3).join(", ")}
                                {version.tags.length > 3 && "..."}
                              </span>
                            )}
                          </div>

                          {version.changeDescription && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              &quot;{version.changeDescription}&quot;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(version)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {version.versionNumber !== currentVersion && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreClick(version)}
                              className="h-8 px-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Preview Dialog */}
      <Dialog
        open={!!previewVersion}
        onOpenChange={(open) => !open && setPreviewVersion(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version {previewVersion?.versionNumber} Preview
            </DialogTitle>
            <DialogDescription>
              {previewVersion && formatRelativeTime(previewVersion.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {previewVersion && (
            <div className="flex-1 overflow-y-auto">
              {previewVersion.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={previewVersion.imageUrl}
                    alt={previewVersion.title}
                    className="h-auto w-full object-cover max-h-[300px]"
                  />
                </div>
              )}
              <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
                {previewVersion.title}
              </h1>
              <div className="prose prose-lg max-w-none text-foreground prose-headings:font-heading">
                <TipTapRenderer content={previewVersion.content} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Version {selectedVersion?.versionNumber}?</DialogTitle>
            <DialogDescription>
              This will create a new version with your current content, then restore
              the selected version. You can always undo this action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedVersion && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-semibold text-sm">{selectedVersion.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(selectedVersion.createdAt)}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Describe this change (optional)
              </label>
              <Input
                placeholder="e.g., Restored previous introduction"
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRestore}
              disabled={isRestoring}
              className="gap-2"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Restore Version
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
