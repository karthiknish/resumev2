import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Person {
  id: string;
  name?: string;
  role?: string;
  company?: string;
  source: "LinkedIn" | "GitHub" | "Twitter" | "Web";
  text?: string;
  url: string;
  highlights?: string[];
}

interface PersonCardProps {
  person: Person;
  index: number;
}

const sourceColors: Record<string, string> = {
  LinkedIn: "bg-blue-100 text-blue-600 border-blue-200",
  GitHub: "bg-gray-100 text-gray-600 border-gray-200",
  Twitter: "bg-sky-100 text-sky-600 border-sky-200",
  Web: "bg-purple-100 text-purple-600 border-purple-200",
};

const PersonCard: React.FC<PersonCardProps> = ({ person, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="group h-full border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg font-bold text-purple-600">
                {person.name?.charAt(0) || "?"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                    {person.name || "Unknown"}
                  </h3>
                  {person.role && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <span className="truncate">{person.role}</span>
                    </div>
                  )}
                </div>
                <span
                  className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border ${
                    sourceColors[person.source] || sourceColors.Web
                  }`}
                >
                  {person.source}
                </span>
              </div>

              {person.company && (
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <span className="truncate">{person.company}</span>
                </div>
              )}

              {person.text && (
                <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {person.text}
                </p>
              )}

              {person.highlights && person.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.highlights.slice(0, 2).map((highlight, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {highlight.substring(0, 50)}...
                    </span>
                  ))}
                </div>
              )}

              <a
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-purple-600 hover:text-purple-700 transition-colors group/link"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  query: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ query }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <span className="text-3xl">👤</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
      <p className="text-slate-500 max-w-md mx-auto">
        {query
          ? `We couldn't find anyone matching "${query}". Try adjusting your search terms.`
          : "Enter a search query to find relevant people."}
      </p>
    </motion.div>
  );
};

interface PeopleSearchResultsProps {
  results?: Person[];
  isLoading?: boolean;
  query: string;
}

export default function PeopleSearchResults({
  results,
  isLoading = false,
  query,
}: PeopleSearchResultsProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!results || results.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-slate-500">
          Found <span className="text-slate-900 font-medium">{results.length}</span>{" "}
          {results.length === 1 ? "person" : "people"}
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((person, index) => (
          <PersonCard key={person.id} person={person} index={index} />
        ))}
      </div>
    </div>
  );
}
