export interface PricingFeature {
  type: string;
  price: string;
  features: string[];
  color: string;
  recommended: boolean;
}

export const pricingData: PricingFeature[] = [
  {
    type: "Freelancer",
    price: "$50-100/hr",
    features: [
      "Direct communication with your developer",
      "Faster turnaround times",
      "Personalized attention",
      "Lower overhead costs",
      "Flexible working hours",
      "No agency markup fees",
    ],
    color: "from-blue-600 to-cyan-500",
    recommended: true,
  },
  {
    type: "Agency",
    price: "$150-300/hr",
    features: [
      "Communication through project managers",
      "Longer approval processes",
      "Split attention on multiple projects",
      "Higher overhead costs",
      "Fixed business hours",
      "Additional management fees",
    ],
    color: "from-gray-700 to-gray-900",
    recommended: false,
  },
];

export interface Testimonial {
  name: string;
  company: string;
  text: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    company: "Fashion Boutique Owner",
    text: "Working with a freelance developer gave me direct access to person building my website. No middlemen, no delays—just fast, personalized service that saved me thousands.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Michael Chen",
    company: "Tech Startup Founder",
    text: "After switching from an agency to a freelancer, our development costs dropped by 40% while our site performance improved dramatically. The direct collaboration made all the difference.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Emma Rodriguez",
    company: "Restaurant Chain Manager",
    text: "Our freelancer understood our vision immediately and implemented features in days that our previous agency would have taken weeks to deliver. The personal touch and accountability are unmatched.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
];
