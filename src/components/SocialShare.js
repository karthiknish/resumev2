"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Link2, Share2 } from "lucide-react";

// Static platform icon components
const createIcon = (path, stroke = false, strokeWidth = "0") => (
  <svg
    className="w-full h-full"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {typeof path === "string" ? <path d={path} /> : path}
  </svg>
);

// Platform icons (static)
const staticIcons = {
  twitter: createIcon(
    "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
  ),
  x: createIcon(
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  ),
  facebook: createIcon(
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
  ),
  linkedin: createIcon(
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  ),
  whatsapp: createIcon(
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
  ),
  email: createIcon(
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />,
    true,
    "2"
  ),
  reddit: createIcon(
    "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
  ),
  pinterest: createIcon(
    "M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
  ),
  native: <Share2 className="w-full h-full" aria-hidden="true" />,
};

/**
 * Helper function to get share URL for a platform
 * @param {string} platform - The platform name
 * @param {string} url - The URL to share
 * @param {string} title - The title to share
 * @param {string} description - Optional description
 * @param {string[]} hashtags - Optional hashtags for Twitter
 * @returns {string} The share URL
 */
export function getShareUrl(platform, url, title, description, hashtags = []) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagsStr = hashtags.length > 0
    ? encodeURIComponent(hashtags.map((tag) => tag.replace(/^#/, "")).join(","))
    : "";

  switch (platform) {
    case "twitter":
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${hashtagsStr ? `&hashtags=${hashtagsStr}` : ""}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
    case "reddit":
      return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`;
    default:
      return url;
  }
}

/**
 * SocialShare Component
 *
 * A unified social share component with support for:
 * - Twitter/X sharing
 * - Facebook sharing
 * - LinkedIn sharing
 * - Native Web Share API (mobile devices)
 * - Copy-to-clipboard functionality
 *
 * @param {Object} props
 * @param {string} props.url - The URL to share (defaults to current page URL)
 * @param {string} props.title - The title to share
 * @param {string} props.description - Optional description for sharing
 * @param {string[]} props.hashtags - Optional hashtags for Twitter (without #)
 * @param {string} props.variant - Visual style: "default" | "minimal" | "pill"
 * @param {string} props.size - Button size: "sm" | "md" | "lg"
 * @param {boolean} props.showLabel - Show platform labels (default: false)
 * @param {boolean} props.useNativeShare - Use native Web Share API when available (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onShare - Callback function called after successful share
 */
export function SocialShare({
  url,
  title = "",
  description = "",
  hashtags = [],
  variant = "default",
  size = "md",
  showLabel = false,
  useNativeShare = true,
  className = "",
  onShare,
}) {
  const [copiedState, setCopiedState] = useState({
    platform: null,
    timestamp: null,
  });

  // Get the actual URL to share
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Handle native Web Share API (for mobile devices)
  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      return false;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      });
      onShare?.("native");
      return true;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      }
      return false;
    }
  };

  // Handle share button click
  const handleShare = async (platform) => {
    // Try native share first if enabled and platform is not "copy"
    if (useNativeShare && platform !== "copy" && typeof navigator !== "undefined" && navigator.share) {
      const nativeSuccess = await handleNativeShare();
      if (nativeSuccess) return;
    }

    if (platform === "copy") {
      await handleCopyToClipboard();
    } else {
      const platformShareUrl = getShareUrl(platform, shareUrl, title, description, hashtags);
      window.open(platformShareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
      onShare?.(platform);
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedState({ platform: "copy", timestamp: Date.now() });
      toast.success("Link copied to clipboard!");
      onShare?.("copy");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedState({ platform: null, timestamp: null });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  // Platform names for labels
  const platformNames = {
    twitter: "Twitter",
    x: "X",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    email: "Email",
    reddit: "Reddit",
    pinterest: "Pinterest",
    copy: "Copy",
    native: "Share",
  };

  // Size classes
  const sizeClasses = {
    sm: {
      button: "p-1.5",
      icon: "w-4 h-4",
      label: "text-xs",
    },
    md: {
      button: "p-2",
      icon: "w-5 h-5",
      label: "text-sm",
    },
    lg: {
      button: "p-2.5",
      icon: "w-6 h-6",
      label: "text-base",
    },
  };

  // Variant styles
  const variantClasses = {
    default: {
      button: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
    },
    minimal: {
      button: "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300",
    },
    pill: {
      button: "bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-sm",
    },
  };

  const { button: variantButtonClass } = variantClasses[variant] || variantClasses.default;
  const { button: sizeButtonClass, icon: sizeIconClass, label: sizeLabelClass } = sizeClasses[size] || sizeClasses.md;

  // Default platforms to show
  const platforms = ["twitter", "facebook", "linkedin", "copy"];

  // Get icon for a platform (handles dynamic copy icon)
  const getIcon = (platform) => {
    if (platform === "copy") {
      return copiedState.platform === "copy" ? (
        <Check className="w-full h-full" aria-hidden="true" />
      ) : (
        <Link2 className="w-full h-full" aria-hidden="true" />
      );
    }
    return staticIcons[platform] || staticIcons.twitter;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {platforms.map((platform) => {
        const isCopied = copiedState.platform === "copy" && platform === "copy";

        return (
          <motion.button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`${sizeButtonClass} ${variantButtonClass} ${variant === "pill" ? "rounded-full" : "rounded-xl"} transition-colors duration-200 flex items-center gap-2`}
            aria-label={platform === "copy" ? "Copy link" : `Share on ${platformNames[platform]}`}
            title={showLabel ? undefined : platformNames[platform]}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={sizeIconClass}>
              {getIcon(platform)}
            </span>
            {showLabel && (
              <span className={`${sizeLabelClass} font-medium hidden sm:inline`}>
                {isCopied ? "Copied!" : platformNames[platform]}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Export platform icons object for custom use (static icons only)
export const SocialIcons = staticIcons;

// Set display name for debugging
SocialShare.displayName = "SocialShare";
