import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link2, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const SHARE_BASE = typeof window !== "undefined" ? window.location.origin : "";

export const ShareSheet = ({
  open,
  onOpenChange,
  scope = "gallery",
  tile,
  eventId = "AUR-JMS-26",
}) => {
  const [copied, setCopied] = useState(false);
  const url =
    scope === "tile" && tile
      ? `${SHARE_BASE}/event/${eventId}/gallery?frame=${tile.id}`
      : `${SHARE_BASE}/event/${eventId}/gallery`;

  const title =
    scope === "tile"
      ? `Frame ${tile?.id.replace("f-", "")} from my event gallery`
      : "My private event gallery";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("Could not copy. Long-press the link to share.");
    }
  };

  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `${title}\n\n${url}`,
  )}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="share-sheet"
        className="max-w-md rounded-none border border-[#E5E5E0] bg-white p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
            Share / {scope === "tile" ? "this frame" : "my gallery"}
          </div>
          <DialogTitle className="font-display text-3xl font-medium leading-tight text-[#121212] mt-2">
            {title}
          </DialogTitle>
          <DialogDescription className="font-ui text-sm text-[#666] mt-2">
            Share this gallery link with people you trust.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-3">
          <div className="flex items-stretch border border-[#E5E5E0]">
            <div className="flex items-center px-3 border-r border-[#E5E5E0] text-[#666]">
              <Link2 strokeWidth={1.4} className="w-4 h-4" />
            </div>
            <div
              data-testid="share-url"
              className="flex-1 px-3 py-3 font-ui text-xs text-[#121212] truncate"
            >
              {url}
            </div>
            <Button
              data-testid="share-copy"
              onClick={copy}
              className="rounded-none bg-[#121212] text-white hover:bg-black h-auto font-ui text-[11px] tracking-editorial uppercase px-4"
            >
              {copied ? (
                <>
                  <Check strokeWidth={1.6} className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy strokeWidth={1.6} className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              data-testid="share-whatsapp"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#E5E5E0] py-3 flex items-center justify-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#121212] hover:bg-[#F1F1EE] transition-colors"
            >
              <MessageCircle strokeWidth={1.4} className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              data-testid="share-email"
              href={mailHref}
              className="border border-[#E5E5E0] py-3 flex items-center justify-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#121212] hover:bg-[#F1F1EE] transition-colors"
            >
              <Mail strokeWidth={1.4} className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="hairline mb-4" />
          <p className="font-ui text-[10px] tracking-editorial uppercase text-[#999]">
            SmilePlzzz / Event photos delivered privately
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSheet;
