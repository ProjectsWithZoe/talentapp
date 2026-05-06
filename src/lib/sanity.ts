import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export interface PostMeta {
  title: string;
  description: string;
  publishedAt: string;
  slug: string;
  keywords?: string[];
}

export interface Post extends PostMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}

export async function getAllPosts(): Promise<PostMeta[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      description,
      publishedAt,
      "slug": slug.current,
      keywords
    }`
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      title,
      description,
      publishedAt,
      "slug": slug.current,
      keywords,
      body
    }`,
    { slug }
  );
}
