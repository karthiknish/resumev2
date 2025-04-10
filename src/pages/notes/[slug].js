import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import PageContainer from "@/components/PageContainer";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/MotionComponents";
import { format } from "date-fns"; // For formatting dates
import { Button } from "@/components/ui/button"; // Import Button

// Helper function to format date nicely
const formatDateString = (dateStr) => {
  try {
    return format(new Date(dateStr), "do MMMM yyyy"); // e.g., 10th April 2025
  } catch (e) {
    console.error("Error formatting date:", dateStr, e);
    return dateStr; // Fallback to original string
  }
};

export default function NotePage({ frontmatter, content }) {
  const router = useRouter();

  // Fallback for ISR or if props are not ready
  if (router.isFallback || !frontmatter) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-white text-xl">Loading note...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <Head>
        <title>{frontmatter.title} - Notes | Karthik Nishanth</title>
        {/* You might want a more specific meta description here, maybe derived from content */}
        <meta
          name="description"
          content={`A note titled "${frontmatter.title}" from Karthik Nishanth's digital garden.`}
        />
      </Head>
      <PageContainer>
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <article className="prose prose-lg prose-invert prose-headings:text-blue-400 prose-a:text-blue-300 hover:prose-a:text-blue-100 prose-strong:text-white">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {frontmatter.title}
              </h1>

              {/* Date and Tags */}
              <div className="mb-8 text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>{formatDateString(frontmatter.date)}</span>
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>

            {/* Back Button */}
            <div className="mt-12">
              <Link href="/notes" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                >
                  ← Back to Notes
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

export async function getStaticPaths() {
  const notesDirectory = path.join(process.cwd(), "src/content/notes");
  let filenames = [];
  try {
    filenames = fs.readdirSync(notesDirectory);
  } catch (error) {
    console.error("Could not read notes directory for paths:", error);
  }

  const paths = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => ({
      params: {
        slug: filename.replace(/\.md$/, ""),
      },
    }));

  return {
    paths,
    fallback: true, // Use 'blocking' or true if you expect many notes or want ISR
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const notesDirectory = path.join(process.cwd(), "src/content/notes");
  const filePath = path.join(notesDirectory, `${slug}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Basic validation
    if (!data.title || !data.date) {
      console.warn(`Note "${slug}" is missing title or date.`);
      // Return notFound to render a 404 page if essential data is missing
      return { notFound: true };
    }

    return {
      props: {
        frontmatter: {
          ...data,
          date: data.date.toString(), // Ensure date is stringified
          tags: data.tags || [], // Ensure tags is always an array
        },
        content,
      },
      revalidate: 60, // Optional: Revalidate the page every 60 seconds for ISR
    };
  } catch (error) {
    console.error(`Error reading note file for slug "${slug}":`, error);
    return {
      notFound: true, // Render 404 if file doesn't exist or error reading
    };
  }
}
