import { useState, useEffect } from 'react';

export default function ContentNavigation() {
  const [headings, setHeadings] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on an article page
    const isArticlePage = window.location.pathname.includes('/articles/');
    setIsVisible(isArticlePage);
    
    if (!isArticlePage) return;

    const extractHeadings = () => {
      const headingElements = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
      const headingsList = Array.from(headingElements).map((heading, index) => {
        if (!heading.id) {
          const baseId = heading.textContent.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
          heading.id = baseId || `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)),
          element: heading
        };
      });
      setHeadings(headingsList);
    };

    const timer = setTimeout(extractHeadings, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setReadingProgress(progress);

      let current = '';
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = heading.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, isVisible]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  if (!isVisible || headings.length === 0) return null;

  return (
    <>
      {/* Desktop Content Navigation */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center" style={{ gap: '1.5rem' }}>
              <div className="font-semibold text-gray-900" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>Contents</div>
              <nav className="flex items-center" style={{ gap: '0.5rem', overflowX: 'auto' }}>
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`px-3 py-1 rounded-md transition-colors text-sm ${
                      activeSection === heading.id 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={{
                      whiteSpace: 'nowrap',
                      marginLeft: heading.level === 2 ? '0.5rem' : heading.level === 3 ? '1rem' : '0',
                      fontSize: heading.level > 2 ? '0.8rem' : '0.875rem'
                    }}
                    onClick={() => scrollToSection(heading.id)}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              <span className="text-xs text-gray-500" style={{ fontFamily: 'ui-monospace, monospace' }}>
                {Math.round(readingProgress)}%
              </span>
              <div style={{ width: '6rem', height: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    backgroundColor: '#3b82f6', 
                    borderRadius: '0.25rem',
                    width: `${readingProgress}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>Contents</div>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <span className="text-xs text-gray-500" style={{ fontFamily: 'ui-monospace, monospace' }}>
                {Math.round(readingProgress)}%
              </span>
              <div style={{ width: '4rem', height: '0.375rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    backgroundColor: '#3b82f6', 
                    borderRadius: '0.25rem',
                    width: `${readingProgress}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
          <select
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700"
            value={activeSection}
            onChange={(e) => scrollToSection(e.target.value)}
            style={{ outline: 'none' }}
          >
            <option value="">Jump to section...</option>
            {headings.map((heading) => (
              <option key={heading.id} value={heading.id}>
                {'—'.repeat(Math.max(0, heading.level - 1))} {heading.text}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}