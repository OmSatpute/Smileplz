import { useEffect } from "react";
import { X, Download, Share2, Heart, Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resolveAssetUrl } from "@/lib/api";

export const Lightbox = ({ tile, index, total, onClose, onPrev, onNext, onShare }) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  if (!tile) return null;

  const previewUrl = resolveAssetUrl(tile.preview_url);
  const downloadUrl = resolveAssetUrl(tile.download_url);

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
      return;
    }
    toast("Preparing your full-resolution download...", {
      description: `Frame ${String(index + 1).padStart(3, "0")} will appear in your downloads shortly.`,
    });
  };

  const handleFavourite = () => {
    toast("Added to your private favourites", {
      description: "You can revisit it anytime from this gallery.",
    });
  };

  return (
    <div
      data-testid="lightbox-overlay"
      className="fixed inset-0 z-50 bg-black/97 fade-in flex flex-col"
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10">
        <div className="font-ui text-[11px] tracking-editorial uppercase text-white/70">
          Frame No. {String(index + 1).padStart(3, "0")} / {String(total).padStart(3, "0")}
        </div>
        <button
          data-testid="lightbox-close"
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-2 -mr-2"
          aria-label="Close"
        >
          <X strokeWidth={1.4} className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-12 py-6">
        <div className="relative h-full max-h-full aspect-[3/4] max-w-3xl bg-[#0c0c0c] border border-white/10 overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Matched event frame ${index + 1}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 16px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Aperture strokeWidth={1} className="w-14 h-14 text-white/25" />
              </div>
            </>
          )}
          <div className="absolute top-4 left-4 font-ui text-[10px] tracking-editorial uppercase text-white/60 bg-black/35 px-2 py-1">
            {tile.id} / {tile.ratio}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            data-testid="lightbox-prev"
            onClick={onPrev}
            className="font-ui text-[11px] tracking-editorial uppercase text-white/65 hover:text-white px-3 py-2 transition-colors"
          >
            Prev
          </button>
          <span className="text-white/20">/</span>
          <button
            data-testid="lightbox-next"
            onClick={onNext}
            className="font-ui text-[11px] tracking-editorial uppercase text-white/65 hover:text-white px-3 py-2 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            data-testid="lightbox-favourite"
            onClick={handleFavourite}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/5 rounded-none font-ui text-[11px] tracking-editorial uppercase h-10"
          >
            <Heart strokeWidth={1.4} className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Favourite</span>
          </Button>
          <Button
            data-testid="lightbox-share"
            onClick={() => onShare(tile)}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/5 rounded-none font-ui text-[11px] tracking-editorial uppercase h-10"
          >
            <Share2 strokeWidth={1.4} className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            data-testid="lightbox-download"
            onClick={handleDownload}
            className="bg-white text-black hover:bg-white/90 rounded-none font-ui text-[11px] tracking-editorial uppercase h-10 px-4"
          >
            <Download strokeWidth={1.6} className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
