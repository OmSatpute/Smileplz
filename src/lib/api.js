const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const API_PREFIX = `${API_BASE.replace(/\/$/, "")}/api`;

export const DEFAULT_EVENT_ID = "AUR-JMS-26";
export const SESSION_KEY = "smileplzzz.gallerySession";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_PREFIX}${path}`, options);
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.detail || "Request failed");
  }
  return response.json();
};

export const resolveAssetUrl = (url) => {
  if (!url || url.startsWith("http")) return url;
  return `${API_BASE.replace(/\/$/, "")}${url}`;
};

export const fetchEvent = (eventId = DEFAULT_EVENT_ID) =>
  request(`/events/${eventId}`);

export const searchFace = (eventId, selfieDataUrl) => {
  const body = new FormData();
  body.append("selfie_data_url", selfieDataUrl);

  return request(`/events/${eventId}/face-search`, {
    method: "POST",
    body,
  });
};

export const fetchGallery = (sessionId) =>
  request(`/sessions/${sessionId}/gallery`);

export const galleryDownloadUrl = (sessionId) =>
  `${API_PREFIX}/sessions/${sessionId}/download`;
