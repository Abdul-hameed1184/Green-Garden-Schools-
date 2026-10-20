import "server-only";
import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/server/db";
import { HttpError } from "@/lib/server/http";
import { newId } from "@/lib/server/ids";
import { hashPassword } from "@/lib/server/password";

/**
 * Creates an admin. When `requireNoAdmins` is set (first-run bootstrap), the
 * count check and insert run serializably so two racing signups can't both win.
 */
export async function createAdmin(username: string, keyphrase: string, requireNoAdmins: boolean) {
  const passwordHash = await hashPassword(keyphrase);
  try {
    return await db.$transaction(
      async (tx) => {
        if (requireNoAdmins && (await tx.admin.count()) > 0) {
          throw new HttpError(401, "Unauthorized.");
        }
        return tx.admin.create({
          data: { id: newId("adm"), username, passwordHash },
          select: { id: true, username: true },
        });
      },
      { isolationLevel: "Serializable" }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") throw new HttpError(409, "That username is already taken.");
      // Serialization failure: a concurrent bootstrap signup got there first.
      if (err.code === "P2034") throw new HttpError(401, "Unauthorized.");
    }
    throw err;
  }
}

export async function hasAnyAdmin() {
  return (await db.admin.findFirst({ select: { id: true } })) !== null;
}
