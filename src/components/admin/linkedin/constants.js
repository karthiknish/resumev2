export const POST_TYPES = [
  { value: "insight", label: "Insight", description: "Share a professional observation" },
  { value: "story", label: "Story", description: "Tell a personal story with a lesson" },
  { value: "tutorial", label: "Tutorial", description: "Provide a quick how-to or tip" },
  { value: "opinion", label: "Opinion", description: "Express a thought-provoking view" },
  { value: "celebration", label: "Celebration", description: "Celebrate an achievement" },
];

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "thoughtful", label: "Thoughtful" },
  { value: "inspiring", label: "Inspiring" },
  { value: "educational", label: "Educational" },
];

export const HASHTAG_CATEGORIES = {
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

export const ALL_HASHTAGS = Object.values(HASHTAG_CATEGORIES).flat();
