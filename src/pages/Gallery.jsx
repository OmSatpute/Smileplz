import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2, Download, Heart, Sparkles, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorialHeader from "@/components/EditorialHeader";
import PhotoTile from "@/components/PhotoTile";
import Lightbox from "@/components/Lightbox";
import ShareSheet from "@/components/ShareSheet";
import { EVENT, photosToTiles } from "@/lib/eventData";
import {
  DEFAULT_EVENT_ID,
  SESSION_KEY,
  fetchGallery,
  galleryDownloadUrl,
} from "@/lib/api";
import { toast } from "sonner";

const COLUMNS_DESKTOP = 3;

const readSavedSession = (eventId) => {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return saved?.eventId === eventId ? saved.sessionId : null;
  } catch {
    return null;
  }
};

export default function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId = DEFAULT_EVENT_ID } = useParams();
  const savedSessionId = readSavedSession(eventId);
  const initialSessionId = location.state?.sessionId || savedSessionId;

  const [activeIndex, setActiveIndex] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareScope, setShareScope] = useState("gallery");
  const [shareTile, setShareTile] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["gallery", initialSessionId],
    queryFn: () => fetchGallery(initialSessionId),
    enabled: Boolean(initialSessionId),
    initialData:
      location.state?.photos && location.state?.event
        ? {
            session_id: location.state.sessionId,
            event: location.state.event,
            photos: location.state.photos,
          }
        : undefined,
    retry: false,
  });

  const { data: eventData, isPending: isEventPending, isError: isEventError, error: eventError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: !data?.event && !location.state?.event,
    retry: false,
  });

  const event = data?.event || location.state?.event || eventData || EVENT;
  const tiles = useMemo(
    () => (data?.photos?.length ? photosToTiles(data.photos) : []),
    [data?.photos],
  );

  const columns = useMemo(() => {
    const buckets = Array.from({ length: COLUMNS_DESKTOP }, () => []);
    tiles.forEach((tile, index) => {
      buckets[index % COLUMNS_DESKTOP].push({ tile, originalIndex: index });
    });
    return buckets;
  }, [tiles]);

  const isLoading = (Boolean(initialSessionId) && isPending) || (!data?.event && !location.state?.event && isEventPending);
  const isQueryError = isError || isEventError;
  const queryErrorMessage = (isError ? error?.message : eventError?.message) || "Could not retrieve the gallery or event data.";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-[#121212] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666] animate-pulse">
            SmilePlzzz
          </div>
          <h1 className="font-display text-4xl italic font-light mt-4 animate-pulse">
            Assembling gallery...
          </h1>
        </div>
      </div>
    );
  }

  if (isQueryError) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-[#121212] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#FF453A]">
            Connection Error
          </div>
          <h1 className="font-display text-5xl italic font-light mt-4 leading-tight">
            Gallery not found.
          </h1>
          <p className="font-ui text-sm text-[#666] mt-5 leading-relaxed">
            {queryErrorMessage}
          </p>
        </div>
      </div>
    );
  }

  const openShareGallery = () => {
    setShareScope("gallery");
    setShareTile(null);
    setShareOpen(true);
  };

  const openShareTile = (tile) => {
    setShareScope("tile");
    setShareTile(tile);
    setShareOpen(true);
  };

  const downloadAll = () => {
    if (!initialSessionId) {
      toast("Take a selfie first to create your private gallery archive.");
      navigate(`/event/${eventId}/capture`);
      return;
    }
    window.location.href = galleryDownloadUrl(initialSessionId);
  };

  const activeTile = activeIndex !== null ? tiles[activeIndex] : null;

  return (
    <div className="min-h-screen bg-[#F9F9F8]">
      <EditorialHeader
        event={event}
        right={
          <button
            data-testid="back-to-event-button"
            onClick={() => navigate(`/event/${eventId}`)}
            className="hidden sm:flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#666] hover:text-[#121212] transition-colors"
          >
            <ArrowLeft strokeWidth={1.4} className="w-4 h-4" />
            Event
          </button>
        }
      />

      <section className="px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-10 border-b border-[#E5E5E0]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 fade-up">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles strokeWidth={1.4} className="w-4 h-4 text-[#121212]" />
              <span className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                Face search / {tiles.length} frames found
              </span>
            </div>
            <h1
              data-testid="gallery-title"
              className="font-display text-5xl sm:text-7xl lg:text-8xl italic font-light leading-[0.95] text-[#121212]"
            >
              Your gallery,
              <br />
              <span className="not-italic font-light">quietly assembled.</span>
            </h1>
            <p className="font-ui text-base text-[#666] mt-6 max-w-xl">
              Every matching frame from <span className="text-[#121212]">{event.name}</span>,
              arranged for quick viewing, download, and sharing.
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="hairline mb-6" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                  Event
                </div>
                <div className="font-display italic text-xl text-[#121212] mt-1 leading-tight">
                  {event.name}
                </div>
              </div>
              <div>
                <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                  Date
                </div>
                <div className="font-display text-xl text-[#121212] mt-1 leading-tight">
                  {event.date}
                </div>
              </div>
              <div>
                <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                  Photographer
                </div>
                <div className="font-display italic text-xl text-[#121212] mt-1 leading-tight flex flex-col">
                  <span>{event.photographer}</span>
                  {event.photographerPhone && (
                    <span className="font-ui text-xs text-[#666] not-italic mt-1">
                      Phone: <a href={`tel:${event.photographerPhone}`} className="hover:underline text-[#121212]">{event.photographerPhone}</a>
                    </span>
                  )}
                  {event.photographerEmail && (
                    <span className="font-ui text-xs text-[#666] not-italic mt-0.5">
                      Email: <a href={`mailto:${event.photographerEmail}`} className="hover:underline text-[#121212]">{event.photographerEmail}</a>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                  Total captures
                </div>
                <div className="font-display text-xl text-[#121212] mt-1 leading-tight">
                  {event.totalCaptures.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 py-5 border-b border-[#E5E5E0] sticky top-0 bg-[#F9F9F8]/95 backdrop-blur z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-ui text-[11px] tracking-editorial uppercase text-[#121212]">
            {tiles.length} frames
          </span>
          <span className="text-[#E5E5E0]">/</span>
          <button
            data-testid="filter-button"
            onClick={() => toast("Filters coming next: solo / group / candid / portrait")}
            className="flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#666] hover:text-[#121212] transition-colors"
          >
            <ListFilter strokeWidth={1.4} className="w-4 h-4" />
            All frames
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-testid="favourite-all-button"
            onClick={() => toast("All frames saved to your favourites")}
            variant="ghost"
            className="rounded-none border border-[#E5E5E0] text-[#121212] hover:bg-[#EAEAE8] h-10 font-ui text-[11px] tracking-editorial uppercase"
          >
            <Heart strokeWidth={1.4} className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Favourite all</span>
            <span className="sm:hidden">Save</span>
          </Button>
          <Button
            data-testid="share-gallery-button"
            onClick={openShareGallery}
            variant="ghost"
            className="rounded-none border border-[#E5E5E0] text-[#121212] hover:bg-[#EAEAE8] h-10 font-ui text-[11px] tracking-editorial uppercase"
          >
            <Share2 strokeWidth={1.4} className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            data-testid="download-all-button"
            onClick={downloadAll}
            className="rounded-none bg-[#121212] text-white hover:bg-black h-10 font-ui text-[11px] tracking-editorial uppercase"
          >
            <Download strokeWidth={1.6} className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download all</span>
            <span className="sm:hidden">All</span>
          </Button>
        </div>
      </section>

      {!initialSessionId && (
        <section className="px-6 sm:px-10 lg:px-16 py-5 border-b border-[#E5E5E0] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-ui text-sm text-[#555]">
              Take a selfie to create a private matched gallery for this event.
            </div>
            <Button
              onClick={() => navigate(`/event/${eventId}/capture`)}
              className="rounded-none bg-[#121212] text-white hover:bg-black h-11 px-5 font-ui text-[11px] tracking-editorial uppercase"
            >
              Scan my face
            </Button>
          </div>
        </section>
      )}

      {initialSessionId && tiles.length === 0 && (
        <section className="px-6 sm:px-10 lg:px-16 py-12 border-b border-[#E5E5E0]">
          <div className="font-display italic text-3xl text-[#121212]">
            No matching photos found.
          </div>
          <p className="font-ui text-sm text-[#666] mt-3 max-w-md">
            Try another selfie with clearer lighting, or check back after the
            photographer uploads more event photos.
          </p>
        </section>
      )}

      {tiles.length > 0 && (
      <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div data-testid="gallery-grid-mobile" className="lg:hidden columns-2 gap-3 [column-fill:_balance]">
          {tiles.map((tile, index) => (
            <div key={tile.id} className="mb-3 break-inside-avoid">
              <PhotoTile tile={tile} index={index} onOpen={() => setActiveIndex(index)} />
            </div>
          ))}
        </div>

        <div data-testid="gallery-grid-desktop" className="hidden lg:grid grid-cols-3 gap-5">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-5">
              {column.map(({ tile, originalIndex }) => (
                <PhotoTile
                  key={tile.id}
                  tile={tile}
                  index={originalIndex}
                  onOpen={() => setActiveIndex(originalIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
      )}

      <section className="border-t border-[#E5E5E0] px-6 sm:px-10 lg:px-16 py-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
              Missing a frame?
            </div>
            <h3 className="font-display italic text-4xl text-[#121212] mt-3 leading-tight">
              Re-scan with a different selfie.
            </h3>
            <p className="font-ui text-sm text-[#666] mt-3 max-w-md">
              Lighting, angle, and expression can change a face signature. A
              fresh selfie can unlock frames the first scan missed.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button
              data-testid="rescan-button"
              onClick={() => navigate(`/event/${eventId}/capture`)}
              className="rounded-none bg-[#121212] text-white hover:bg-black h-14 px-7 font-ui text-[11px] tracking-editorial uppercase"
            >
              Re-scan my face
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E5E0] px-6 sm:px-10 lg:px-16 py-8 flex items-center justify-between text-[#666]">
        <span className="font-ui text-[10px] tracking-editorial uppercase">
          Photographed by {event.photographer} / {event.photographerHandle}
        </span>
        <span className="font-ui text-[10px] tracking-editorial uppercase">
          SmilePlzzz / {event.id}
        </span>
      </footer>

      {activeTile && (
        <Lightbox
          tile={activeTile}
          index={activeIndex}
          total={tiles.length}
          onClose={() => setActiveIndex(null)}
          onPrev={() => setActiveIndex((i) => (i - 1 + tiles.length) % tiles.length)}
          onNext={() => setActiveIndex((i) => (i + 1) % tiles.length)}
          onShare={openShareTile}
        />
      )}

      <ShareSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        scope={shareScope}
        tile={shareTile}
        eventId={eventId}
      />
    </div>
  );
}
