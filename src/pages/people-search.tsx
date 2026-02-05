// src/pages/people-search.tsx
import Head from "next/head";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PeopleSearchResults, { Person } from "@/components/PeopleSearchResults";
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";

interface SearchResult {
  _id: string;
  name: string;
  title: string;
  company: string;
  profileUrl: string;
  text?: string;
}

const suggestedSearches = [
  "Marketing managers in New York",
  "Sales directors at Fortune 500",
  "HR professionals in healthcare",
  "Finance executives in London",
  "Operations managers manufacturing",
  "Consultants at Big 4 firms",
];

export default function PeopleSearch(): React.ReactElement {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch("/api/exa-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: q, count: 10 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || FORM_ERRORS.SUBMISSION_FAILED);
      }

      setResults((data.results || []).map((result: SearchResult) => ({
        id: result._id,
        name: result.name,
        role: result.title,
        company: result.company,
        source: "LinkedIn" as const,
        url: result.profileUrl,
        text: result.text,
      })));
    } catch (err) {
      console.error("Search error:", err);
      setError((err as Error).message || FORM_ERRORS.NETWORK_ERROR);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion: string): void => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <>
      <Head>
        <title>People Search | Find Professionals with AI</title>
        <meta
          name="description"
          content="Search for professionals, developers, and industry experts using AI-powered search. Find the right people for your network."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white text-slate-900">
        <main className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-600 text-sm mb-6">
              <span>AI-Powered People Search</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 text-slate-900">
              Find the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600">
                right people
              </span>{" "}
              instantly
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Search LinkedIn to discover professionals and industry experts 
              that match your criteria.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mb-12"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">People Search Agent</h2>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-slate-500">Ready</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="people-query"
                    name="people-query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe who you're looking for..."
                    className="w-full h-14 pl-5 pr-32 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 h-10 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Search</span>
                    )}
                  </Button>
                </div>
              </form>

              {!hasSearched && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <p className="text-xs text-slate-500 mb-3">Try searching for:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSearches.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                {["Neural Search", "Multi-Platform", "AI-Enhanced"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-center text-slate-500 text-sm"
                  >
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FormError message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <PeopleSearchResults
                  results={results}
                  isLoading={isLoading}
                  query={query}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
