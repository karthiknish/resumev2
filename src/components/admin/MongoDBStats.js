import { useState, useEffect } from "react";
import {
  FaDatabase,
  FaUser,
  FaComments,
  FaCalendarAlt,
  FaMobile,
  FaDesktop,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
} from "react-icons/fa";

export default function MongoDBStats({ authToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authToken) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-mongodb-stats", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch MongoDB stats");
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching MongoDB stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authToken]);

  const getBrowserIcon = (browser) => {
    switch (browser?.toLowerCase()) {
      case "chrome":
        return <FaChrome className="text-yellow-400" />;
      case "firefox":
        return <FaFirefox className="text-orange-500" />;
      case "safari":
        return <FaSafari className="text-blue-400" />;
      case "edge":
        return <FaEdge className="text-blue-500" />;
      default:
        return <FaDesktop className="text-gray-400" />;
    }
  };

  const getDeviceIcon = (device) => {
    if (!device) return <FaDesktop className="text-gray-400" />;

    const deviceLower = device.toLowerCase();
    if (
      deviceLower.includes("mobile") ||
      deviceLower === "ios" ||
      deviceLower === "android"
    ) {
      return <FaMobile className="text-green-400" />;
    }
    return <FaDesktop className="text-blue-400" />;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center mb-4">
          <FaDatabase className="text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-white">MongoDB Stats</h2>
        </div>
        <div className="h-40 bg-gray-700 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <FaDatabase className="text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-white">MongoDB Stats</h2>
        </div>
        <div className="bg-red-900/50 border border-red-500 text-red-100 p-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <FaDatabase className="text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-white">MongoDB Stats</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaComments className="text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Chat Stats</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex justify-between">
              <span>Total Chats:</span>
              <span className="font-mono bg-gray-800 px-2 rounded">
                {stats.totalChats}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Total Messages:</span>
              <span className="font-mono bg-gray-800 px-2 rounded">
                {stats.totalMessages}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Avg Messages/Chat:</span>
              <span className="font-mono bg-gray-800 px-2 rounded">
                {stats.totalChats
                  ? Math.round(stats.totalMessages / stats.totalChats)
                  : 0}
              </span>
            </li>
            {stats.latestChatTimestamp && (
              <li className="flex justify-between">
                <span>Latest Chat:</span>
                <span
                  className="font-mono bg-gray-800 px-2 rounded truncate max-w-[150px]"
                  title={new Date(stats.latestChatTimestamp).toLocaleString()}
                >
                  {new Date(stats.latestChatTimestamp).toLocaleDateString()}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaUser className="text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">User Stats</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex justify-between">
              <span>Unique Users:</span>
              <span className="font-mono bg-gray-800 px-2 rounded">
                {stats.uniqueUsers}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaDesktop className="text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Devices</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            {stats.deviceBreakdown &&
              stats.deviceBreakdown.map((device, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getDeviceIcon(device._id)}
                    <span className="ml-2">{device._id || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-mono bg-gray-800 px-2 rounded">
                      {device.count}
                    </span>
                    <div className="ml-2 w-20 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (device.count / stats.totalChats) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaChrome className="text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Browsers</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            {stats.browserBreakdown &&
              stats.browserBreakdown.map((browser, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getBrowserIcon(browser._id)}
                    <span className="ml-2">{browser._id || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-mono bg-gray-800 px-2 rounded">
                      {browser.count}
                    </span>
                    <div className="ml-2 w-20 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (browser.count / stats.totalChats) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {stats.chatsByDay && stats.chatsByDay.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-red-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">
              Recent Activity
            </h3>
          </div>
          <div className="h-36 flex items-end space-x-1">
            {stats.chatsByDay.map((day, index) => {
              const maxCount = Math.max(
                ...stats.chatsByDay.map((d) => d.count)
              );
              const heightPercentage = (day.count / maxCount) * 100;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${heightPercentage}%` }}
                    title={`${day._id}: ${day.count} chats`}
                  ></div>
                  <div className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-top-left">
                    {day._id.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
