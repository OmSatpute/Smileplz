export const EVENT = {
  id: "AUR-JMS-26",
  name: "Aurelia x Jameson",
  subtitle: "A Spring Garden Wedding",
  date: "21 / 03 / 2026",
  location: "Villa di Marenco - Tuscany",
  photographer: "NI3 Photo Studio",
  photographerHandle: "@ni3photostudio",
  photographerPhone: "9371005661",
  photographerEmail: "nitinsatpute9@gmail.com",
  totalCaptures: 1248,
};

export const PLACEHOLDER_TILES = [
  { id: "f-001", h: 380, ratio: "3/4" },
  { id: "f-002", h: 260, ratio: "4/3" },
  { id: "f-003", h: 460, ratio: "2/3" },
  { id: "f-004", h: 300, ratio: "1/1" },
  { id: "f-005", h: 340, ratio: "4/5" },
  { id: "f-006", h: 240, ratio: "16/10" },
  { id: "f-007", h: 420, ratio: "3/4" },
  { id: "f-008", h: 280, ratio: "1/1" },
  { id: "f-009", h: 360, ratio: "4/5" },
  { id: "f-010", h: 320, ratio: "3/4" },
  { id: "f-011", h: 480, ratio: "2/3" },
  { id: "f-012", h: 260, ratio: "5/4" },
  { id: "f-013", h: 380, ratio: "3/4" },
  { id: "f-014", h: 300, ratio: "1/1" },
];

export const displayNameParts = (name) => {
  if (name.includes(" x ")) return name.split(" x ");
  if (name.includes(" × ")) return name.split(" × ");
  return [name, ""];
};

export const photosToTiles = (photos = []) =>
  photos.map((photo, index) => {
    const width = photo.width || 1200;
    const height = photo.height || 1600;
    const h = Math.max(240, Math.min(480, Math.round((height / width) * 300)));

    return {
      ...photo,
      h,
      ratio: photo.ratio || `${width}/${height}`,
      id: photo.id || `photo-${index + 1}`,
    };
  });
