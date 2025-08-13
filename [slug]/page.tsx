import { notFound, redirect } from 'next/navigation'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { footerPages, categories } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const sqlite = new Database('./prisma/dev.db')
const db = drizzle(sqlite)

interface PageProps {
  params: {
    slug: string
  }
}

async function getFooterPage(slug: string) {
  try {
    const pages = await db
      .select()
      .from(footerPages)
      .where(
        and(
          eq(footerPages.slug, slug),
          eq(footerPages.isActive, true)
        )
      )
      .limit(1)

    return pages[0] || null
  } catch (error) {
    console.error('Error fetching footer page:', error)
    return null
  }
}

// Check if slug might be a category or other content type
async function getOtherContent(slug: string) {
  try {
    // Check if it's a category slug
    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    if (categoryResult[0]) {
      return { type: 'category', data: categoryResult[0] }
    }

    // Add other content type checks here if needed
    return null
  } catch (error) {
    console.error('Error checking other content:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps) {
  // First check for footer pages
  const footerPage = await getFooterPage(params.slug)

  if (footerPage) {
    return {
      title: footerPage.metaTitle || footerPage.title,
      description: footerPage.metaDescription || `Learn more about ${footerPage.title} at Alauddin's Super Shop`,
    }
  }

  // If not a footer page, check other content types
  const otherContent = await getOtherContent(params.slug)
  if (otherContent?.type === 'category') {
    return {
      title: `${otherContent.data.name} | Baby Products | Alauddin's Super Shop`,
      description: otherContent.data.description || `Shop ${otherContent.data.name} baby products at Alauddin's Super Shop`,
    }
  }

  return {
    title: 'Page Not Found | Alauddin\'s Super Shop',
    description: 'The page you are looking for could not be found.',
  }
}

export default async function SlugPage({ params }: PageProps) {
  // First try to find a footer page
  const footerPage = await getFooterPage(params.slug)

  if (footerPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: footerPage.content }}
          />
        </div>
      </div>
    )
  }

  // If not a footer page, check for other content types
  const otherContent = await getOtherContent(params.slug)

  if (otherContent?.type === 'category') {
    // Redirect to the proper category page
    redirect(`/category/${params.slug}`)
  }

  // If nothing found, show 404
  notFound()
}
