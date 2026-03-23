import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  reading_time_minutes: number;
  slug: string;
}

export async function aggregateExternalPosts(): Promise<{
  devto: number;
  hashnode: number;
}> {
  let devtoCount = 0;
  let hashnodeCount = 0;

  // Dev.to aggregation
  try {
    const res = await fetch(
      "https://dev.to/api/articles?username=creatman&per_page=50",
      { signal: AbortSignal.timeout(15000) }
    );

    if (res.ok) {
      const articles: DevToArticle[] = await res.json();

      for (const article of articles) {
        const externalId = `devto-${article.id}`;
        const existing = db
          .select()
          .from(blogPosts)
          .where(
            and(
              eq(blogPosts.externalId, externalId),
              eq(blogPosts.source, "devto")
            )
          )
          .get();

        if (existing) {
          db.update(blogPosts)
            .set({
              titleEn: article.title,
              excerpt: article.description,
              coverImage: article.cover_image,
              externalUrl: article.url,
              publishedAt: article.published_at,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(blogPosts.id, existing.id))
            .run();
        } else {
          db.insert(blogPosts)
            .values({
              slug: `devto-${article.slug}`,
              titleEn: article.title,
              titleRu: "",
              contentMd: "",
              excerpt: article.description,
              coverImage: article.cover_image,
              source: "devto",
              externalUrl: article.url,
              externalId,
              published: true,
              publishedAt: article.published_at,
            })
            .run();
          devtoCount++;
        }
      }
    }
  } catch (error) {
    console.error("[Blog Aggregator] Dev.to fetch failed:", error);
  }

  // Hashnode aggregation (graceful fail if unavailable)
  try {
    const query = `{
      user(username: "creatman") {
        publications(first: 1) {
          edges {
            node {
              posts(first: 50) {
                edges {
                  node {
                    id
                    title
                    brief
                    slug
                    url
                    coverImage { url }
                    publishedAt
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data = await res.json();
      const posts =
        data?.data?.user?.publications?.edges?.[0]?.node?.posts?.edges || [];

      for (const {
        node: post,
      } of posts as {
        node: {
          id: string;
          title: string;
          brief: string;
          slug: string;
          url: string;
          coverImage: { url: string } | null;
          publishedAt: string;
        };
      }[]) {
        const externalId = `hashnode-${post.id}`;
        const existing = db
          .select()
          .from(blogPosts)
          .where(
            and(
              eq(blogPosts.externalId, externalId),
              eq(blogPosts.source, "hashnode")
            )
          )
          .get();

        if (!existing) {
          db.insert(blogPosts)
            .values({
              slug: `hashnode-${post.slug}`,
              titleEn: post.title,
              titleRu: "",
              contentMd: "",
              excerpt: post.brief || "",
              coverImage: post.coverImage?.url || null,
              source: "hashnode",
              externalUrl: post.url,
              externalId,
              published: true,
              publishedAt: post.publishedAt,
            })
            .run();
          hashnodeCount++;
        }
      }
    }
  } catch (error) {
    console.error(
      "[Blog Aggregator] Hashnode fetch failed (expected if no account):",
      error
    );
  }

  return { devto: devtoCount, hashnode: hashnodeCount };
}
