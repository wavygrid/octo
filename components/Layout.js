import Link from 'next/link'
import Head from 'next/head'
import { Button } from './ui/button'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>N.Mahela Wickramasinghe</title>
        <link rel="icon" href="/mahela.w.svg" />
      </Head>
      {/* Simple top navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl flex items-center">
            <img src="/mahela.w.svg" alt="Mahela.dev" className="w-8 h-8" />
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Articles
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}