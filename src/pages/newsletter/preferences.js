import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Bell, Eye, Shield, X, Newspaper, Rocket, Briefcase, Globe, Wrench, Loader2 } from "lucide-react";

export default function NewsletterPreferences() {
  const [preferences, setPreferences] = useState({
    weeklyDigest: true,
    projectUpdates: true,
    careerTips: true,
    industryNews: true,
    productUpdates: true,
  });
  const [email, setEmail] = useState(""); // In a real implementation, you would get this from the user's session or query params

  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (pref) => {
    setPreferences((prev) => ({
      ...prev,
      [pref]: !prev[pref],
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would save these preferences to your database
      const response = await fetch("/api/update-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, preferences }), // In a real implementation, you would get the user's email
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Preferences saved successfully!");
      } else {
        toast.error(data.message || "Failed to save preferences. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (confirm("Are you sure you want to unsubscribe from all emails?")) {
      try {
        // In a real implementation, you would remove the subscriber from your database
        const response = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "user@example.com" }), // In a real implementation, you would get the user's email
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "You have been unsubscribed from all emails.");
        } else {
          toast.error(data.message || "Failed to unsubscribe. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to unsubscribe. Please try again.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Newsletter Preferences - Karthik Nishanth</title>
        <meta name="description" content="Manage your newsletter preferences" />
        <meta name="robots" content="noindex, nofollow" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen relative flex items-center justify-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10"></div>

          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-4xl mx-auto px-8"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold mb-6 shadow-lg"
              >
                <Bell className="w-4 h-4" />
                <span>Newsletter Preferences</span>
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Manage Your Preferences
                </span>
              </h1>

              <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">
                Customize the types of content you receive in your inbox. You can
                update your preferences anytime.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto">
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <Mail className="w-6 h-6 text-indigo-500" />
                  Email Preferences
                </h2>
                <p className="text-gray-600">
                  Select the types of emails you'd like to receive:
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    id: "weeklyDigest",
                    title: "Weekly Digest",
                    description:
                      "Get a summary of the latest articles and updates every week",
                    icon: Newspaper,
                  },
                  {
                    id: "projectUpdates",
                    title: "Project Updates",
                    description:
                      "Stay informed about new projects and development progress",
                    icon: Rocket,
                  },
                  {
                    id: "careerTips",
                    title: "Career Tips",
                    description:
                      "Receive advice on career growth and development opportunities",
                    icon: Briefcase,
                  },
                  {
                    id: "industryNews",
                    title: "Industry News",
                    description:
                      "Get the latest news and trends in technology and development",
                    icon: Globe,
                  },
                  {
                    id: "productUpdates",
                    title: "Product Updates",
                    description:
                      "Learn about new tools, features, and releases that might interest you",
                    icon: Wrench,
                  },
                ].map((pref) => {
                  const IconComponent = pref.icon;
                  return (
                  <motion.div
                    key={pref.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{pref.title}</h3>
                        <p className="text-sm text-gray-600">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences[pref.id] ? "default" : "outline"}
                      onClick={() => handlePreferenceChange(pref.id)}
                      className={
                        preferences[pref.id]
                          ? "bg-indigo-500 hover:bg-indigo-600"
                          : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      }
                    >
                      {preferences[pref.id] ? "Subscribed" : "Subscribe"}
                    </Button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Save Preferences
                    </>
                  )}
                </motion.button>

                <Link href="/newsletter/archive">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Archive
                  </motion.button>
                </Link>
              </div>

              <div className="border-t-2 border-indigo-100 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnsubscribe}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Unsubscribe from All Emails
                </motion.button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  This will remove you from all email lists. You can resubscribe
                  anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}