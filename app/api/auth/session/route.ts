import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handler } from "@/lib/server/http";

export const GET = handler(async () => {
  const session = await getSession();
  return NextResponse.json({ session });
});
