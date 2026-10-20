import type { SessionUser } from "@/lib/types";

export async function fetchSession(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/session");
  if (!res.ok) return null;
  const data = await res.json();
  return data.session as SessionUser | null;
}

export async function login(username: string, keyphrase: string): Promise<SessionUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, keyphrase }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Login failed.");
  }
  return res.json();
}

/** Creates an admin account (admin-only once the first admin exists). */
export async function signup(username: string, keyphrase: string): Promise<SessionUser> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, keyphrase }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Sign up failed.");
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
