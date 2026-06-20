import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ScanFace,
  Camera,
  RefreshCw,
  Check,
  AlertTriangle,
  Aperture,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_EVENT_ID, fetchEvent, searchFace, SESSION_KEY } from "@/lib/api";
import { EVENT } from "@/lib/eventData";

const PHASES = {
  REQUESTING: "REQUESTING",
  LIVE: "LIVE",
  CAPTURED: "CAPTURED",
  SCANNING: "SCANNING",
  DENIED: "DENIED",
};

const SCAN_STEPS = [
  "Encoding selfie / creating face embedding",
  "Searching the event index",
  "Cross-referencing facial signature",
  "Curating your private gallery",
];

export default function CameraCapture() {
  const navigate = useNavigate();
  const { eventId = DEFAULT_EVENT_ID } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState(PHASES.REQUESTING);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [error, setError] = useState("");
  const [shutterFlash, setShutterFlash] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const { data: event, isPending, isError, error: queryError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
    retry: false,
  });

  const eventPath = `/event/${eventId}`;
  const galleryPath = `/event/${eventId}/gallery`;

  const startCamera = async () => {
    setError("");
    setPhase(PHASES.REQUESTING);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase(PHASES.LIVE);
    } catch (e) {
      setError(
        e?.name === "NotAllowedError"
          ? "Camera permission was declined. Enable it from your browser settings to continue."
          : "We could not access a front camera on this device.",
      );
      setPhase(PHASES.DENIED);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capture = () => {
    if (!videoRef.current) return;
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 320);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    const width = video.videoWidth || 720;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    setCapturedUrl(canvas.toDataURL("image/jpeg", 0.92));
    setPhase(PHASES.CAPTURED);
    stopCamera();
  };

  const retake = () => {
    setCapturedUrl(null);
    startCamera();
  };

  const confirm = async () => {
    if (!capturedUrl) return;
    setPhase(PHASES.SCANNING);
    setScanStep(0);
    setError("");

    try {
      const result = await searchFace(eventId, capturedUrl);
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          eventId,
          sessionId: result.session_id,
          savedAt: Date.now(),
        }),
      );
      navigate(galleryPath, {
        state: {
          sessionId: result.session_id,
          event: result.event,
          photos: result.photos,
        },
      });
    } catch (e) {
      setError(e.message || "We could not match this selfie. Please try again.");
      setPhase(PHASES.CAPTURED);
    }
  };

  useEffect(() => {
    if (phase !== PHASES.SCANNING) return undefined;
    const timer = setInterval(() => {
      setScanStep((step) => Math.min(step + 1, SCAN_STEPS.length - 1));
    }, 700);
    return () => clearInterval(timer);
  }, [phase]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-white/55 animate-pulse">
            SmilePlzzz
          </div>
          <h1 className="font-display text-4xl italic font-light mt-4 animate-pulse">
            Initializing camera context...
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-ui text-[10px] tracking-editorial uppercase text-[#FF453A]">
            Connection Error
          </div>
          <h1 className="font-display text-5xl italic font-light mt-4 leading-tight">
            Event not found.
          </h1>
          <p className="font-ui text-sm text-white/55 mt-5 leading-relaxed">
            {queryError?.message || "Could not retrieve the event details. Please verify the URL or ensure the server is online."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-white/10">
        <button
          data-testid="camera-back-button"
          onClick={() => {
            stopCamera();
            navigate(eventPath);
          }}
          className="flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft strokeWidth={1.4} className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2 font-ui text-[11px] tracking-editorial uppercase text-white/70">
          <ScanFace strokeWidth={1.4} className="w-4 h-4" />
          Selfie / {event.name}
        </div>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-[460px]">
          <div className="text-center mb-6 fade-in">
            <div className="font-ui text-[10px] tracking-editorial uppercase text-white/55">
              Step 01 / 02
            </div>
            <h1 className="font-display text-3xl sm:text-4xl italic font-light mt-2">
              {phase === PHASES.CAPTURED
                ? "Looks good?"
                : phase === PHASES.SCANNING
                  ? "Curating your gallery"
                  : "Hold the frame"}
            </h1>
            <p className="font-ui text-sm text-white/55 mt-2 max-w-sm mx-auto">
              {phase === PHASES.CAPTURED
                ? "We will use this only to search this event's photo index."
                : phase === PHASES.SCANNING
                  ? "Matching is in progress. This usually takes a few seconds."
                  : "Centre your face inside the circle. Soft, even light works best."}
            </p>
          </div>

          <div className="relative aspect-square w-full bg-black border border-white/15 overflow-hidden">
            {(phase === PHASES.LIVE || phase === PHASES.REQUESTING) && (
              <video
                ref={videoRef}
                data-testid="camera-video"
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            {(phase === PHASES.CAPTURED || phase === PHASES.SCANNING) &&
              capturedUrl && (
                <img
                  src={capturedUrl}
                  alt="Your selfie"
                  data-testid="captured-preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

            {phase === PHASES.REQUESTING && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center">
                  <Camera strokeWidth={1.2} className="w-8 h-8 text-white/70 mx-auto pulse-soft" />
                  <div className="font-ui text-[11px] tracking-editorial uppercase text-white/65 mt-3">
                    Requesting camera...
                  </div>
                </div>
              </div>
            )}

            {phase === PHASES.DENIED && (
              <div className="absolute inset-0 flex items-center justify-center px-6 bg-black">
                <div className="text-center max-w-xs">
                  <AlertTriangle strokeWidth={1.3} className="w-7 h-7 text-white/80 mx-auto" />
                  <div className="font-display italic text-2xl mt-3">Camera blocked</div>
                  <p className="font-ui text-xs text-white/55 mt-2 leading-relaxed">
                    {error}
                  </p>
                  <Button
                    data-testid="camera-retry-button"
                    onClick={startCamera}
                    className="mt-5 rounded-none bg-white text-black hover:bg-white/90 h-11 px-5 font-ui text-[11px] tracking-editorial uppercase"
                  >
                    <RefreshCw strokeWidth={1.5} className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {phase === PHASES.LIVE && (
              <>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-[68%] aspect-square rounded-full border border-white/40">
                    <span className="absolute -top-px left-1/2 -translate-x-1/2 w-3 h-3 border-t border-l border-white" />
                    <span className="absolute -top-px right-0 w-3 h-3 border-t border-r border-white" />
                    <span className="absolute -bottom-px left-0 w-3 h-3 border-b border-l border-white" />
                    <span className="absolute -bottom-px right-0 w-3 h-3 border-b border-r border-white" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 font-ui text-[10px] tracking-editorial uppercase text-white/70">
                  LIVE
                </div>
                <div className="absolute bottom-3 right-3 font-ui text-[10px] tracking-editorial uppercase text-white/55">
                  Front camera
                </div>
              </>
            )}

            {phase === PHASES.SCANNING && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/35" />
                <div className="scan-line" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[68%] aspect-square rounded-full border border-white/35 flex items-center justify-center">
                    <Aperture strokeWidth={1.1} className="w-8 h-8 text-white/85 pulse-soft" />
                  </div>
                </div>
              </div>
            )}

            {shutterFlash && <div className="absolute inset-0 shutter pointer-events-none" />}
          </div>

          {error && phase === PHASES.CAPTURED && (
            <div className="mt-4 border border-red-400/30 bg-red-950/30 px-4 py-3 font-ui text-xs text-red-100">
              {error}
            </div>
          )}

          <div className="mt-8">
            {phase === PHASES.LIVE && (
              <div className="flex flex-col items-center gap-4">
                <button
                  data-testid="capture-photo-button"
                  onClick={capture}
                  className="group relative w-20 h-20 rounded-full border border-white/60 flex items-center justify-center hover:border-white transition-colors"
                  aria-label="Capture selfie"
                >
                  <span className="absolute inset-2 rounded-full bg-white group-hover:scale-95 transition-transform duration-200" />
                </button>
                <div className="font-ui text-[10px] tracking-editorial uppercase text-white/45">
                  Tap to capture
                </div>
              </div>
            )}

            {phase === PHASES.CAPTURED && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-testid="retake-button"
                  onClick={retake}
                  variant="ghost"
                  className="rounded-none border border-white/25 text-white hover:bg-white/10 hover:text-white h-14 font-ui text-[11px] tracking-editorial uppercase"
                >
                  <RefreshCw strokeWidth={1.4} className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  data-testid="confirm-photo-button"
                  onClick={confirm}
                  className="rounded-none bg-white text-black hover:bg-white/90 h-14 font-ui text-[11px] tracking-editorial uppercase"
                >
                  <Check strokeWidth={1.6} className="w-4 h-4 mr-2" />
                  Find my photos
                </Button>
              </div>
            )}

            {phase === PHASES.SCANNING && (
              <div data-testid="scanning-status" className="space-y-2.5 pt-2">
                {SCAN_STEPS.map((label, index) => {
                  const state =
                    index < scanStep ? "done" : index === scanStep ? "active" : "idle";
                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-3 font-ui text-[11px] tracking-editorial uppercase transition-opacity duration-500 ${
                        state === "idle"
                          ? "opacity-30"
                          : state === "active"
                            ? "opacity-100"
                            : "opacity-65"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          state === "done"
                            ? "bg-white"
                            : state === "active"
                              ? "bg-white pulse-soft"
                              : "bg-white/40"
                        }`}
                      />
                      <span className="flex-1">{label}</span>
                      {state === "done" && (
                        <Check strokeWidth={1.6} className="w-3.5 h-3.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-white/10 text-center">
        <span className="font-ui text-[10px] tracking-editorial uppercase text-white/40">
          Selfies are processed for this event search only.
        </span>
      </footer>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
