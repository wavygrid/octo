import Link from 'next/link';

export default function Nav({ isOpen, onClose }) {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <nav className={`nav ${isOpen ? 'mobile-open' : ''}`}>
      <div className="nav-content">
        <h1 className="nav-title">Research Blog</h1>
        <ul className="nav-links">
          <li>
            <Link href="/" onClick={handleLinkClick}>Articles</Link>
          </li>
          <li>
            <Link href="/about" onClick={handleLinkClick}>About</Link>
          </li>
          <li>
            <Link href="/contact" onClick={handleLinkClick}>Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}