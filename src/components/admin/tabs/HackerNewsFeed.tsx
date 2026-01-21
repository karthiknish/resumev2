// Converted to TypeScript - migrated
import React, { useState, useEffect } from "react";
import { Loader2, ExternalLink, Star, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Helper to format time
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
};

const HackerNewsFeed = () => {
  const [storyIds, setStoryIds] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const STORIES_TO_FETCH = 20; // Number of stories to display

  useEffect(() => {
    const fetchTopStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch top story IDs
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        if (!response.ok) {
          throw new Error(`HN API Error: ${response.status}`);
        }
        const ids = await response.json();
        setStoryIds(ids.slice(0, STORIES_TO_FETCH)); // Get only the top N stories
      } catch (err) {
        console.error("Error fetching Hacker News story IDs:", err);
        setError(
          "Failed to fetch Hacker News story IDs. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    if (storyIds.length === 0) {
      if (!isLoading) setIsLoading(false); // Ensure loading stops if no IDs found initially
      return;
    }

    const fetchStoryDetails = async () => {
      try {
        // Fetch details for each story ID in parallel
        const storyPromises = storyIds.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (res) => {
              if (!res.ok) {
                console.warn(`Failed to fetch story ${id}: ${res.status}`);
                return null; // Return null for failed fetches
              }
              return res.json();
            }
          )
        );

        const fetchedStories = (await Promise.all(storyPromises)).filter(
          (story) => story !== null
        ); // Filter out failed fetches
        setStories(fetchedStories);
      } catch (err) {
        console.error("Error fetching Hacker News story details:", err);
        setError(
          "Failed to load story details. Some stories might be missing."
        );
        // Keep potentially partially loaded stories
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryDetails();
  }, [storyIds]); // Re-run when storyIds state changes

  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl h-[520px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
          <span>Hacker News Top Stories</span>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        {error && !isLoading && (
          <p className="text-sm text-destructive text-center py-8 px-4">{error}</p>
        )}
        {!isLoading && !error && stories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 px-4">
            No stories loaded.
          </p>
        )}
        {!isLoading && stories.length > 0 && (
          <ScrollArea className="h-full p-4">
            <ul className="space-y-3">
              {stories.map((story) => (
                <li
                  key={story.id}
                  className="p-4 bg-muted/50 rounded-xl border border-border hover:bg-card transition-colors"
                >
                  <a
                    href={
                      story.url ||
                      `https://news.ycombinator.com/item?id=${story.id}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 hover:underline text-base font-semibold block mb-2"
                  >
                    {story.title}
                  </a>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-0.5 text-xs bg-muted text-muted-foreground"
                      >
                        <Star className="h-3 w-3" /> {story.score} points
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-0.5 border-border text-muted-foreground"
                      >
                        <MessageSquare className="h-3 w-3" /> {story.descendants ?? 0} comments
                      </Badge>
                      <span>by {story.by}</span>
                      <span>{formatTimeAgo(story.time)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="p-1 h-auto text-muted-foreground hover:text-primary hover:bg-muted/50"
                      title="View on Hacker News"
                    >
                      <a
                        href={`https://news.ycombinator.com/item?id=${story.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default HackerNewsFeed;

