// Converted to TypeScript - migrated
import { Lightbulb, BookOpen, FileText, TrendingUp, LucideIcon } from "lucide-react";

export interface CarouselTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  template: string;
  slideCount: number;
  placeholders: Record<string, string>;
}

export const CAROUSEL_TEMPLATES: Record<string, CarouselTemplate[]> = {
  educational: [
    {
      id: "edu-tips",
      name: "Quick Tips",
      icon: Lightbulb,
      description: "Share bite-sized tips on any topic",
      template: "{number} Quick Tips for {topic}",
      slideCount: 5,
      placeholders: {
        topic: "Better JavaScript",
        number: "5",
      },
    },
    {
      id: "edu-mistakes",
      name: "Common Mistakes",
      icon: BookOpen,
      description: "Highlight mistakes and how to avoid them",
      template: "{number} Common {audience} Mistakes to Avoid",
      slideCount: 6,
      placeholders: {
        audience: "New Developer",
        number: "6",
      },
    },
    {
      id: "edu-steps",
      name: "Step-by-Step Guide",
      icon: FileText,
      description: "Break down a process into actionable steps",
      template: "How to {outcome}: A Step-by-Step Guide",
      slideCount: 7,
      placeholders: {
        outcome: "Build a React App",
      },
    },
    {
      id: "edu-myths",
      name: "Myth vs Reality",
      icon: BookOpen,
      description: "Debunk common myths in your industry",
      template: "{number} Myths About {topic} (Debunked)",
      slideCount: 5,
      placeholders: {
        topic: "Remote Work",
        number: "5",
      },
    },
    {
      id: "edu-checklist",
      name: "Actionable Checklist",
      icon: FileText,
      description: "Create a practical checklist for your audience",
      template: "The Ultimate {topic} Checklist",
      slideCount: 6,
      placeholders: {
        topic: "Code Review",
      },
    },
  ],
  professional: [
    {
      id: "prof-journey",
      name: "Career Journey",
      icon: TrendingUp,
      description: "Share your professional growth story",
      template: "My {timeframe} Career Journey in {industry}",
      slideCount: 5,
      placeholders: {
        timeframe: "5-Year",
        industry: "Tech",
      },
    },
    {
      id: "prof-lessons",
      name: "Key Lessons Learned",
      icon: BookOpen,
      description: "Share wisdom from your experience",
      template: "{number} Lessons I Learned from {experience}",
      slideCount: 5,
      placeholders: {
        number: "5",
        experience: "My First Job",
      },
    },
    {
      id: "prof-tools",
      name: "Tools & Resources",
      icon: FileText,
      description: "Curate a list of valuable tools",
      template: "{number} Essential Tools for {purpose}",
      slideCount: 6,
      placeholders: {
        number: "7",
        purpose: "Frontend Development",
      },
    },
    {
      id: "prof-trends",
      name: "Industry Trends",
      icon: TrendingUp,
      description: "Highlight trending topics in your field",
      template: "{number} {industry} Trends to Watch in {year}",
      slideCount: 5,
      placeholders: {
        number: "5",
        industry: "Tech",
        year: "2024",
      },
    },
    {
      id: "prof-advice",
      name: "Pro Tips",
      icon: Lightbulb,
      description: "Share professional advice",
      template: "Pro Tips for {skill}: From {level} to {level}",
      slideCount: 5,
      placeholders: {
        skill: "React",
        level: "Beginner",
        level2: "Advanced",
      },
    },
  ],
  engaging: [
    {
      id: "eng-quiz",
      name: "Quiz Format",
      icon: Lightbulb,
      description: "Create an interactive quiz carousel",
      template: "Quiz: How Much Do You Know About {topic}?",
      slideCount: 6,
      placeholders: {
        topic: "Web Development",
      },
    },
    {
      id: "eng-before-after",
      name: "Before & After",
      icon: TrendingUp,
      description: "Show transformation results",
      template: "Before & After: Transforming {outcome}",
      slideCount: 5,
      placeholders: {
        outcome: "Your Coding Skills",
      },
    },
    {
      id: "eng-comparison",
      name: "This vs That",
      icon: FileText,
      description: "Compare two options or approaches",
      template: "{option1} vs {option2}: Which is Better?",
      slideCount: 5,
      placeholders: {
        option1: "React",
        option2: "Vue",
      },
    },
    {
      id: "eng-story",
      name: "Story Series",
      icon: BookOpen,
      description: "Tell a story across multiple slides",
      template: "Story Time: {title}",
      slideCount: 7,
      placeholders: {
        title: "How I Got My First Developer Job",
      },
    },
    {
      id: "eng-stats",
      name: "Statistics Roundup",
      icon: TrendingUp,
      description: "Share compelling statistics",
      template: "{number} Surprising Statistics About {topic}",
      slideCount: 6,
      placeholders: {
        number: "7",
        topic: "Remote Work",
      },
    },
  ],
};

export const getTemplate = (category: string, templateId: string) => {
  return CAROUSEL_TEMPLATES[category]?.find(t => t.id === templateId);
};

export const formatTemplate = (template: string, values: Record<string, string> = {}) => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value) || `{${key}}`),
    template
  );
};

export const getTemplateCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    educational: "Educational",
    professional: "Professional",
    engaging: "Engaging",
  };
  return labels[category] || category;
};

export const getTemplateCategoryIcon = (category: string) => {
  const icons: Record<string, LucideIcon> = {
    educational: BookOpen,
    professional: TrendingUp,
    engaging: Lightbulb,
  };
  return icons[category] || FileText;
};

