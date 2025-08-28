import { useState } from 'react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Layout from '../components/Layout'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { 
  Network, 
  Brain, 
  Workflow, 
  Database, 
  Bot, 
  Cpu, 
  GitBranch,
  Zap,
  Cloud
} from 'lucide-react'

const getTopicIcons = (keywords) => {
  const iconMap = {
    'ipaas': Network,
    'ai': Brain,
    'artificial intelligence': Brain,
    'workflow automation': Workflow,
    'workflow orchestration': GitBranch,
    'big data': Database,
    'ai agents': Bot,
    'agentic intelligence': Bot,
    'processing': Cpu,
    'integration': Zap,
    'cloud': Cloud,
    'react': Cpu,
    'webdev': Workflow,
    'data-visualization': Database,
    'architecture': GitBranch,
    'performance': Zap
  }
  
  const icons = []
  keywords?.forEach(keyword => {
    const key = keyword.toLowerCase()
    const IconComponent = iconMap[key] || iconMap[Object.keys(iconMap).find(k => key.includes(k))]
    if (IconComponent && !icons.some(icon => icon === IconComponent)) {
      icons.push(IconComponent)
    }
  })
  
  return icons.length > 0 ? icons.slice(0, 3) : [Brain, Workflow, Database]
}

export default function Home({ posts }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLabel, setSelectedLabel] = useState('')
  const itemsPerPage = 10

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.keywords && post.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    
    const matchesLabel = !selectedLabel || 
      (post.keywords && post.keywords.some(keyword => 
        keyword.toLowerCase() === selectedLabel.toLowerCase()
      ))
    
    return matchesSearch && matchesLabel
  })

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleLabelClick = (label) => {
    setSelectedLabel(label)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearLabelFilter = () => {
    setSelectedLabel('')
    setCurrentPage(1)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Research Articles</h1>
          <p className="text-lg text-muted-foreground">
            Browse and search through research articles and insights.
          </p>
        </div>
        
        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Active Label Filter */}
        {selectedLabel && (
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Filtered by label:</span>
            <Badge variant="outline" className="text-xs">
              {selectedLabel}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLabelFilter}
              className="h-6 px-2 text-xs"
            >
              Clear filter
            </Button>
          </div>
        )}

        {/* Articles - Table-like rows */}
        <div className="space-y-6">
          {paginatedPosts.map((post) => {
            const topicIcons = getTopicIcons(post.keywords)
            
            return (
              <Card key={post.slug} className="hover:shadow-md transition-shadow">
                <Link href={`/articles/${post.slug}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left side: Title and Labels */}
                      <div className="flex-1 space-y-4">
                        <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        
                        {/* Labels */}
                        {post.keywords && post.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {post.keywords.slice(0, 3).map((keyword) => (
                              <Badge 
                                key={keyword} 
                                variant="default" 
                                size="xs"
                                className="cursor-pointer hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleLabelClick(keyword)
                                }}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Right side: Date and Icons */}
                      <div className="flex flex-row lg:flex-col lg:items-end gap-4 lg:gap-3">
                        {/* Topic icons */}
                        <div className="flex items-center gap-1.5 lg:order-1">
                          {topicIcons.map((IconComponent, index) => (
                            <IconComponent
                              key={index}
                              className="h-6 w-6 text-muted-foreground"
                            />
                          ))}
                        </div>
                        
                        {/* Date */}
                        <span className="text-sm text-muted-foreground whitespace-nowrap lg:order-2">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {filteredPosts.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground text-center sm:text-right">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPosts.length)} of {filteredPosts.length} articles
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((name) => {
    const filePath = path.join(postsDirectory, name)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug: name.replace('.mdx', ''),
      title: data.title,
      date: data.date,
      keywords: data.keywords || [],
    }
  })

  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    props: { posts },
  }
}