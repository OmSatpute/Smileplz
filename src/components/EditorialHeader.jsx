import { EVENT } from "@/lib/eventData";

export const EditorialHeader = ({ variant = "light", right, event = EVENT }) => {
  const isDark = variant === "dark";

  return (
    <header
      data-testid="editorial-header"
      className={`w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b ${
        isDark
          ? "border-white/10 text-white/85"
          : "border-[#E5E5E0] text-[#121212]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            isDark ? "bg-white" : "bg-black"
          }`}
          aria-hidden
        />
        <span className="font-ui text-[11px] tracking-editorial uppercase">
          SmilePlzzz / Event Photography
        </span>
      </div>
      <div className="hidden sm:block font-ui text-[11px] tracking-editorial uppercase opacity-70">
        {event.id}
      </div>
      <div>{right}</div>
    </header>
  );
};

export default EditorialHeader;
