'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PaperActionsProps {
  fileUrl: string;
  title: string;
}

export default function PaperActions({ fileUrl, title }: PaperActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.loading('Downloading...', { id: 'paper-download' });

    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error('File not accessible');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      toast.success('Download completed', { id: 'paper-download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.', { id: 'paper-download' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label={`Download ${title}`}
      >
        <Download className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">
          {isDownloading ? 'Downloading...' : 'Download'}
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
