export const albumKeys = {
  all: ["albums"] as const,
  lists: ["albums", "list"] as const,
  list: (category?: string) => ["albums", "list", category ?? "all"] as const,
  detail: (id: string) => ["albums", "detail", id] as const,
};

export const authKeys = {
  session: ["auth", "session"] as const,
};

export const inboxKeys = {
  all: ["admin", "inbox"] as const,
  inquiries: ["admin", "inbox", "inquiries"] as const,
  messages: ["admin", "inbox", "messages"] as const,
};

export const faqKeys = {
  all: ["faqs"] as const,
};

export const settingsKeys = {
  all: ["settings"] as const,
};
