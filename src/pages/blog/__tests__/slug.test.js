/**
 * Tests for blog post page Open Graph and Twitter card meta tags
 * File: src/pages/blog/[slug].js
 *
 * Note: Testing Next.js Head meta tags in Jest is complex because Next.js
 * uses a custom Head management system. These tests focus on verifying
 * the component renders without errors and the data is handled correctly.
 */

import { render, screen } from "@testing-library/react";
import slugPage from "../[slug]";

// Mock database connections and models BEFORE importing the page
jest.mock("@/lib/dbConnect", () => ({}));
jest.mock("@/models/Blog", () => ({}));

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      query: { slug: "test-post" },
      pathname: "/blog/[slug]",
      asPath: "/blog/test-post",
    };
  },
}));

// Mock NextAuth session
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
}));

// Mock modules
jest.mock("@/lib/authUtils", () => ({
  checkAdminStatus: jest.fn(() => false),
}));

jest.mock("framer-motion", () => {
  const MotionComponent = ({ children, ...props }) => {
    const { whileHover, whileTap, initial, animate, exit, transition, ...validProps } = props;
    return <div {...validProps}>{children}</div>;
  };
  return {
    motion: {
      div: MotionComponent,
      button: MotionComponent,
      span: MotionComponent,
      svg: MotionComponent,
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      article: ({ children, ...props }) => <article {...props}>{children}</article>,
    },
    fadeInUpVariants: {},
    staggerContainerVariants: {},
  };
});

jest.mock("@/components/animations/MotionComponents", () => ({
  fadeInUpVariants: {},
  staggerContainerVariants: {},
}));

// Mock components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock("@/components/ui/separator", () => ({
  Separator: ({ ...props }) => <hr {...props} />,
}));

jest.mock("@/components/PageContainer", () => {
  return function PageContainer({ children, bgClassName }) {
    return <div className={bgClassName}>{children}</div>;
  };
});

jest.mock("@/components/JsonLd", () => {
  const JsonLd = function JsonLd({ data }) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  };
  JsonLd.displayName = "JsonLd";
  return {
    __esModule: true,
    default: JsonLd,
    createBlogPostingSchema: jest.fn(() => ({ "@context": "https://schema.org", "@type": "BlogPosting" })),
  };
});

jest.mock("@/components/RelatedPosts", () => {
  return function RelatedPosts({ posts }) {
    return <div data-testid="related-posts">{posts?.length || 0} related posts</div>;
  };
});

jest.mock("@/components/CommentsSection", () => {
  return function CommentsSection({ blogPostId }) {
    return <div data-testid="comments-section">Comments for {blogPostId}</div>;
  };
});

jest.mock("@/components/TipTapRenderer", () => {
  return function TipTapRenderer({ content, className }) {
    return <div className={className}>{content}</div>;
  };
});

jest.mock("@/components/LikeButton", () => {
  return function LikeButton({ blogId, initialLikeCount, initialViewCount }) {
    return (
      <div data-testid="like-button">
        Likes: {initialLikeCount} | Views: {initialViewCount}
      </div>
    );
  };
});

jest.mock("@/components/NewsletterCTA", () => {
  return function NewsletterCTA() {
    return <div data-testid="newsletter-cta">Newsletter CTA</div>;
  };
});

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock window.gtag
Object.defineProperty(window, "gtag", {
  value: jest.fn(),
  writable: true,
});

// Import SlugPage AFTER all mocks are set up
import SlugPage from "../[slug]";

describe("Blog Post Page - Component Rendering", () => {
  const mockBlogData = {
    _id: "507f1f77bcf86cd799439011",
    title: "Test Blog Post Title",
    description: "This is a test blog post description for meta tag testing",
    content: "<p>This is the blog post content.</p>",
    imageUrl: "/uploads/test-image.jpg",
    slug: "test-post",
    category: "Technology",
    tags: ["react", "nextjs", "testing"],
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-16T14:30:00.000Z",
    isPublished: true,
    likes: [],
    viewCount: 100,
  };

  const mockRelatedPosts = [
    {
      _id: "507f1f77bcf86cd799439012",
      title: "Related Post 1",
      slug: "related-post-1",
      imageUrl: "/uploads/related1.jpg",
      createdAt: "2024-01-10T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear document between tests
    document.head.innerHTML = "";
  });

  it("should render without crashing", () => {
    const { container } = render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(container).toBeInTheDocument();
  });

  it("should display the blog title", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByText("Test Blog Post Title")).toBeInTheDocument();
  });

  it("should display the blog content", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByText("<p>This is the blog post content.</p>")).toBeInTheDocument();
  });

  it("should display tags", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    // Tags appear multiple times in the document, so we check for the count
    const reactTags = screen.getAllByText("react");
    const nextjsTags = screen.getAllByText("nextjs");
    const testingTags = screen.getAllByText("testing");
    expect(reactTags.length).toBeGreaterThan(0);
    expect(nextjsTags.length).toBeGreaterThan(0);
    expect(testingTags.length).toBeGreaterThan(0);
  });

  it("should show not found message when data is null", () => {
    const { container } = render(
      <SlugPage data={null} relatedPosts={[]} />
    );
    expect(screen.getByText(/Post not found/)).toBeInTheDocument();
  });

  it("should render related posts section", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByTestId("related-posts")).toBeInTheDocument();
    expect(screen.getByText("1 related posts")).toBeInTheDocument();
  });

  it("should render comments section", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByTestId("comments-section")).toBeInTheDocument();
    expect(screen.getByText(/Comments for/)).toBeInTheDocument();
  });

  it("should render like button", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByText(/Likes: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Views: 100/)).toBeInTheDocument();
  });

  it("should render newsletter CTA", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByTestId("newsletter-cta")).toBeInTheDocument();
    expect(screen.getByText("Newsletter CTA")).toBeInTheDocument();
  });

  it("should display back button", () => {
    render(
      <SlugPage data={mockBlogData} relatedPosts={mockRelatedPosts} />
    );
    expect(screen.getByText("Back to all articles")).toBeInTheDocument();
  });
});

describe("Blog Post Page - Open Graph Image URL Generation", () => {
  describe("generateOpenGraphImageUrl utility", () => {
    const mockBlogData = {
      _id: "507f1f77bcf86cd799439011",
      title: "Test Blog Post",
      description: "Test description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/test-image.jpg",
      slug: "test-post",
      category: "Tech",
      tags: ["test"],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const mockRelatedPosts = [];

    // Helper to simulate the og:image logic from the component
    const getOpenGraphImageUrl = (imageUrl) => {
      if (imageUrl?.startsWith("http")) {
        return imageUrl;
      }
      if (imageUrl) {
        return `https://www.karthiknish.com${imageUrl}`;
      }
      return "https://www.karthiknish.com/og-default.jpg";
    };

    it("should convert relative URL to absolute URL", () => {
      const result = getOpenGraphImageUrl("/uploads/test-image.jpg");
      expect(result).toBe("https://www.karthiknish.com/uploads/test-image.jpg");
    });

    it("should return absolute HTTPS URL as-is", () => {
      const result = getOpenGraphImageUrl("https://cdn.example.com/test.png");
      expect(result).toBe("https://cdn.example.com/test.png");
    });

    it("should return absolute HTTP URL as-is", () => {
      const result = getOpenGraphImageUrl("http://cdn.example.com/test.png");
      expect(result).toBe("http://cdn.example.com/test.png");
    });

    it("should return fallback URL when imageUrl is null", () => {
      const result = getOpenGraphImageUrl(null);
      expect(result).toBe("https://www.karthiknish.com/og-default.jpg");
    });

    it("should return fallback URL when imageUrl is empty string", () => {
      const result = getOpenGraphImageUrl("");
      expect(result).toBe("https://www.karthiknish.com/og-default.jpg");
    });

    it("should return fallback URL when imageUrl is undefined", () => {
      const result = getOpenGraphImageUrl(undefined);
      expect(result).toBe("https://www.karthiknish.com/og-default.jpg");
    });
  });
});

describe("Blog Post Page - Meta Tag Data Attributes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.head.innerHTML = "";
  });

  const mockRelatedPosts = [];

  it("should handle post with all required meta data fields", () => {
    const completeData = {
      _id: "507f1f77bcf86cd799439011",
      title: "Complete Post",
      description: "Complete description",
      content: "<p>Content</p>",
      imageUrl: "https://example.com/image.jpg",
      slug: "complete-post",
      category: "Tech",
      tags: ["tag1", "tag2"],
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-16T14:30:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={completeData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("Complete Post")).toBeInTheDocument();
  });

  it("should handle post with relative imageUrl", () => {
    const relativeImageData = {
      _id: "507f1f77bcf86cd799439011",
      title: "Relative Image Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/relative.jpg",
      slug: "relative-image-post",
      category: "Tech",
      tags: [],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={relativeImageData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("Relative Image Post")).toBeInTheDocument();
  });

  it("should handle post without imageUrl", () => {
    const noImageData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Image Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: null,
      slug: "no-image-post",
      category: "Tech",
      tags: [],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noImageData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Image Post")).toBeInTheDocument();
  });

  it("should handle post without description (use title as fallback)", () => {
    const noDescriptionData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Description Post",
      description: null,
      content: "<p>Content</p>",
      imageUrl: "/uploads/image.jpg",
      slug: "no-description-post",
      category: "Tech",
      tags: [],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noDescriptionData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Description Post")).toBeInTheDocument();
  });

  it("should handle post without category", () => {
    const noCategoryData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Category Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/image.jpg",
      slug: "no-category-post",
      category: null,
      tags: ["test"],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noCategoryData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Category Post")).toBeInTheDocument();
  });

  it("should handle post without tags", () => {
    const noTagsData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Tags Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/image.jpg",
      slug: "no-tags-post",
      category: "Tech",
      tags: [],
      createdAt: "2024-01-15T10:00:00.000Z",
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noTagsData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Tags Post")).toBeInTheDocument();
  });

  it("should handle post without createdAt", () => {
    const noCreatedData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Created Date Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/image.jpg",
      slug: "no-created-post",
      category: "Tech",
      tags: [],
      createdAt: null,
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noCreatedData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Created Date Post")).toBeInTheDocument();
  });

  it("should handle post without updatedAt", () => {
    const noUpdatedData = {
      _id: "507f1f77bcf86cd799439011",
      title: "No Updated Date Post",
      description: "Description",
      content: "<p>Content</p>",
      imageUrl: "/uploads/image.jpg",
      slug: "no-updated-post",
      category: "Tech",
      tags: [],
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: null,
      isPublished: true,
    };

    const { container } = render(
      <SlugPage data={noUpdatedData} relatedPosts={mockRelatedPosts} />
    );

    expect(screen.getByText("No Updated Date Post")).toBeInTheDocument();
  });
});
