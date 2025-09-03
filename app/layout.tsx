import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { categories as categoriesSchema, subcategories as subcategoriesSchema } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const metadata: Metadata = {
  title: "SOUTHERN FASHION & DÉCOR BD.",
  description: "Its a good shop",
  generator: 'v0.dev'
}

// This ensures that this layout is always dynamically rendered, fetching fresh data on each request.
// It's a good practice for layouts that display frequently changing data.
export const dynamic = 'force-dynamic'

async function getCategories() {
  // This function runs on the server.
  const sqlite = new Database('./prisma/dev.db', { readonly: true });
  const db = drizzle(sqlite);
  try {
    const mainCategories = await db.select().from(categoriesSchema).where(eq(categoriesSchema.isActive, true));

    const categoriesWithSubcategories = await Promise.all(
      mainCategories.map(async (category) => {
        const subcategories = await db.select().from(subcategoriesSchema).where(eq(subcategoriesSchema.categoryId, category.id));
        return {
          ...category,
          subcategories,
        };
      })
    );
    sqlite.close();
    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Failed to fetch categories for layout:", error);
    sqlite.close();
    return []; // Return empty array on error
  }
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch data on the server.
  const categories = await getCategories();

  return (
    <html lang="en">
      <head>
        <title>SOUTHERN FASHION & DÉCOR BD.</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preload" href="/fonts/Brandon_reg.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="font-brandon antialiased">
        {/* Pass the server-fetched data to the client component wrapper. */}
        <LayoutWrapper categories={categories}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
