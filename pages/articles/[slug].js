import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export default function Article({ post, relatedArticles, previousArticle, nextArticle }) {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              ← Back to Articles
            </Button>
          </Link>
        </div>

        {/* Article */}
        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {post.date && <span>{post.date}</span>}
              {post.author && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>

            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
              {post.imageCaption && (
                <p className="text-center text-sm text-muted-foreground mt-2 italic">
                  {post.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="article-content max-w-none">
            <MDXRemote {...post.content} />
          </div>
        </article>

        {/* Previous/Next Navigation */}
        {(previousArticle || nextArticle) && (
          <div className="mt-16 pt-8 border-t">
            <div className="flex justify-between gap-2 md:gap-4">
              <div className="flex-1 min-w-0">
                {previousArticle && (
                  <Link href={`/articles/${previousArticle.slug}`}>
                    <Button variant="ghost" className="w-full p-2 md:p-4 h-auto flex flex-col items-start text-left hover:bg-muted/50">
                      <span className="text-xs md:text-sm text-muted-foreground mb-1">← Previous</span>
                      <span className="text-sm md:text-base font-medium italic md:not-italic truncate w-full">{previousArticle.title}</span>
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {nextArticle && (
                  <Link href={`/articles/${nextArticle.slug}`}>
                    <Button variant="ghost" className="w-full p-2 md:p-4 h-auto flex flex-col items-end text-right hover:bg-muted/50">
                      <span className="text-xs md:text-sm text-muted-foreground mb-1">Next →</span>
                      <span className="text-sm md:text-base font-medium italic md:not-italic truncate w-full">{nextArticle.title}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {article.title}
                      </CardTitle>
                      <CardDescription>
                        {article.sharedKeywords} shared topic{article.sharedKeywords !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const paths = filenames.map((name) => ({
    params: {
      slug: name.replace('.mdx', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filePath = path.join(postsDirectory, `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')

  const { data, content } = matter(fileContents)
  const mdxSource = await serialize(content)

  // Find related articles
  const allFiles = fs.readdirSync(postsDirectory)
  const relatedArticles = []

  for (const filename of allFiles) {
    if (filename === `${params.slug}.mdx`) continue

    const otherFilePath = path.join(postsDirectory, filename)
    const otherFileContents = fs.readFileSync(otherFilePath, 'utf8')
    const { data: otherData } = matter(otherFileContents)

    const sharedKeywords = data.keywords?.filter(keyword =>
      otherData.keywords?.includes(keyword)
    ) || []

    if (sharedKeywords.length > 0) {
      relatedArticles.push({
        slug: filename.replace('.mdx', ''),
        title: otherData.title,
        sharedKeywords: sharedKeywords.length,
      })
    }
  }

  relatedArticles.sort((a, b) => b.sharedKeywords - a.sharedKeywords)

  // Get all articles for previous/next navigation
  const allArticles = []
  for (const filename of allFiles) {
    const articlePath = path.join(postsDirectory, filename)
    const articleContents = fs.readFileSync(articlePath, 'utf8')
    const { data: articleData } = matter(articleContents)
    
    allArticles.push({
      slug: filename.replace('.mdx', ''),
      title: articleData.title,
      date: articleData.date
    })
  }

  // Sort by date
  allArticles.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // Find current article index
  const currentIndex = allArticles.findIndex(article => article.slug === params.slug)
  const previousArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  return {
    props: {
      post: {
        title: data.title || '',
        date: data.date || '',
        author: data.author || null,
        readTime: data.readTime || null,
        keywords: data.keywords || [],
        image: data.image || null,
        imageCaption: data.imageCaption || null,
        content: mdxSource,
      },
      relatedArticles: relatedArticles.slice(0, 4),
      previousArticle,
      nextArticle,
    },
  }
}