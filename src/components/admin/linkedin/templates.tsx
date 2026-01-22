// Converted to TypeScript - migrated
import type { ComponentType } from "react";
import { FileText, BookOpen, Megaphone, Sparkles } from "lucide-react";

export interface TemplateItem {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  template: string;
}

export type TemplateCategory = "hook" | "story" | "cta";

export const POST_TEMPLATES: Record<TemplateCategory, TemplateItem[]> = {
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

export const getTemplate = (category: TemplateCategory, templateId: string): TemplateItem | undefined => {
  return POST_TEMPLATES[category]?.find(t => t.id === templateId);
};

export const formatTemplate = (template: string, values: Record<string, string> = {}): string => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `{${key}}`),
    template
  );
};

export const getTemplateCategoryLabel = (category: TemplateCategory): string => {
  const labels: Record<TemplateCategory, string> = {
    hook: "Hook Templates",
    story: "Story Templates",
    cta: "CTA Templates",
  };
  return labels[category];
};

export const getTemplateCategoryIcon = (category: TemplateCategory) => {
  const icons: Record<TemplateCategory, ComponentType<{ className?: string }>> = {
    hook: FileText,
    story: BookOpen,
    cta: Megaphone,
  };
  return icons[category];
};
