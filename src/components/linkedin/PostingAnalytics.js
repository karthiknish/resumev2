import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  format,
  subDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
} from "date-fns";
import { FadeIn } from "@/components/animations/MotionComponents";

export default function PostingAnalytics({ posts }) {
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [lastPostDays, setLastPostDays] = useState(null);
  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [bestTime, setBestTime] = useState("");
  const [bestDay, setBestDay] = useState("");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (posts && posts.length > 0) {
      analyzePostingPatterns(posts);
    }
  }, [posts]);

  const analyzePostingPatterns = (postData) => {
    const today = new Date();

    // Calculate days since last post
    if (postData.length > 0) {
      const sortedPosts = [...postData].sort((a, b) => {
        return (
          new Date(b.postedAt || b.createdAt) -
          new Date(a.postedAt || a.createdAt)
        );
      });

      const lastPostDate = new Date(
        sortedPosts[0].postedAt || sortedPosts[0].createdAt
      );
      const daysSinceLastPost = Math.floor(
        (today - lastPostDate) / (1000 * 60 * 60 * 24)
      );
      setLastPostDays(daysSinceLastPost);

      // Calculate posting streak
      let currentStreak = 0;
      let checkDate = today;

      while (true) {
        const foundPost = postData.find((post) => {
          const postDate = new Date(post.postedAt || post.createdAt);
          return isSameDay(postDate, checkDate);
        });

        if (foundPost) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }

      setStreak(currentStreak);

      // Calculate consistency score (0-100)
      // Based on posting frequency in the last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) =>
        subDays(today, i)
      );
      const postsInLast30Days = last30Days.filter((day) =>
        postData.some((post) => {
          const postDate = new Date(post.postedAt || post.createdAt);
          return isSameDay(postDate, day);
        })
      ).length;

      const score = Math.min(100, Math.round((postsInLast30Days / 30) * 100));
      setConsistencyScore(score);

      // Generate monthly activity data
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      });

      const activityData = daysInMonth.map((day) => {
        const postsOnDay = postData.filter((post) => {
          const postDate = new Date(post.postedAt || post.createdAt);
          return isSameDay(postDate, day);
        });

        return {
          date: day,
          count: postsOnDay.length,
          posts: postsOnDay,
        };
      });

      setMonthlyActivity(activityData);

      // Analyze best posting time
      const hourCounts = Array(24).fill(0);
      const dayOfWeekCounts = Array(7).fill(0);

      postData.forEach((post) => {
        if (post.postedAt) {
          const postDate = parseISO(post.postedAt);
          const hour = postDate.getHours();
          const dayOfWeek = postDate.getDay();

          hourCounts[hour]++;
          dayOfWeekCounts[dayOfWeek]++;
        }
      });

      // Find best hour
      const bestHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
      const bestHour =
        bestHourIndex === 0
          ? 12
          : bestHourIndex > 12
          ? bestHourIndex - 12
          : bestHourIndex;
      const amPm = bestHourIndex >= 12 ? "PM" : "AM";

      // Find best day
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const bestDayIndex = dayOfWeekCounts.indexOf(
        Math.max(...dayOfWeekCounts)
      );

      // Only set if there's enough data
      if (Math.max(...hourCounts) > 0) {
        setBestTime(`${bestHour}:00 ${amPm}`);
      }

      if (Math.max(...dayOfWeekCounts) > 0) {
        setBestDay(daysOfWeek[bestDayIndex]);
      }
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <Card className="bg-gray-900 text-white border-gray-800">
        <CardHeader>
          <CardTitle>Posting Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-gray-400">
              No posting data available yet. Start creating LinkedIn posts to
              see your analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FadeIn>
      <Card className="bg-gray-900 text-white border-gray-800">
        <CardHeader>
          <CardTitle>Posting Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Posting consistency */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Consistency Score</h3>
              <div className="flex items-center">
                <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${
                      consistencyScore < 30
                        ? "bg-red-500"
                        : consistencyScore < 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${consistencyScore}%` }}
                  />
                </div>
                <span className="ml-3 font-bold text-xl">
                  {consistencyScore}%
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Based on your posting frequency over the last 30 days.
              </p>
            </div>

            {/* Current streak */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Current Streak</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-blue-400">
                    {streak}
                  </span>
                  <span className="ml-2 text-gray-400">days</span>
                </div>
                {lastPostDays !== null && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Last post:</p>
                    <p
                      className={
                        lastPostDays > 3 ? "text-red-400" : "text-gray-300"
                      }
                    >
                      {lastPostDays === 0
                        ? "Today"
                        : lastPostDays === 1
                        ? "Yesterday"
                        : `${lastPostDays} days ago`}
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {streak === 0
                  ? "Start posting to build your streak!"
                  : `You've posted ${streak} day${
                      streak === 1 ? "" : "s"
                    } in a row. Keep it up!`}
              </p>
            </div>

            {/* Best posting time */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Optimal Posting</h3>
              <div className="space-y-2">
                {bestTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best time:</span>
                    <span className="font-medium text-blue-400">
                      {bestTime}
                    </span>
                  </div>
                )}
                {bestDay && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best day:</span>
                    <span className="font-medium text-blue-400">{bestDay}</span>
                  </div>
                )}
                {!bestTime && !bestDay && (
                  <p className="text-gray-400 text-sm">
                    More posts needed to determine optimal posting times.
                  </p>
                )}
              </div>
            </div>

            {/* Monthly activity overview */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                {format(new Date(), "MMMM yyyy")} Activity
              </h3>
              <div className="flex flex-wrap">
                {monthlyActivity.map((day) => (
                  <div
                    key={format(day.date, "yyyy-MM-dd")}
                    className="w-6 h-6 m-0.5 rounded-sm flex items-center justify-center text-xs"
                    style={{
                      backgroundColor:
                        day.count === 0
                          ? "#374151" // gray-700
                          : day.count === 1
                          ? "#1E40AF" // blue-800
                          : "#1D4ED8", // blue-700
                    }}
                    title={`${format(day.date, "MMM d")}: ${day.count} post${
                      day.count !== 1 ? "s" : ""
                    }`}
                  >
                    {format(day.date, "d")}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <h3 className="text-lg font-medium mb-3">Post Performance Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                Post consistently at similar times to build audience
                expectations.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                Include relevant hashtags to increase post visibility (3-5 is
                optimal).
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                Engage with comments on your posts within the first hour for
                better reach.
              </li>
              {bestDay && (
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Your posts tend to perform better on {bestDay}s. Consider
                  posting more on this day.
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
