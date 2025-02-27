import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionComponents";

// Categories for LinkedIn posts
const contentCategories = [
  { id: "thoughtLeadership", label: "Thought Leadership" },
  { id: "industryNews", label: "Industry News & Trends" },
  { id: "professionalAchievements", label: "Professional Achievements" },
  { id: "careerAdvice", label: "Career Advice & Tips" },
  { id: "behindTheScenes", label: "Behind the Scenes" },
  { id: "companyUpdates", label: "Company Updates" },
  { id: "personalBranding", label: "Personal Branding" },
];

// Industry-specific suggestions
const industrySpecificSuggestions = {
  tech: [
    "Share your thoughts on [latest programming language/framework] and how it's impacting development workflows",
    "Discuss how AI is transforming [specific tech area] and what skills professionals need to adapt",
    "Break down a complex technical concept in simple terms that non-technical professionals can understand",
    "Share your experience implementing [specific technology] and lessons learned that could help others",
  ],
  finance: [
    "Analyze current market trends and provide insights on what they mean for [specific financial sector]",
    "Explain a complex financial concept in simple terms that helps your network make better decisions",
    "Share your perspective on how [emerging technology] is disrupting traditional financial services",
    "Discuss regulatory changes in the financial industry and their practical implications",
  ],
  marketing: [
    "Share data from a recent marketing campaign and the insights that surprised you",
    "Break down a successful marketing strategy and explain why it resonated with the target audience",
    "Discuss how [emerging trend] is changing consumer behavior and what marketers should do about it",
    "Analyze a brand's recent campaign and share what others can learn from its approach",
  ],
  healthcare: [
    "Explain how a recent healthcare innovation is improving patient outcomes",
    "Share insights on healthcare accessibility and how technology is bridging gaps",
    "Discuss the intersection of healthcare and [another field] and the opportunities it presents",
    "Explain how healthcare professionals can leverage [specific technology/approach] to improve care",
  ],
  education: [
    "Share innovative teaching methods that are improving student engagement and outcomes",
    "Discuss how technology is transforming education and what it means for future learning",
    "Analyze skills gaps in education and how they can be addressed",
    "Share resources that have helped you or your students grow professionally",
  ],
};

export default function PostSuggestionGenerator({ onSelectSuggestion }) {
  const [industry, setIndustry] = useState("tech");
  const [category, setCategory] = useState("thoughtLeadership");
  const [generatedSuggestions, setGeneratedSuggestions] = useState([]);

  // Function to generate personalized suggestions
  const generateSuggestions = () => {
    // Get industry-specific suggestions
    const industrySuggestions =
      industrySpecificSuggestions[industry] || industrySpecificSuggestions.tech;

    // Generic suggestions based on content category
    const categorySuggestions = getCategorySuggestions(category);

    // Combine and randomize suggestions
    const combinedSuggestions = [
      ...industrySuggestions,
      ...categorySuggestions,
    ];
    const shuffledSuggestions = combinedSuggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    setGeneratedSuggestions(shuffledSuggestions);
  };

  // Get suggestions based on content category
  const getCategorySuggestions = (selectedCategory) => {
    switch (selectedCategory) {
      case "thoughtLeadership":
        return [
          "Share your perspective on how [industry trend] will evolve over the next year",
          "Discuss a common misconception in your field and why it persists",
          "Analyze the impact of [recent event] on your industry and what professionals should be considering",
          "Share your framework for approaching [common professional challenge]",
        ];
      case "industryNews":
        return [
          "Break down the implications of [recent industry news] in terms that matter to your network",
          "Share your take on a recent industry report and what surprised you most",
          "Discuss how [recent innovation] is likely to change standard practices in your field",
          "Analyze a recent merger/acquisition and what it signals about industry direction",
        ];
      case "professionalAchievements":
        return [
          "Share a recent project completion and what you learned from the process",
          "Discuss a challenge you overcame and the approach that worked for you",
          "Highlight a team achievement and recognize the contributions that made it possible",
          "Share a certification or skill you've recently acquired and why you pursued it",
        ];
      case "careerAdvice":
        return [
          "Share the best career advice you've received and how it's shaped your journey",
          "Discuss skills that have unexpectedly helped your career advancement",
          "Outline your approach to [common professional challenge] with practical steps",
          "Share resources that have helped you develop professionally over the past year",
        ];
      case "behindTheScenes":
        return [
          "Share your typical workday routine and tools that keep you productive",
          "Provide a glimpse into how your team collaborates on [specific type of project]",
          "Share your workspace setup and how it enhances your productivity",
          "Discuss how your company/team approaches [specific process] differently",
        ];
      case "companyUpdates":
        return [
          "Share exciting news about your company's latest [product/service/initiative]",
          "Highlight your company culture and what makes it unique",
          "Announce a company milestone and the journey to achieving it",
          "Share your company's approach to [industry challenge] and the results you're seeing",
        ];
      case "personalBranding":
        return [
          "Share your professional philosophy and how it guides your decision-making",
          "Discuss how your unique background gives you a different perspective in your role",
          "Share how you balance professional development with personal well-being",
          "Reflect on your professional journey and key inflection points that shaped your path",
        ];
      default:
        return [
          "Share an interesting insight from your professional experience this week",
          "Discuss something you've learned recently that changed your perspective",
          "Share a resource that has helped you grow professionally",
          "Ask your network for their thoughts on a current industry trend or challenge",
        ];
    }
  };

  return (
    <Card className="bg-gray-900 text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl">Personalized Post Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Your Industry
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="tech">Technology & Software</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="marketing">
                  Marketing & Advertising
                </SelectItem>
                <SelectItem value="healthcare">Healthcare & Medical</SelectItem>
                <SelectItem value="education">Education & Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Content Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {contentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4">
        <Button
          onClick={generateSuggestions}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Generate Post Ideas
        </Button>
      </CardFooter>

      {generatedSuggestions.length > 0 && (
        <CardContent className="border-t border-gray-800 pt-4">
          <h3 className="text-lg font-medium mb-3">Your Custom Post Ideas</h3>
          <StaggerContainer className="space-y-3">
            {generatedSuggestions.map((suggestion, index) => (
              <StaggerItem key={index} index={index}>
                <HoverCard>
                  <div
                    className="p-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => onSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </CardContent>
      )}
    </Card>
  );
}
