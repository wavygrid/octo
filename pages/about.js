import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
          <p className="text-lg text-muted-foreground">
            Hello, I am Mahela Wickramasinghe.
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            This site is a personal research log dedicated to exploring the practical application of AI agents in complex enterprise systems. My work focuses on deconstructing the operational friction between disconnected departments and designing new models for intelligent workflow orchestration. The goal is to document a clear path toward building more resilient and autonomous business infrastructures.
          </p>
        </div>
      </div>
    </Layout>
  )
}