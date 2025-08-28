import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to my research blog where I share insights and findings.
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Welcome to my research blog where I share insights, findings, and explorations
            in various fields of study. This platform serves as a digital repository
            of my academic journey and professional research endeavors.
          </p>
          <p>
            I believe in making complex research accessible to broader audiences while
            maintaining scientific rigor. Through this blog, I aim to bridge the gap
            between academic research and practical applications.
          </p>
          <p>
            My work spans multiple disciplines, and I'm passionate about interdisciplinary
            approaches to solving real-world problems. Each article represents a deep
            dive into topics that matter for our future.
          </p>
        </div>
      </div>
    </Layout>
  )
}