"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PaperActionsProps {
  fileUrl: string;
  title: string;
}

export default function PaperActions({ fileUrl, title }: PaperActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const copyStatusTimerRef = useRef<NodeJS.Timeout | null>(null);

  const aiPrompt = [
    "Go through each and every question in this question paper and answer it properly.",
    `Question paper title: ${title}`,
    `PDF URL: ${fileUrl}`,
    "Answer in a clear, step-by-step format.",
  ].join("\n");

  const encodedPrompt = encodeURIComponent(aiPrompt);

  const aiLinks = {
    chatgpt: `https://chatgpt.com/?q=${encodedPrompt}`,
    claude: `https://claude.ai/new?q=${encodedPrompt}`,
    gemini: "https://gemini.google.com/app",
  };

  useEffect(() => {
    return () => {
      if (copyStatusTimerRef.current) {
        clearTimeout(copyStatusTimerRef.current);
      }
    };
  }, []);

  const setTemporaryCopyStatus = (status: "copied" | "failed") => {
    setCopyStatus(status);

    if (copyStatusTimerRef.current) {
      clearTimeout(copyStatusTimerRef.current);
    }

    copyStatusTimerRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 3500);
  };

  const handleGeminiOpen = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setTemporaryCopyStatus("copied");
      window.open(aiLinks.gemini, "_blank", "noopener,noreferrer");
      toast.success("Gemini opened. Prompt copied to clipboard.", {
        id: "open-gemini",
      });
    } catch (error) {
      console.error("Gemini open error:", error);
      setTemporaryCopyStatus("failed");
      window.open(aiLinks.gemini, "_blank", "noopener,noreferrer");
      toast.info("Gemini opened. Paste the prompt manually if needed.", {
        id: "open-gemini",
      });
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.loading("Downloading...", { id: "paper-download" });

    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("File not accessible");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      toast.success("Download completed", { id: "paper-download" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file. Please try again.", {
        id: "paper-download",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div aria-live="polite" className="sr-only">
        {copyStatus === "copied"
          ? "Prompt copied to clipboard"
          : copyStatus === "failed"
            ? "Could not copy prompt to clipboard"
            : ""}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Open in AI assistant">
            <Sparkles className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Open in</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <a href={aiLinks.chatgpt} target="_blank" rel="noopener noreferrer">
              Open in ChatGPT
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={aiLinks.claude} target="_blank" rel="noopener noreferrer">
              Open in Claude
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleGeminiOpen}>
            Open in Gemini
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {copyStatus === "copied" && (
        <span className="hidden sm:inline text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
          Prompt copied
        </span>
      )}
      {copyStatus === "failed" && (
        <span className="hidden sm:inline text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
          Copy failed
        </span>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label={`Download ${title}`}
      >
        <Download className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">
          {isDownloading ? "Downloading..." : "Download"}
        </span>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in new tab"
        >
          <ExternalLink className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Open in New Tab</span>
        </a>
      </Button>
    </div>
  );
}
