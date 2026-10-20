export type AlbumCategory = "Faith" | "Campus" | "Academics" | "Sports" | "Arts";

export const ALBUM_CATEGORIES: AlbumCategory[] = ["Faith", "Campus", "Academics", "Sports", "Arts"];

export type AlbumStatus = "Published" | "Review" | "Archived";

export interface AlbumPhoto {
  id: string;
  /** Image URL or data URL; null renders a placeholder. */
  src: string | null;
  caption: string;
}

/** A short key fact shown on the event page, e.g. { value: "300+", label: "Guests" }. */
export interface AlbumHighlight {
  value: string;
  label: string;
}

/** An album entry is an event: a cover, a story, key facts and a gallery of photos. */
export interface AlbumItem {
  id: string;
  title: string;
  category: AlbumCategory;
  status: AlbumStatus;
  createdAt: string;
  /** ISO date (yyyy-mm-dd) the event took place. */
  eventDate: string;
  location: string;
  description: string;
  coverSrc: string | null;
  highlights: AlbumHighlight[];
  photos: AlbumPhoto[];
}

/** Fields an admin can set when creating or editing an event. */
export type AlbumInput = Pick<
  AlbumItem,
  "title" | "category" | "eventDate" | "location" | "description" | "coverSrc" | "highlights"
> & { photos: Array<Omit<AlbumPhoto, "id"> & { id?: string }> };

export interface JourneyMilestone {
  year: string;
  title?: string;
  description: string;
}

export interface AdmissionsStep {
  step: number;
  title: string;
  description: string;
}

/** Inbox workflow state shared by inquiries and contact messages. */
export type InboxStatus = "new" | "read" | "handled";

export const INBOX_STATUSES: InboxStatus[] = ["new", "read", "handled"];

export interface AdmissionsInquiry {
  id: string;
  /** Parent / guardian name. */
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  message: string;
  status: InboxStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InboxStatus;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Contact details shown on the Contact page and in the footer. */
export interface SiteSettings {
  phonePrimary: string;
  phoneSecondary: string;
  emailGeneral: string;
  emailAdmissions: string;
  addressLine1: string;
  addressLine2: string;
  officeHours: string;
  /** Link used by "Get directions" (e.g. a Google Maps URL). */
  mapUrl: string;
  socials: {
    instagram: string;
    facebook: string;
    x: string;
    linkedin: string;
  };
}

export interface SessionUser {
  username: string;
}
