import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ScanFace, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorialHeader from "@/components/EditorialHeader";
import { DEFAULT_EVENT_ID, fetchEvent } from "@/lib/api";
import { EVENT, displayNameParts } from "@/lib/eventData";

const COVER_URL =
  "https://images.unsplash.com/photo-1637325258040-d2f09636ecf6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYWJzdHJhY3QlMjB3aGl0ZSUyMHBhcGVyJTIwdGV4dHVyZXxlbnwwfHx8fDE3ODE4NTUwNTd8MA&ixlib=rb-4.1.0&q=85";

const Step = ({ n, label, sub }) => (
  <div className="flex items-start gap-4 sm:gap-5">
    <div className="font-display text-3xl sm:text-4xl leading-none text-[#121212]">
      {n}
    </div>
    <div className="flex-1">
      <div className="font-ui text-[11px] tracking-editorial uppercase text-[#121212]">
        {label}
      </div>
      <div className="font-ui text-sm text-[#666] mt-1 max-w-xs">{sub}</div>
    </div>
  </div>
);

export default function EventLanding() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const resolvedEventId = eventId || DEFAULT_EVENT_ID;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", resolvedEventId],
    queryFn: () => fetchEvent(resolvedEventId),
    enabled: Boolean(eventId),
    retry: false,
  });

  if (!eventId) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-[#121212] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
            SmilePlzzz
          </div>
          <h1 className="font-display text-5xl italic font-light mt-4">
            Scan your event QR.
          </h1>
          <p className="font-ui text-sm text-[#666] mt-5 leading-relaxed">
            Event galleries are private. Open the QR code shared by your
            photographer to continue.
          </p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-[#121212] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666] animate-pulse">
            SmilePlzzz
          </div>
          <h1 className="font-display text-4xl italic font-light mt-4 animate-pulse">
            Retrieving event...
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-[#121212] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#FF453A]">
            Connection Error
          </div>
          <h1 className="font-display text-5xl italic font-light mt-4 leading-tight">
            Event not found.
          </h1>
          <p className="font-ui text-sm text-[#666] mt-5 leading-relaxed">
            {error?.message || "Could not retrieve the event. Please ensure the link is correct and the server is online."}
          </p>
        </div>
      </div>
    );
  }

  const event = data;
  const [firstName, secondName] = displayNameParts(event.name);

  const capturePath = `/event/${event.id}/capture`;

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#121212]">
      <EditorialHeader
        event={event}
        right={
          <div className="hidden md:block font-ui text-[11px] tracking-editorial uppercase text-[#666]">
            Verified Event
          </div>
        }
      />

      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 px-6 sm:px-10 lg:px-16 pt-12 sm:pt-20 lg:pt-28 pb-10 lg:pb-24 fade-up">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
                The Event
              </span>
              <span className="w-10 h-px bg-[#121212]/30" />
              <span className="font-ui text-[10px] tracking-editorial uppercase text-[#121212]">
                {event.date}
              </span>
            </div>

            <h1
              data-testid="event-title"
              className="font-display text-[3.25rem] sm:text-7xl lg:text-[7.5rem] leading-[0.92] tracking-tight text-[#121212]"
            >
              <span className="italic font-light">{firstName}</span>
              {secondName && <span className="font-light"> x </span>}
              <span className="italic font-light">{secondName}</span>
            </h1>

            <p className="font-display text-2xl sm:text-3xl text-[#666] italic mt-6 max-w-2xl">
              {event.subtitle}
            </p>

            <div className="hairline w-32 my-10" />

            <p className="font-ui text-base sm:text-lg text-[#333] leading-relaxed max-w-xl">
              Take a single selfie. Face matching will find every frame you
              appear in and return a private gallery for this event only.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                data-testid="find-my-photos-button"
                onClick={() => navigate(capturePath)}
                className="group rounded-none bg-[#121212] hover:bg-black text-white h-14 px-7 font-ui text-[12px] tracking-editorial uppercase"
              >
                Find my photos
                <ArrowRight
                  strokeWidth={1.6}
                  className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1"
                />
              </Button>
              <div className="flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#666]">
                <ShieldCheck strokeWidth={1.4} className="w-4 h-4" />
                Your selfie is used only for matching
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[44vh] lg:min-h-[88vh] border-t lg:border-t-0 lg:border-l border-[#E5E5E0] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${COVER_URL})` }}
              aria-hidden
            />
            <div className="absolute inset-0 paper-grain" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F9F9F8]/30 via-transparent to-transparent" />

            <div
              className="hidden lg:block absolute top-10 right-10 font-ui text-[10px] tracking-editorial uppercase text-[#121212]/70"
              style={{ writingMode: "vertical-rl" }}
            >
              Personalized Event Gallery
            </div>

            <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10">
              <div className="hairline mb-4 bg-[#121212]/30" />
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="font-ui text-[10px] tracking-editorial uppercase text-[#121212]/65">
                    Location
                  </div>
                  <div className="font-display italic text-xl sm:text-2xl text-[#121212] mt-1 leading-tight">
                    {event.location}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-ui text-[10px] tracking-editorial uppercase text-[#121212]/65">
                    Captures
                  </div>
                  <div className="font-display text-2xl sm:text-3xl text-[#121212] mt-1 leading-none">
                    {event.totalCaptures.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E5E0] px-6 sm:px-10 lg:px-16 py-14 lg:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-10">
          <div>
            <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
              How it works
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-[#121212] italic font-light">
              Three quiet steps.
            </h2>
          </div>
          <div className="flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-[#666]">
            <Sparkles strokeWidth={1.4} className="w-4 h-4" />
            AI-powered event search
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          <Step n="01" label="Scan the QR" sub="Open this event page from the photographer's QR code." />
          <Step n="02" label="Submit a selfie" sub="Your face is converted into a searchable signature for this event." />
          <Step n="03" label="Open your gallery" sub="Only matching event photos are returned for download or sharing." />
        </div>
      </section>

      <section className="border-t border-[#E5E5E0] py-6 overflow-hidden">
        <div className="flex marquee-track whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-10 px-6">
              {["Weddings", "Concerts", "College Fests", "Marathons", "Corporate", "Birthdays", "Conferences", "Sports", "Cultural", "Galas"].map((t) => (
                <div key={`${dup}-${t}`} className="flex items-center gap-10 font-display italic text-2xl sm:text-3xl text-[#121212]/85">
                  <span>{t}</span>
                  <span className="text-[#121212]/30">/</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E5E5E0] px-6 sm:px-10 lg:px-16 py-14 lg:py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
              Photographer
            </div>
            <div className="font-display text-5xl sm:text-6xl italic font-light text-[#121212] mt-3 leading-none">
              {event.photographer}
            </div>
            <div className="font-ui text-sm text-[#666] mt-3 flex flex-col gap-1">
              <span>{event.photographerHandle} / Available for commissions worldwide</span>
              {(event.photographerPhone || event.photographerEmail) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#888]">
                  {event.photographerPhone && (
                    <span>
                      Phone: <a href={`tel:${event.photographerPhone}`} className="hover:underline text-[#121212]">{event.photographerPhone}</a>
                    </span>
                  )}
                  {event.photographerEmail && (
                    <span>
                      Email: <a href={`mailto:${event.photographerEmail}`} className="hover:underline text-[#121212]">{event.photographerEmail}</a>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="hairline mb-6" />
            <p className="font-ui text-sm text-[#333] leading-relaxed">
              Photos are indexed per event, so guests search only within the
              gallery connected to the QR code they scanned.
            </p>
          </div>
        </div>
      </section>

      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-[#F9F9F8]/95 backdrop-blur border-t border-[#E5E5E0] px-5 py-3 flex items-center gap-3 z-30">
        <ScanFace strokeWidth={1.4} className="w-5 h-5 text-[#121212]" />
        <div className="flex-1 font-ui text-[11px] tracking-editorial uppercase text-[#666]">
          Ready when you are
        </div>
        <Button
          data-testid="find-my-photos-sticky"
          onClick={() => navigate(capturePath)}
          className="rounded-none bg-[#121212] text-white h-10 px-4 font-ui text-[11px] tracking-editorial uppercase"
        >
          Begin
        </Button>
      </div>

      <footer className="border-t border-[#E5E5E0] px-6 sm:px-10 lg:px-16 py-8 flex items-center justify-between text-[#666]">
        <span className="font-ui text-[10px] tracking-editorial uppercase">
          SmilePlzzz / {event.id}
        </span>
        <span className="font-ui text-[10px] tracking-editorial uppercase">
          Copyright 2026 - All photographs belong to the artist
        </span>
      </footer>
    </div>
  );
}
