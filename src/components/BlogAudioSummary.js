import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

const BlogAudioSummary = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState("");

  // Initialize speech synthesis for fallback
  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Do nothing - just confirming availability
    }
  }, []);

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Generate text summary using Gemini
      const summaryResponse = await fetch("/api/ai/blog-summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, title }),
      });

      if (!summaryResponse.ok) {
        const error = await summaryResponse.json();
        throw new Error(error.error || "Failed to generate summary");
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);

      // Step 2: Try to convert summary to audio using Google Cloud TTS
      try {
        const audioResponse = await fetch("/api/ai/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: summaryData.summary }),
        });

        if (!audioResponse.ok) {
          // If Google Cloud TTS fails, use fallback
          throw new Error("Cloud TTS unavailable");
        }

        const audioData = await audioResponse.json();
        setAudioUrl(audioData.audioUrl);

        // Create audio element
        const audio = new Audio(audioData.audioUrl);
        setAudioElement(audio);

        audio.addEventListener("ended", () => {
          setIsPlaying(false);
        });
      } catch (ttsError) {
        console.warn("Using fallback TTS:", ttsError);

        // Use fallback TTS
        const fallbackResponse = await fetch(
          "/api/ai/text-to-speech-fallback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: summaryData.summary }),
          }
        );

        if (!fallbackResponse.ok) {
          throw new Error("Both TTS services failed");
        }

        const fallbackData = await fallbackResponse.json();
        setUseFallback(true);
        setFallbackText(fallbackData.text);
      }
    } catch (err) {
      console.error("Error generating audio summary:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = () => {
    if (useFallback) {
      // Use browser's Speech Synthesis API for fallback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        } else {
          const utterance = new SpeechSynthesisUtterance(fallbackText);

          // Set English voice if available
          const voices = window.speechSynthesis.getVoices();
          const englishVoice = voices.find(
            (voice) => voice.lang.includes("en-") && voice.name.includes("Male")
          );

          if (englishVoice) {
            utterance.voice = englishVoice;
          }

          utterance.lang = "en-GB";
          utterance.rate = 1;
          utterance.pitch = 1;

          utterance.onend = () => {
            setIsPlaying(false);
          };

          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      }
    } else if (audioElement) {
      // Use the audio element for Google Cloud TTS
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-8 mb-6">
      {!summary ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
          onClick={handleGenerateSummary}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              <span>Generating summary...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Generate AI Summary with Audio</span>
            </>
          )}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-5 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-100">
              AI-Generated Summary
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center rounded-full w-10 h-10 ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white shadow-lg transition-colors`}
              onClick={toggleAudio}
              disabled={!audioUrl && !useFallback}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          <div className="text-gray-300 text-sm leading-relaxed mb-3">
            {summary}
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-300">
            <SpeakerWaveIcon className="w-4 h-4" />
            <span>
              {useFallback
                ? "Using browser speech synthesis - click play to listen"
                : "Click play button to listen"}
            </span>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-red-400 text-sm"
        >
          Error: {error}
        </motion.div>
      )}
    </div>
  );
};

export default BlogAudioSummary;
