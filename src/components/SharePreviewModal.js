"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Twitter, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

// Platform preview components
const TwitterPreview = ({ title, description, imageUrl, url }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-md mx-auto shadow-sm">
    {/* Twitter header */}
    <div className="flex items-center gap-3 p-3 border-b border-slate-100">
      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
        <Twitter className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900">Your Name</p>
        <p className="text-xs text-slate-500">@username</p>
      </div>
      <Twitter className="w-5 h-5 text-slate-400" />
    </div>

    {/* Tweet content */}
    <div className="p-3">
      <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
        {title}
        {description && `\n\n${description}`}
      </p>

      {url && (
        <p className="text-xs text-blue-500 mt-2 truncate">{url}</p>
      )}
    </div>

    {/* Card preview if image exists */}
    {imageUrl && (
      <div className="mx-3 rounded-xl overflow-hidden border border-slate-200">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-3 bg-slate-50">
          <p className="text-xs text-slate-900 font-medium truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate">{url}</p>
        </div>
      </div>
    )}

    {/* Twitter actions footer */}
    <div className="flex items-center justify-around p-3 border-t border-slate-100">
      <div className="flex items-center gap-1 text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-xs">Reply</span>
      </div>
      <div className="flex items-center gap-1 text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs">Repost</span>
      </div>
      <div className="flex items-center gap-1 text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-xs">Like</span>
      </div>
      <div className="flex items-center gap-1 text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-xs">Share</span>
      </div>
    </div>
  </div>
);

const FacebookPreview = ({ title, description, imageUrl, url }) => (
  <div className="bg-slate-100 rounded-xl overflow-hidden max-w-md mx-auto">
    {/* Facebook header */}
    <div className="flex items-center gap-3 p-3">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
        <Facebook className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-900">Your Name</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          Just now
          <span className="text-slate-400">·</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" opacity="0.3"/>
          </svg>
        </p>
      </div>
    </div>

    {/* Post text */}
    <div className="px-3 pb-2">
      <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
        {title}
        {description && `\n\n${description}`}
      </p>
    </div>

    {/* Link preview card */}
    <div className="mx-3 mb-3 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className={cn("p-3", !imageUrl && "pt-3")}>
        <p className="text-xs text-slate-500 uppercase">{url ? new URL(url).hostname : 'example.com'}</p>
        <p className="font-semibold text-sm text-slate-900 line-clamp-2">{title}</p>
        {description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-1">{description}</p>
        )}
      </div>
    </div>

    {/* Facebook actions footer */}
    <div className="bg-white px-3 py-2 border-t border-slate-200">
      <div className="flex items-center justify-around">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="text-sm font-medium text-slate-600">Like</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium text-slate-600">Comment</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-sm font-medium text-slate-600">Share</span>
        </button>
      </div>
    </div>
  </div>
);

const LinkedInPreview = ({ title, description, imageUrl, url }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-md mx-auto shadow-sm">
    {/* LinkedIn header */}
    <div className="flex items-center gap-3 p-3 border-b border-slate-100">
      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
        <Linkedin className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900">Your Name</p>
        <p className="text-xs text-slate-500">Your Headline</p>
        <p className="text-xs text-slate-400">1h • <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 12c0-1.846.634-3.543 1.688-4.897L16.897 18.312C15.543 19.366 13.846 20 12 20c-4.418 0-8-3.582-8-8zm8.312 7.897L5.103 8.687C6.457 7.634 8.154 7 10 7c4.418 0 8 3.582 8 8 0 1.846-.634 3.543-1.688 4.897z"/></svg></p>
      </div>
    </div>

    {/* Post content */}
    <div className="p-3">
      <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
        {title}
        {description && `\n\n${description}`}
      </p>
    </div>

    {/* Link preview card */}
    <div className="mx-3 mb-3 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className={cn("p-3 bg-white", !imageUrl && "pt-3")}>
        <p className="text-xs text-slate-500">{url ? new URL(url).hostname : 'example.com'}</p>
        <p className="font-semibold text-sm text-slate-900 line-clamp-2">{title}</p>
        {description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-1">{description}</p>
        )}
      </div>
    </div>

    {/* LinkedIn actions footer */}
    <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
      <div className="flex items-center justify-around">
        <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-200 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="text-sm text-slate-600">Like</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-200 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm text-slate-600">Comment</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-200 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-slate-600">Repost</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-200 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-sm text-slate-600">Send</span>
        </button>
      </div>
    </div>
  </div>
);

const WhatsAppPreview = ({ title, url }) => (
  <div className="bg-[#0b141a] rounded-xl overflow-hidden max-w-md mx-auto">
    {/* WhatsApp header */}
    <div className="flex items-center gap-3 p-3 bg-[#202c33]">
      <button className="text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-100">Contact Name</p>
      </div>
      <button className="text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>

    {/* Chat background */}
    <div className="p-3 bg-[#0b141a] min-h-[200px]">
      {/* Message bubble - sent */}
      <div className="flex justify-end mb-3">
        <div className="bg-[#005c4b] rounded-lg px-3 py-2 max-w-[80%]">
          <p className="text-sm text-slate-100 whitespace-pre-wrap break-words">
            {title}
            {url && `\n\n${url}`}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs text-slate-400">12:30</span>
            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Platform tab component
const PlatformTab = ({ platform, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
      isActive
        ? "bg-slate-900 text-white shadow-sm"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
    )}
  >
    {icon}
    <span className="font-medium text-sm">{platform}</span>
  </button>
);

/**
 * SharePreviewModal Component
 *
 * A modal component that displays how shared content will appear on different
 * social media platforms. Supports previewing content for Twitter/X, Facebook,
 * LinkedIn, and WhatsApp.
 *
 * @param {Object} props
 * @param {string} props.title - The title that will be shared
 * @param {string} props.description - The description that will be shared
 * @param {string} props.url - The URL that will be shared
 * @param {string} props.imageUrl - Optional image URL for the share preview
 * @param {React.ReactNode} props.children - Trigger element for the modal
 * @param {string} props.triggerClassName - Additional classes for the trigger button
 * @param {string[]} props.platforms - Platforms to show previews for (default: all)
 * @param {string} props.defaultPlatform - Default platform to show (default: "twitter")
 */
export function SharePreviewModal({
  title = "",
  description = "",
  url = "",
  imageUrl = "",
  children,
  triggerClassName = "",
  platforms = ["twitter", "facebook", "linkedin", "whatsapp"],
  defaultPlatform = "twitter",
}) {
  const [activePlatform, setActivePlatform] = useState(defaultPlatform);

  const availablePlatforms = [
    { id: "twitter", name: "Twitter", icon: <Twitter className="w-4 h-4" /> },
    { id: "facebook", name: "Facebook", icon: <Facebook className="w-4 h-4" /> },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
    { id: "whatsapp", name: "WhatsApp", icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    )},
  ].filter((p) => platforms.includes(p.id));

  // Get the current preview component based on active platform
  const renderPreview = () => {
    const props = { title, description, imageUrl, url };

    switch (activePlatform) {
      case "twitter":
        return <TwitterPreview {...props} />;
      case "facebook":
        return <FacebookPreview {...props} />;
      case "linkedin":
        return <LinkedInPreview {...props} />;
      case "whatsapp":
        return <WhatsAppPreview {...props} />;
      default:
        return <TwitterPreview {...props} />;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={triggerClassName}>
      <Eye className="w-4 h-4 mr-2" />
      Preview
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Preview</DialogTitle>
          <DialogDescription>
            See how your content will appear when shared on different platforms
          </DialogDescription>
        </DialogHeader>

        {/* Platform tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {availablePlatforms.map((platform) => (
            <PlatformTab
              key={platform.id}
              platform={platform.name}
              isActive={activePlatform === platform.id}
              onClick={() => setActivePlatform(platform.id)}
              icon={platform.icon}
            />
          ))}
        </div>

        {/* Preview area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-4"
          >
            {renderPreview()}
          </motion.div>
        </AnimatePresence>

        {/* Content info */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">Title:</span>
              <span className="text-slate-600 dark:text-slate-400 break-all">{title || "Not set"}</span>
            </div>
            {description && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">Description:</span>
                <span className="text-slate-600 dark:text-slate-400 break-all">{description}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">URL:</span>
              <span className="text-slate-600 dark:text-slate-400 break-all text-xs">{url || "Not set"}</span>
            </div>
            {imageUrl && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">Image:</span>
                <span className="text-slate-600 dark:text-slate-400 break-all text-xs">{imageUrl}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

SharePreviewModal.displayName = "SharePreviewModal";

export default SharePreviewModal;
