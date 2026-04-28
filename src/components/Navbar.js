'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">📊</div>
          <span className="navbar-logo-text">PerformanceIQ</span>
        </Link>
        <div className="navbar-links">
          <Link href="/" className="navbar-link">Home</Link>
        </div>
      </div>
    </nav>
  );
}
