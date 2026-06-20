import { Aperture, Image as ImageIcon } from "lucide-react";
import { resolveAssetUrl } from "@/lib/api";

export const PhotoTile = ({ tile, index, onOpen }) => {
  const useAperture = index % 3 === 0;
  const Icon = useAperture ? Aperture : ImageIcon;
  const previewUrl = resolveAssetUrl(tile.preview_url);

  return (
    <button
      type="button"
      data-testid={`photo-tile-${tile.id}`}
      onClick={() => onOpen(tile)}
      style={{ height: `${tile.h}px`, animationDelay: `${index * 40}ms` }}
      className="tile-rise group relative w-full overflow-hidden border border-[#E5E5E0] bg-[#EAEAE8] hover:border-black transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-black"
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`Matched event frame ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <div className="absolute inset-0 paper-grain opacity-90" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 14px)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              strokeWidth={1.2}
              className="w-8 h-8 text-black/25 group-hover:text-black/55 transition-colors duration-500"
            />
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-3 left-3 font-ui text-[10px] tracking-editorial uppercase text-black/45 group-hover:text-black/75 transition-colors bg-white/55 px-2 py-1">
        No. {String(index + 1).padStart(3, "0")}
      </div>

      <div className="absolute bottom-3 right-3 font-ui text-[10px] tracking-editorial uppercase text-black/40 group-hover:text-black/70 transition-colors bg-white/55 px-2 py-1">
        {tile.ratio}
      </div>

      <div className="absolute inset-2 border border-black/0 group-hover:border-black/15 transition-colors duration-500" />
    </button>
  );
};

export default PhotoTile;
