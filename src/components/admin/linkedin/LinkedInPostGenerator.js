import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Linkedin,
  Loader2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  History,
  Trash2,
  Hash,
  X,
  FileText,
  BookOpen,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "./EmojiPicker";

const LOCAL_STORAGE_HISTORY_KEY = "linkedin-post-history";
const MAX_LOCAL_HISTORY = 5; // Reduced limit for local fallback
const API_HISTORY_LIMIT = 20; // Server-side history is larger

const POST_TYPES = [
  { value: "insight", label: "Insight", description: "Share a professional observation" },
  { value: "story", label: "Story", description: "Tell a personal story with a lesson" },
  { value: "tutorial", label: "Tutorial", description: "Provide a quick how-to or tip" },
  { value: "opinion", label: "Opinion", description: "Express a thought-provoking view" },
  { value: "celebration", label: "Celebration", description: "Celebrate an achievement" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "thoughtful", label: "Thoughtful" },
  { value: "inspiring", label: "Inspiring" },
  { value: "educational", label: "Educational" },
];

/**
 * LinkedIn Hashtag Suggestions Library
 * Categorized hashtags for LinkedIn content
 */
const HASHTAG_CATEGORIES = {
  technology: [
    "#JavaScript", "#TypeScript", "#React", "#NextJS", "#NodeJS",
    "#Python", "#WebDevelopment", "#Frontend", "#Backend", "#FullStack",
    "#DevOps", "#CloudComputing", "#AWS", "#Azure", "#GCP",
    "#Docker", "#Kubernetes", "#CI/CD", "#Git", "#API",
  ],
  career: [
    "#CareerGrowth", "#JobSearch", "#Leadership", "#Management",
    "#RemoteWork", "#WorkLifeBalance", "#ProfessionalDevelopment",
    "#Mentorship", "#Networking", "#SoftSkills", "#CareerAdvice",
    "#TechCareer", "#WomenInTech", "#Hiring", "#JobTips",
  ],
  ai: [
    "#AI", "#MachineLearning", "#DeepLearning", "#ChatGPT", "#LLM",
    "#GenerativeAI", "#AIAutomation", "#AIEthics", "#DataScience",
    "#PromptEngineering", "#ArtificialIntelligence", "#AItools",
  ],
  startup: [
    "#StartupLife", "#Entrepreneurship", "#BuildingInPublic",
    "#ProductLaunch", "#MVP", "#SaaS", "#B2B", "#TechStartup",
    "#Founders", "#Startup", "#Innovation", "#ProductManagement",
  ],
  learning: [
    "#LearningToCode", "#Coding", "#Programming", "#Tutorial",
    "#TechTips", "#CodeNewbie", "#100DaysOfCode", "#LearnInPublic",
    "#WebDev", "#Developer", "#Engineering", "#TechCommunity",
  ],
  industry: [
    "#TechTrends", "#FutureOfWork", "#DigitalTransformation",
    "#SoftwareEngineering", "#TechIndustry", "#Technology",
    "#Innovation", "#TechNews", "#Cybersecurity", "#DataPrivacy",
  ],
};

// Flatten all hashtags for easy searching
const ALL_HASHTAGS = Object.values(HASHTAG_CATEGORIES).flat();

/**
 * LinkedIn Post Template Library
 * Pre-built templates for different post formats
 */
const POST_TEMPLATES = {
  hook: [
    {
      id: "hook-controversial",
      name: "Controversial Take",
      icon: FileText,
      description: "Share a counterintuitive opinion to spark engagement",
      template: `Here's a controversial opinion:

{main_point}

Before you disagree, hear me out.

{supporting_points}

The reason I believe this is {reasoning}.

What's your take? 👇`,
    },
    {
      id: "hook-mistake",
      name: "Biggest Mistake",
      icon: BookOpen,
      description: "Share a mistake and the lesson learned",
      template: `The biggest mistake I made as a {role}:

{mistake_description}

This cost me {consequence}.

Here's what I learned:
• Lesson 1: {lesson_1}
• Lesson 2: {lesson_2}
• Lesson 3: {lesson_3}

If I could go back, I'd {alternative_approach}.

Share your biggest mistake below 👇`,
    },
    {
      id: "hook-number",
      name: "Number Hook",
      icon: Megaphone,
      description: "Start with a compelling number or statistic",
      template: `{number}% of {group} don't know this about {topic}.

After {time_period}, I discovered:

{key_insight}

This changed everything because {explanation}.

Here's what you need to know:

{actionable_tips}

Curious to hear your thoughts on this.`,
    },
    {
      id: "hook-question",
      name: "Provocative Question",
      icon: FileText,
      description: "Open with a thought-provoking question",
      template: `Why do so many {group} struggle with {problem}?

After working with {number} {people_type}, I noticed a pattern:

{pattern_observation}

The solution isn't {wrong_approach}.

It's {right_approach}.

Here's how to implement it:

{steps}

Who else has dealt with this?`,
    },
    {
      id: "hook-secret",
      name: "Secret Revealed",
      icon: Sparkles,
      description: "Share a little-known insight or secret",
      template: `Here's what nobody tells you about {topic}:

{secret_revelation}

Most people think {common_myth}.

But actually, {reality}.

This is important because {implication}.

{call_to_action}`,
    },
  ],
  story: [
    {
      id: "story-transformation",
      name: "Transformation Story",
      icon: BookOpen,
      description: "Share a before-and-after personal journey",
      template: `{time_period} ago, I was in a completely different place.

I was {struggle_description}.

Then something changed.

{turning_point}

Since then:
✓ {achievement_1}
✓ {achievement_2}
✓ {achievement_3}

The lesson?

{key_lesson}

If you're going through something similar, remember: {encouragement}.`,
    },
    {
      id: "story-failure",
      name: "Failure to Success",
      icon: FileText,
      description: "A story of overcoming failure",
      template: `I failed {number} times before I succeeded.

{failure_story}

Each failure taught me something:
1. {learning_1}
2. {learning_2}
3. {learning_3}

Finally, on attempt {final_attempt}, it worked.

{success_description}

If you're feeling discouraged, remember: failure is just data.

Keep going.`,
    },
    {
      id: "story-aha",
      name: "Aha Moment",
      icon: Sparkles,
      description: "Share a sudden realization or insight",
      template: `I had an aha moment yesterday that changed my perspective on {topic}.

I was reading/watching {source} when it hit me:

{realization}

This might seem obvious to some, but for me it was profound because {personal_context}.

Since then, I've already started to:
• {action_1}
• {action_2}

The impact so far: {early_results}.

Sometimes the best insights come from unexpected places.`,
    },
    {
      id: "story-mentor",
      name: "Mentorship Story",
      icon: BookOpen,
      description: "Share advice received from a mentor",
      template: `Best advice I ever received:

"{advice_quote}"
- {mentor_name}

This changed my approach to {topic}.

Before this advice, I was {previous_approach}.

After:
{new_approach_results}

{years} later, this still guides my decisions when {applicable_situation}.

What's the best advice you've received?`,
    },
    {
      id: "story-candid",
      name: "Candid Reflection",
      icon: Megaphone,
      description: "Share a vulnerable, honest reflection",
      template: `Candid confession:

{honest_statement}

I'm sharing this because {reason_for_sharing}.

I know many of you might relate to {shared_experience}.

Here's what I'm doing about it:

{action_plan}

No perfect solutions, just progress.

If you're going through something similar, you're not alone.`,
    },
  ],
  cta: [
    {
      id: "cta-newsletter",
      name: "Newsletter Signup",
      icon: Megaphone,
      description: "Promote your newsletter with value-first approach",
      template: `{value_proposition}

I share {content_type} every {frequency} in my newsletter.

Recent topics include:
• {example_1}
• {example_2}
• {example_3}

{bonus_offer}

Join {number}+ others who are subscribed.

Link in comments 👇`,
    },
    {
      id: "cta-consultation",
      name: "Consultation Booking",
      icon: FileText,
      description: "Offer 1:1 consultations or services",
      template: `I'm opening up {number} spots for {service_type}.

Who this is for:
• {ideal_client_1}
• {ideal_client_2}
• {ideal_client_3}

What you'll get:
{deliverables}

Investment: {price}

Results from recent clients:
{testimonial_snippet}

Interested? Comment "interested" below or DM me.`,
    },
    {
      id: "cta-content",
      name: "Content Promotion",
      icon: BookOpen,
      description: "Drive traffic to your latest content",
      template: `I just published a {content_type} on {topic}:

{headline}

Here's what you'll learn:
📌 {key_takeaway_1}
📌 {key_takeaway_2}
📌 {key_takeaway_3}

{teaser_or_insight}

Link in the comments below!

P.S. {bonus_tip}`,
    },
    {
      id: "cta-community",
      name: "Community Invitation",
      icon: Sparkles,
      description: "Invite people to join your community",
      template: `I'm building a community of {target_audience}.

We're focused on {community_focus}.

What you get as a member:
✓ {benefit_1}
✓ {benefit_2}
✓ {benefit_3}

{exclusive_offer}

Currently at {number} members and growing.

Want in? Comment "join" and I'll send you the link.

Let's grow together.`,
    },
    {
      id: "cta-engagement",
      name: "Engagement Booster",
      icon: Megaphone,
      description: "Drive comments and discussion",
      template: `{engaging_statement}

Here's my take:
{your_opinion}

But I could be wrong.

I've seen {alternative_viewpoint} work well for {context}.

What's been your experience?

{specific_question}

Let's discuss in the comments. 🗣️`,
    },
  ],
};

/**
 * Get template by category and ID
 */
const getTemplate = (category, templateId) => {
  return POST_TEMPLATES[category]?.find(t => t.id === templateId);
};

/**
 * Format template with placeholder values
 */
const formatTemplate = (template, values = {}) => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `{${key}}`),
    template
  );
};

/**
 * Suggest hashtags based on topic text
 * @param {string} text - The topic/post text
 * @param {number} limit - Maximum number of suggestions
 * @returns {string[]} Array of suggested hashtags
 */
const suggestHashtags = (text, limit = 8) => {
  if (!text || typeof text !== "string") return [];

  const textLower = text.toLowerCase();
  const suggestions = new Set();
  const scores = new Map();

  ALL_HASHTAGS.forEach((hashtag) => {
    const tagLower = hashtag.toLowerCase().replace("#", "");
    let score = 0;

    // Exact word match
    if (textLower.includes(tagLower)) {
      score += 10;
    }

    // Partial match for longer tags
    if (tagLower.length > 4) {
      const tagParts = tagLower.split(/(?=[A-Z])/).join(" ").toLowerCase();
      if (textLower.includes(tagParts) || tagParts.includes(textLower)) {
        score += 5;
      }
    }

    // Check for related keywords
    const relatedKeywords = {
      "react": ["#React", "#Frontend", "#WebDevelopment", "#JavaScript"],
      "nextjs": ["#NextJS", "#React", "#FullStack"],
      "node": ["#NodeJS", "#Backend", "#JavaScript"],
      "api": ["#API", "#Backend", "#WebDevelopment"],
      "aws": ["#AWS", "#CloudComputing", "#DevOps"],
      "docker": ["#Docker", "#DevOps", "#Kubernetes"],
      "career": ["#CareerGrowth", "#ProfessionalDevelopment", "#TechCareer"],
      "job": ["#JobSearch", "#CareerAdvice", "#Hiring"],
      "ai": ["#AI", "#ArtificialIntelligence", "#MachineLearning"],
      "machine learning": ["#MachineLearning", "#AI", "#DataScience"],
      "startup": ["#Startup", "#Entrepreneurship", "#BuildingInPublic"],
      "product": ["#ProductManagement", "#SaaS", "#ProductLaunch"],
      "team": ["#Leadership", "#Management", "#SoftSkills"],
      "remote": ["#RemoteWork", "#WorkLifeBalance"],
      "learn": ["#LearningToCode", "#Tutorial", "#TechTips"],
      "code": ["#Coding", "#Programming", "#WebDevelopment"],
      "javascript": ["#JavaScript", "#TypeScript", "#Frontend"],
      "typescript": ["#TypeScript", "#JavaScript", "#Frontend"],
      "python": ["#Python", "#Backend", "#DataScience"],
    };

    Object.entries(relatedKeywords).forEach(([keyword, tags]) => {
      if (textLower.includes(keyword)) {
        tags.forEach((tag) => {
          if (tag === hashtag) score += 3;
        });
      }
    });

    if (score > 0) {
      scores.set(hashtag, score);
    }
  });

  // Sort by score and return top suggestions
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([hashtag]) => hashtag);
};

export default function LinkedInPostGenerator({ initialTopic = "", session }) {
  const [topic, setTopic] = useState(initialTopic);
  const [postType, setPostType] = useState("insight");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState([50]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [customHashtag, setCustomHashtag] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateCategory, setTemplateCategory] = useState("hook");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // LinkedIn character limit
  const LINKEDIN_CHAR_LIMIT = 3000;
  const charCount = generatedPost.length;
  const charPercentage = (charCount / LINKEDIN_CHAR_LIMIT) * 100;
  const isNearLimit = charPercentage > 90;
  const isOverLimit = charCount > LINKEDIN_CHAR_LIMIT;

  // Generate hashtag suggestions based on topic
  const hashtagSuggestions = useMemo(
    () => suggestHashtags(topic, 8),
    [topic]
  );

  // Combine selected hashtags with suggestions (excluding already selected)
  const availableSuggestions = hashtagSuggestions.filter(
    (tag) => !selectedHashtags.includes(tag)
  );

  /**
   * Fetch content history from server or localStorage as fallback
   */
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Try fetching from server first (for authenticated users)
      const response = await fetch("/api/linkedin/content?contentType=post&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          // Transform server data to match history item structure
          const transformedHistory = data.content.map((item) => ({
            _id: item._id,
            id: item._id, // For backward compatibility
            topic: item.topic,
            post: item.postContent,
            postType: item.postType,
            tone: item.tone,
            createdAt: item.createdAt,
            isFavorite: item.isFavorite,
            hashtags: item.hashtags,
          }));
          setHistory(transformedHistory);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch history from server:", error);
    } finally {
      setIsLoadingHistory(false);
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const localHistory = JSON.parse(saved);
        setHistory(localHistory.slice(0, MAX_LOCAL_HISTORY));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  /**
   * Save content to server with localStorage fallback
   */
  const saveToHistory = async (historyItem) => {
    // Try to save to server first
    try {
      const response = await fetch("/api/linkedin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "post",
          topic: historyItem.topic,
          postContent: historyItem.post,
          postType: historyItem.postType,
          tone: historyItem.tone,
          length: historyItem.length,
          hashtags: historyItem.hashtags || selectedHashtags,
          metrics: {
            characterCount: historyItem.post?.length || 0,
            wordCount: historyItem.post?.split(/\s+/).length || 0,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh history after successful save
          fetchHistory();
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to save to server:", error);
    }

    // Fallback to localStorage
    try {
      const updatedHistory = [historyItem, ...history].slice(0, MAX_LOCAL_HISTORY);
      setHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      return true;
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      return false;
    }
  };

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  const getLengthLabel = (value) => {
    if (value < 33) return "short";
    if (value < 66) return "medium";
    return "long";
  };

  const getLengthDisplayLabel = (value) => {
    if (value < 33) return "Short (100-150 words)";
    if (value < 66) return "Medium (200-300 words)";
    return "Long (400-600 words)";
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPost("");

    try {
      const response = await fetch("/api/ai/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          postType,
          tone,
          length: getLengthLabel(length[0]),
          includeHashtags,
          includeCta,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate post");
      }

      setGeneratedPost(data.post);

      const lengthLabel = getLengthLabel(length[0]);
      const newHistoryItem = {
        id: Date.now(),
        topic: topic.trim(),
        post: data.post,
        postType,
        tone,
        length: lengthLabel,
        createdAt: new Date().toISOString(),
        hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
      };

      await saveToHistory(newHistoryItem);
      toast.success("Post generated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate post");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      toast.success("Copied to clipboard!");

      // Mark the most recent history item as exported
      if (history.length > 0) {
        const mostRecentItem = history[0];
        if (mostRecentItem._id) {
          // Mark as exported on server
          fetch("/api/linkedin/content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contentId: mostRecentItem._id,
              action: "markExported",
              exportType: "copy",
            }),
          }).catch((err) => console.error("Failed to mark as exported:", err));
        }
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Copy failed:", err);
    }
  };

  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setGeneratedPost(item.post);
    setPostType(item.postType || "insight");
    setTone(item.tone || "professional");
    if (item.hashtags) {
      setSelectedHashtags(item.hashtags);
    }
    setShowHistory(false);
    toast.info("Loaded from history");
  };

  const deleteHistoryItem = async (item, e) => {
    e.stopPropagation();

    if (item._id) {
      // Soft delete on server
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "softDelete",
          }),
        });
        if (response.ok) {
          setHistory(history.filter((h) => h._id !== item._id));
          toast.success("Deleted from history");
          return;
        }
      } catch (err) {
        console.error("Failed to delete from server:", err);
      }
    }

    // Fallback to local removal
    setHistory(history.filter((h) => h.id !== item.id));
    toast.success("Deleted from history");
  };

  const clearHistory = async () => {
    // Try to soft delete all items from server
    if (history.length > 0 && history[0]._id) {
      try {
        await Promise.all(
          history
            .filter((item) => item._id)
            .map((item) =>
              fetch("/api/linkedin/content", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contentId: item._id,
                  action: "softDelete",
                }),
              })
            )
        );
      } catch (err) {
        console.error("Failed to clear history on server:", err);
      }
    }

    // Clear local state and localStorage
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    toast.success("History cleared");
  };

  const toggleFavorite = async (item, e) => {
    e.stopPropagation();

    if (item._id) {
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "toggleFavorite",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHistory(
              history.map((h) =>
                h._id === item._id
                  ? { ...h, isFavorite: data.content.isFavorite }
                  : h
              )
            );
            toast.success(
              data.content.isFavorite ? "Added to favorites" : "Removed from favorites"
            );
            return;
          }
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    }

    // Fallback to local toggle
    setHistory(
      history.map((h) =>
        h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h
      )
    );
    toast.info("Favorite status updated");
  };

  const addHashtag = (tag) => {
    if (!selectedHashtags.includes(tag)) {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const removeHashtag = (tag) => {
    setSelectedHashtags(selectedHashtags.filter((h) => h !== tag));
  };

  const addCustomHashtag = () => {
    const trimmed = customHashtag.trim();
    if (trimmed) {
      const formatted = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      if (/^#[\w]+$/.test(formatted) && !selectedHashtags.includes(formatted)) {
        addHashtag(formatted);
        setCustomHashtag("");
        toast.success("Hashtag added");
      } else if (!/^#[\w]+$/.test(formatted)) {
        toast.error("Invalid hashtag format. Use letters, numbers, and underscores only.");
      } else {
        toast.info("Hashtag already added");
      }
    }
  };

  const handleCustomHashtagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomHashtag();
    }
  };

  const getCharCountColor = () => {
    if (isOverLimit) return "text-destructive";
    if (isNearLimit) return "text-warning";
    return "text-muted-foreground";
  };

  const getCharCountBgColor = () => {
    if (isOverLimit) return "bg-destructive";
    if (isNearLimit) return "bg-warning";
    return "bg-primary";
  };

  const handleTemplateSelect = (category, template) => {
    setSelectedTemplate(template);
    setTemplateCategory(category);
    setTopic(template.template);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" loaded! Fill in the {placeholders} with your content.`);
  };

  const getTemplateCategoryLabel = (category) => {
    const labels = {
      hook: "Hook Templates",
      story: "Story Templates",
      cta: "CTA Templates",
    };
    return labels[category] || category;
  };

  const getTemplateCategoryIcon = (category) => {
    const icons = {
      hook: FileText,
      story: BookOpen,
      cta: Megaphone,
    };
    return icons[category] || FileText;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              Generate LinkedIn Post
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4 mr-1" />
                Templates
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4 mr-1" />
                History
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Recent Posts
                    {isLoadingHistory && (
                      <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
                    )}
                  </span>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-destructive hover:text-destructive h-7"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {isLoadingHistory ? "Loading..." : "No posts yet"}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="flex items-center gap-2 group"
                      >
                        <button
                          onClick={() => loadFromHistory(item)}
                          className="flex-1 text-left p-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-foreground line-clamp-1 block">
                                {item.topic}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => toggleFavorite(item, e)}
                                className={`p-1 rounded hover:bg-accent ${
                                  item.isFavorite ? "text-yellow-500" : "text-muted-foreground"
                                }`}
                                title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => deleteHistoryItem(item, e)}
                                className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Post Templates
                  </span>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1 mb-3 p-1 bg-background rounded-lg">
                  {Object.keys(POST_TEMPLATES).map((category) => {
                    const CategoryIcon = getTemplateCategoryIcon(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        data-testid={`template-category-${category}`}
                        onClick={() => setTemplateCategory(category)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          templateCategory === category
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <CategoryIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{category}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {POST_TEMPLATES[templateCategory].map((template) => {
                    const TemplateIcon = template.icon;
                    return (
                      <motion.button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(templateCategory, template)}
                        className="text-left p-3 rounded-lg bg-background hover:bg-accent hover:border-primary/30 border border-border transition-all text-sm group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                            <TemplateIcon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-xs line-clamp-1">
                              {template.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="topic" className="text-sm font-medium text-foreground">
                  Topic / Idea
                </Label>
                <EmojiPicker
                  onEmojiSelect={(emoji) => setTopic((prev) => prev + emoji)}
                  triggerClassName="h-8 w-8 p-0"
                />
              </div>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to post about?"
                disabled={isLoading}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">Post Type</Label>
                <Select value={postType} onValueChange={setPostType} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">Tone</Label>
                <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Length</Label>
                <span className="text-xs text-muted-foreground">
                  {getLengthDisplayLabel(length[0])}
                </span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={100}
                step={1}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-border"
                />
                <span className="text-foreground">Include hashtags</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCta}
                  onChange={(e) => setIncludeCta(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-border"
                />
                <span className="text-foreground">Include call-to-action</span>
              </label>
            </div>

            {/* Hashtag Suggestions Section */}
            <AnimatePresence>
              {(hashtagSuggestions.length > 0 || selectedHashtags.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Selected Hashtags */}
                  {selectedHashtags.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Selected Hashtags ({selectedHashtags.length})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedHashtags([])}
                          className="text-xs text-muted-foreground hover:text-destructive h-6 px-2"
                        >
                          Clear all
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedHashtags.map((tag) => (
                          <motion.div
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge
                              variant="secondary"
                              className="gap-1 pr-1 text-xs cursor-pointer hover:bg-destructive/20 group"
                              onClick={() => removeHashtag(tag)}
                            >
                              <span>{tag}</span>
                              <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hashtag Suggestions */}
                  {availableSuggestions.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Suggested Hashtags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {availableSuggestions.slice(0, 6).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50"
                            onClick={() => addHashtag(tag)}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Custom Hashtag Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customHashtag}
                          onChange={(e) => setCustomHashtag(e.target.value)}
                          onKeyDown={handleCustomHashtagKeyDown}
                          placeholder="Add custom hashtag..."
                          disabled={isLoading}
                          className="flex-1 h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={addCustomHashtag}
                          disabled={isLoading || !customHashtag.trim()}
                          className="h-8 px-3"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" disabled={isLoading || !topic.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Post
                </>
              )}
            </Button>
          </form>

          {error && (
            <motion.div
              className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm font-medium text-destructive">Error: {error}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {generatedPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-border bg-gradient-to-r from-[#0077B5]/5 to-transparent">
                <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#0077B5]/10 rounded-full">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" />
                    </div>
                    Post Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {POST_TYPES.find((t) => t.value === postType)?.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tone}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-background border border-border rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      KN
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Karthik Nishanth</p>
                      <p className="text-xs text-muted-foreground">Full-Stack Developer • Just now</p>
                    </div>
                  </div>
                  <div className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost}
                  </div>
                </div>

                {/* Character Counter */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getCharCountBgColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(charPercentage, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getCharCountColor()}`}>
                      {charCount.toLocaleString()} / {LINKEDIN_CHAR_LIMIT.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmojiPicker
                      onEmojiSelect={(emoji) => setGeneratedPost((prev) => prev + emoji)}
                      triggerClassName="h-7 w-7 p-0"
                    />
                    {isOverLimit && (
                      <span className="text-xs text-destructive font-medium">
                        {charCount - LINKEDIN_CHAR_LIMIT} characters over limit
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyToClipboard} variant="default" className="flex-1 sm:flex-none">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Post
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
