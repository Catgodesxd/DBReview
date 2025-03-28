'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={backgroundStyle}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <Link href="/lab" style={navLinkStyle}>Lab</Link>
        <Link href="/professor" style={navLinkStyle}>Professor</Link>
        <Link href="/course" style={navLinkStyle}>Course</Link>
        <Link href="/write-a-review" style={navLinkStyle}>Write a Review</Link>
        <Link href="/about-user" style={navLinkStyle}>About User</Link>
        <Link href="/research" style={navLinkStyle}>Research</Link> {/* Added Research Link */}
      </nav>

      {/* Main Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          Welcome to the CPE Feedback Site
        </h1>
      </div>
    </div>
  );
}

// Background with GIF
const backgroundStyle = {
  minHeight: '100vh',
  background: 'url("/beach.gif") center/cover no-repeat',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

// Navigation Bar
const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '15px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  width: '100%',
  position: 'fixed',
  top: 0
};

// Navigation Links
const navLinkStyle = {
  margin: '0 15px',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px'
};

// Centered Content
const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '100px'
};

// Title Style
const titleStyle = {
  fontSize: '45px', // Increased font size
  color: 'white',   // Black text
  fontWeight: 'bold',
  textShadow: '4px 4px 6px rgba(0,0,0,0.5)' // Stronger shadow for depth effect
};