import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import PageContainer from "@/components/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/MotionComponents";
import { format } from "date-fns"; // For formatting dates

// Helper function to format date nicely
const formatDateString = (dateStr) => {
  try {
    return format(new Date(dateStr), "do MMMM yyyy"); // e.g., 10th April 2025
  } catch (e) {
    console.error("Error formatting date:", dateStr, e);
    return dateStr; // Fallback to original string
  }
};

export default function NotesIndex({ notes }) {
  return (
    <>
      <Head>
        <title>Notes - Karthik Nishanth | Digital Garden</title>
        <meta
          name="description"
          content="A collection of short notes, thoughts, and code snippets from Karthik Nishanth's digital garden."
        />
      </Head>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Digital Garden Notes
            </h1>
            <p className="text-lg text-gray-400 mb-12 text-center">
              A collection of quick thoughts, learnings, and snippets. More
              informal than the blog.
            </p>
          </FadeIn>

          <div className="space-y-8">
            {notes.map((note) => (
              <FadeIn key={note.slug} delay={0.1 * notes.indexOf(note)}>
                <Link href={`/notes/${note.slug}`} passHref legacyBehavior>
                  <a className="block group">
                    <Card className="bg-gray-900/50 border border-gray-700/50 hover:border-blue-500/70 transition-colors duration-300 shadow-lg hover:shadow-blue-900/30">
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                          {note.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {formatDateString(note.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {note.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export async function getStaticProps() {
  const notesDirectory = path.join(process.cwd(), "src/content/notes");
  let notes = [];

  try {
    const filenames = fs.readdirSync(notesDirectory);

    notes = filenames
      .filter((filename) => filename.endsWith(".md")) // Only process markdown files
      .map((filename) => {
        const filePath = path.join(notesDirectory, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents); // Extract frontmatter

        // Basic validation
        if (!data.title || !data.date) {
          console.warn(`Note "${filename}" is missing title or date.`);
          return null; // Skip this file if essential frontmatter is missing
        }

        return {
          slug: filename.replace(/\.md$/, ""),
          title: data.title,
          date: data.date.toString(), // Ensure date is stringified
          tags: data.tags || [], // Default to empty array if no tags
        };
      })
      .filter((note) => note !== null); // Remove null entries from skipped files

    // Sort notes by date, newest first
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error reading notes directory or files:", error);
    // Return empty array or handle error as appropriate
    notes = [];
  }

  return {
    props: {
      notes,
    },
  };
}
