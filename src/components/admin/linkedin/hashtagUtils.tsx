// Converted to TypeScript - migrated
import { ALL_HASHTAGS } from "./constants";

export const suggestHashtags = (text: string, limit: number = 8): string[] => {
  if (!text || typeof text !== "string") return [];

  const textLower = text.toLowerCase();
  const suggestions = new Set<string>();
  const scores = new Map<string, number>();

  ALL_HASHTAGS.forEach((hashtag) => {
    const tagLower = hashtag.toLowerCase().replace("#", "");
    let score = 0;

    if (textLower.includes(tagLower)) {
      score += 10;
    }

    if (tagLower.length > 4) {
      const tagParts = tagLower.split(/(?=[A-Z])/).join(" ").toLowerCase();
      if (textLower.includes(tagParts) || tagParts.includes(textLower)) {
        score += 5;
      }
    }

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

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([hashtag]) => hashtag);
};

