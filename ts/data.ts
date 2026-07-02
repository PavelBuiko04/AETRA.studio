export interface ProjectPlaceholder {
  id: number;
  name: string;
  tags: string;
  type: "image" | "video";
  aspect: string;
}

export const CONTACT_EMAIL = "hello@aetra.studio";
export const LINKEDIN_URL = "https://linkedin.com/company/aetra-studio";
export const CONTACT_WHATSAPP_URL = "https://wa.me/31612345678";

export const GOOGLE_SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxeQdFIGgYRfa11woWxcvUF8iY8zhFkxONcVlaVwaS8wzhBIWlKf6YpB4BjAg5HZOVy/exec";

/** Native dimensions — used for aspect-ratio matching in CSS */
export const MEDIA = {
  landscape: { w: 1024, h: 585, ratio: "1024 / 585" },
  portrait: { w: 700, h: 1024, ratio: "700 / 1024" },
  portraitBriz: { w: 572, h: 1024, ratio: "572 / 1024" },
  portraitVideo: { w: 716, h: 1284, ratio: "716 / 1284" },
  editorial: { w: 1024, h: 748, ratio: "1024 / 748" },
} as const;

export const projects: ProjectPlaceholder[] = [
  { id: 1, name: "LA VITA", tags: "short film · italy", type: "image", aspect: "landscape" },
  { id: 2, name: "VIVIENNE WESTWOOD", tags: "fashion · campaign", type: "image", aspect: "portrait" },
  { id: 3, name: "RITUALS", tags: "brand film · caustics", type: "video", aspect: "portraitVideo" },
  { id: 5, name: "AMALFI", tags: "cinema · travel", type: "image", aspect: "landscape" },
  { id: 6, name: "RITUALS", tags: "brand film · hdri", type: "video", aspect: "portraitVideo" },
  { id: 7, name: "BRIZ", tags: "fashion · e-commerce", type: "image", aspect: "portraitBriz" },
];

export const marqueeItems = [
  "Fashion",
  "Hospitality",
  "Beauty",
  "Travel",
  "Retail",
  "Lifestyle",
];
