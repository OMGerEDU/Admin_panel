import React, { useEffect, useCallback } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ImageLightbox - Modal overlay for viewing images
 * Features:
 * - Full-screen overlay with dark background
 * - Click outside to close
 * - Escape key to close
 * - Download and open in new tab options
 */
export function ImageLightbox({
    src,
    alt = 'Image',
    caption,
    isOpen,
    onClose
}) {
    // Handle escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when lightbox is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen || !src) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Dark backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Close"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Action buttons */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {/* Download button */}
                <a
                    href={src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    aria-label="Download"
                >
                    <Download className="h-5 w-5" />
                </a>
                {/* Open in new tab */}
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    aria-label="Open in new tab"
                >
                    <ExternalLink className="h-5 w-5" />
                </a>
            </div>

            {/* Image container */}
            <div
                className="relative z-10 flex flex-col items-center max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                {caption && (
                    <p className="mt-3 text-white text-sm text-center max-w-lg">
                        {caption}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ImageLightbox;
