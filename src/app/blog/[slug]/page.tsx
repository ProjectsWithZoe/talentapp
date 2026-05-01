import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/mdx";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "hirecheck",
      url: "https://hirecheck.io",
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
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </time>
        <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
      </header>

      <div className="prose prose-slate max-w-none">
        <MDXRemote source={post.content} />
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
