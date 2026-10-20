// Idempotent seed: inserts the sample content and upserts the admin account.
// Existing rows are left alone, so re-running never overwrites admin edits.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import albumsSeed from "../data/albums.seed.json";
import faqsSeed from "../data/faqs.seed.json";
import settingsSeed from "../data/settings.seed.json";
import { Prisma, PrismaClient } from "../lib/generated/prisma/client";
import { newId } from "../lib/server/ids";
import { hashPassword } from "../lib/server/password";
import type { AlbumItem, FaqItem, SiteSettings } from "../lib/types";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const albums = albumsSeed as AlbumItem[];
  const { count: albumCount } = await db.album.createMany({
    data: albums.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      status: a.status,
      createdAt: new Date(a.createdAt),
      eventDate: new Date(`${a.eventDate ?? a.createdAt.slice(0, 10)}T00:00:00.000Z`),
      location: a.location ?? "",
      description: a.description ?? "",
      coverSrc: a.coverSrc ?? null,
      highlights: (a.highlights ?? []) as unknown as Prisma.InputJsonValue,
      photos: (a.photos ?? []) as unknown as Prisma.InputJsonValue,
    })),
    skipDuplicates: true,
  });

  const faqs = faqsSeed as FaqItem[];
  const { count: faqCount } = await db.faq.createMany({
    data: faqs.map((f, position) => ({ ...f, position })),
    skipDuplicates: true,
  });

  const settings = settingsSeed as SiteSettings;
  await db.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...settings }, update: {} });

  console.log(`Seeded ${albumCount} albums, ${faqCount} FAQs, site settings.`);

  const username = process.env.ADMIN_USERNAME?.trim();
  const keyphrase = process.env.ADMIN_KEYPHRASE;
  if (!username || !keyphrase) {
    console.warn("ADMIN_USERNAME / ADMIN_KEYPHRASE not set: skipped creating the admin account.");
    return;
  }
  if (keyphrase.length < 12) throw new Error("ADMIN_KEYPHRASE must be at least 12 characters.");

  const passwordHash = await hashPassword(keyphrase);
  await db.admin.upsert({
    where: { username },
    create: { id: newId("adm"), username, passwordHash },
    update: { passwordHash },
  });
  console.log(`Admin "${username}" is ready.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
