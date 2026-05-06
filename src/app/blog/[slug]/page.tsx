import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/sanity";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-bold tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-primary underline underline-offset-4 hover:opacity-80" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "TalentApp",
      url: "https://TalentApp.co.uk",
    },
  };

  return (
    <article className="container mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 gap-1.5 text-muted-foreground">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <time className="mt-3 block text-sm text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </time>
        <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
      </header>

      <div className="prose prose-slate max-w-none">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6 text-center">
        <p className="font-semibold mb-2">Check your own resume against any job</p>
        <p className="text-sm text-muted-foreground mb-4">Free analysis — takes 30 seconds.</p>
        <Button asChild>
          <Link href="/analyze">Analyse my resume free</Link>
        </Button>
      </div>
    </article>
  );
}
