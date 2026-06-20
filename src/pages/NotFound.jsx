import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-ui text-[10px] tracking-editorial uppercase text-[#666]">
          404 · Off the contact sheet
        </div>
        <h1 className="font-display italic font-light text-6xl text-[#121212] mt-4 leading-none">
          Frame not found.
        </h1>
        <p className="font-ui text-sm text-[#666] mt-5">
          The page you&apos;re looking for hasn&apos;t been captured yet.
        </p>
        <Link
          data-testid="not-found-back"
          to="/"
          className="inline-flex items-center gap-2 mt-8 border border-[#121212] px-5 py-3 font-ui text-[11px] tracking-editorial uppercase text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
        >
          <ArrowLeft strokeWidth={1.4} className="w-4 h-4" />
          Back to event
        </Link>
      </div>
    </div>
  );
}
