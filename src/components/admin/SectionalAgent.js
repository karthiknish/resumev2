// src/components/admin/SectionalAgent.js
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, Circle, ChevronRight, Edit3, FileText, Bot, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * SectionalAgent - Conversational UI for sectional blog generation
 * Workflow:
 * 1. Generate outline from user context
 * 2. Review and optionally edit outline sections
 * 3. Generate content for each section individually
 * 4. Combine all sections into final blog post
 */
export default function SectionalAgent({ onContentComplete, onCancel, initialContext = "", initialUrl = "" }) {
  const [stage, setStage] = useState("input"); // input, outline, generating, complete
  const [context, setContext] = useState(initialContext);
  const [url, setUrl] = useState(initialUrl);
  const [isGenerating, setIsGenerating] = useState(false);

  // Outline state
  const [outline, setOutline] = useState(null);
  const [editedOutline, setEditedOutline] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedPoints, setEditedPoints] = useState("");

  // Section generation state
  const [generatedSections, setGeneratedSections] = useState({});
  const [currentSectionId, setCurrentSectionId] = useState(null);

  // Style config
  const [styleConfig, setStyleConfig] = useState({
    tone: "professional",
    audience: "developers",
    length: "medium"
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stage, outline, generatedSections]);

  // Step 1: Generate outline
  const handleGenerateOutline = async () => {
    if (!context?.trim() && !url?.trim()) {
      toast.error("Please provide context or a URL to generate an outline.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating blog outline...");

    try {
      const response = await fetch("/api/ai/agent-generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, url, styleConfig }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setOutline(data.data);
        setEditedOutline(data.data);
        setStage("outline");
        toast.success("Outline generated!", { id: toastId });
      } else {
        throw new Error(data.message || "Failed to generate outline.");
      }
    } catch (err) {
      console.error("Outline generation error:", err);
      toast.error(`Failed: ${err?.message || "Unknown error"}`, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 2: Edit outline section
  const handleEditSection = (sectionId) => {
    const section = editedOutline.sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSectionId(sectionId);
      setEditedHeading(section.heading);
      setEditedPoints(section.points.join("\n"));
    }
  };

  const handleSaveSectionEdit = () => {
    if (!editedHeading.trim()) {
      toast.error("Heading cannot be empty.");
      return;
    }

    const pointsArray = editedPoints
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (pointsArray.length === 0) {
      toast.error("Please add at least one key point.");
      return;
    }

    setEditedOutline(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === editingSectionId
          ? { ...s, heading: editedHeading.trim(), points: pointsArray }
          : s
      )
    }));

    setEditingSectionId(null);
    setEditedHeading("");
    setEditedPoints("");
  };

  const handleCancelSectionEdit = () => {
    setEditingSectionId(null);
    setEditedHeading("");
    setEditedPoints("");
  };

  // Step 3: Generate content for all sections
  const handleGenerateContent = async () => {
    setStage("generating");
    setGeneratedSections({});

    // Generate sections one by one
    for (const section of editedOutline.sections) {
      setCurrentSectionId(section.id);

      try {
        const response = await fetch("/api/ai/agent-generate-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId: section.id,
            sectionHeading: section.heading,
            sectionPoints: section.points,
            blogTitle: editedOutline.title,
            styleConfig,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setGeneratedSections(prev => ({
            ...prev,
            [section.id]: data.data.content,
          }));
        } else {
          // Store error message but continue
          setGeneratedSections(prev => ({
            ...prev,
            [section.id]: `<h2>${section.heading}</h2><p><em>Content generation failed. Please try again.</em></p>`,
          }));
        }
      } catch (err) {
        console.error(`Section generation error for ${section.id}:`, err);
        setGeneratedSections(prev => ({
          ...prev,
          [section.id]: `<h2>${section.heading}</h2><p><em>Content generation failed. Please try again.</em></p>`,
        }));
      }
    }

    setCurrentSectionId(null);
    setStage("complete");
    toast.success("All sections generated!");
  };

  // Step 4: Regenerate a single section
  const handleRegenerateSection = async (sectionId) => {
    const section = editedOutline.sections.find(s => s.id === sectionId);
    if (!section) return;

    setCurrentSectionId(sectionId);
    toast.loading(`Regenerating ${section.heading}...`, { id: `regen-${sectionId}` });

    try {
      const response = await fetch("/api/ai/agent-generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          sectionHeading: section.heading,
          sectionPoints: section.points,
          blogTitle: editedOutline.title,
          styleConfig,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setGeneratedSections(prev => ({
          ...prev,
          [section.id]: data.data.content,
        }));
        toast.success(`${section.heading} regenerated!`, { id: `regen-${sectionId}` });
      } else {
        throw new Error(data.message || "Failed to regenerate section.");
      }
    } catch (err) {
      toast.error(`Failed: ${err?.message}`, { id: `regen-${sectionId}` });
    } finally {
      setCurrentSectionId(null);
    }
  };

  // Step 5: Complete and merge content
  const handleComplete = () => {
    const combinedContent = Object.values(generatedSections).join("\n\n");
    onContentComplete({
      title: editedOutline.title,
      content: combinedContent,
    });
  };

  // Reset to start over
  const handleReset = () => {
    setStage("input");
    setOutline(null);
    setEditedOutline(null);
    setGeneratedSections({});
    setCurrentSectionId(null);
  };

  // Helper: Get section status icon
  const getSectionStatus = (sectionId) => {
    if (generatedSections[sectionId]) {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
    if (currentSectionId === sectionId) {
      return <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-violet-500" />
          <div>
            <h3 className="font-semibold text-foreground">Agent Mode - Sectional Generation</h3>
            <p className="text-xs text-muted-foreground">
              {stage === "input" && "Step 1: Provide context to generate an outline"}
              {stage === "outline" && "Step 2: Review and edit your outline"}
              {stage === "generating" && "Step 3: Generating content for each section"}
              {stage === "complete" && "Step 4: Review and finalize your blog post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {stage !== "input" && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onCancel}>
            ×
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      {stage !== "input" && (
        <div className="flex items-center justify-center gap-2 border-b border-border px-6 py-3 bg-muted/30">
          <div className={`flex items-center gap-2 ${stage === "outline" || stage === "generating" || stage === "complete" ? "text-violet-600" : "text-muted-foreground"}`}>
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Outline</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${stage === "generating" || stage === "complete" ? "text-violet-600" : "text-muted-foreground"}`}>
            {stage === "generating" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Circle className="h-4 w-4" />}
            <span className="text-sm">Generate</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${stage === "complete" ? "text-violet-600" : "text-muted-foreground"}`}>
            <Circle className="h-4 w-4" />
            <span className="text-sm">Complete</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {stage === "input" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="h-12 w-12 text-violet-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Let's Create Your Blog</h2>
              <p className="text-muted-foreground">
                I'll help you create a blog post step-by-step. First, tell me what you want to write about.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL Reference (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Topic / Context</label>
                <Textarea
                  placeholder="E.g., Write a blog about React Server Components, explaining what they are, their benefits, and how to migrate existing components..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-[150px] resize-y"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <label className="block text-sm font-medium text-foreground mb-3">Writing Style</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Tone</label>
                    <select
                      value={styleConfig.tone}
                      onChange={(e) => setStyleConfig(prev => ({ ...prev, tone: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="humorous">Humorous</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Audience</label>
                    <select
                      value={styleConfig.audience}
                      onChange={(e) => setStyleConfig(prev => ({ ...prev, audience: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      <option value="developers">Developers</option>
                      <option value="beginners">Beginners</option>
                      <option value="executives">Executives</option>
                      <option value="general">General</option>
                      <option value="students">Students</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Length</label>
                    <select
                      value={styleConfig.length}
                      onChange={(e) => setStyleConfig(prev => ({ ...prev, length: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      <option value="short">Short (~500 words)</option>
                      <option value="medium">Medium (~1000 words)</option>
                      <option value="long">Long (~2000 words)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateOutline}
                disabled={isGenerating || (!context.trim() && !url.trim())}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Outline...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Outline
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {stage === "outline" && editedOutline && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">{editedOutline.title}</h2>
              <p className="text-sm text-muted-foreground">
                Review your outline below. Click the edit icon to modify any section.
              </p>
            </div>

            <div className="space-y-3">
              {editedOutline.sections.map((section) => (
                <div
                  key={section.id}
                  className="border border-border rounded-lg p-4 bg-card hover:border-violet-500/50 transition-colors"
                >
                  {editingSectionId === section.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedHeading}
                        onChange={(e) => setEditedHeading(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold"
                        placeholder="Section heading"
                      />
                      <Textarea
                        value={editedPoints}
                        onChange={(e) => setEditedPoints(e.target.value)}
                        placeholder="Enter key points (one per line)"
                        className="min-h-[100px] text-sm"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={handleCancelSectionEdit}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveSectionEdit}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{section.heading}</h4>
                        <ul className="mt-2 space-y-1">
                          {section.points.map((point, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-violet-500">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => handleEditSection(section.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleGenerateContent}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Full Content
              </Button>
            </div>
          </div>
        )}

        {stage === "generating" && editedOutline && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Generating Content</h2>
              <p className="text-sm text-muted-foreground">
                Writing each section individually for better quality...
              </p>
            </div>

            <div className="space-y-2">
              {editedOutline.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    currentSectionId === section.id
                      ? "border-violet-500 bg-violet-500/10"
                      : generatedSections[section.id]
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <span className="text-muted-foreground text-sm w-6">{idx + 1}.</span>
                  {getSectionStatus(section.id)}
                  <span className="text-sm font-medium text-foreground flex-1">{section.heading}</span>
                  {generatedSections[section.id] && (
                    <Badge variant="success" className="text-xs">Done</Badge>
                  )}
                  {currentSectionId === section.id && (
                    <Badge variant="secondary" className="text-xs">Writing...</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {Object.keys(generatedSections).length} of {editedOutline.sections.length} sections complete
              </p>
            </div>
          </div>
        )}

        {stage === "complete" && editedOutline && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Content Generated!</h2>
              <p className="text-sm text-muted-foreground">
                Your blog post is ready. Review the sections below or complete to add to the editor.
              </p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-auto">
              {editedOutline.sections.map((section) => (
                <div
                  key={section.id}
                  className="border border-border rounded-lg p-4 bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <h4 className="font-semibold text-foreground text-sm">{section.heading}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateSection(section.id)}
                      disabled={currentSectionId === section.id}
                      className="h-7 text-xs"
                    >
                      {currentSectionId === section.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                  <div
                    className="text-xs text-muted-foreground bg-muted/50 rounded p-2 max-h-20 overflow-auto prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: generatedSections[section.id]?.substring(0, 300) + "..." }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete & Add to Editor
              </Button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
