'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} glass`}>
      <div className={styles.container}>
        <div className={styles.flexBetween}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <Image src="/urbanx-logo.jpg" alt="UrbanX Logo" width={44} height={44} priority />
            </div>
            <span className={`${styles.logoText} gradient-text`}>UrbanX</span>
          </div>

          {/* Desktop Nav */}
          <ul className={styles.desktopNav}>
            {['home', 'collections', 'about', 'contact'].map((item) => (
              <li key={item}>
                <button onClick={() => scrollTo(item)} className={styles.navLink}>
                  {item}
                </button>
              </li>
            ))}
            <li>
              <Link href="/admin" className={styles.adminBtn}>
                🔐 Admin
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.hamburgerBtn}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''} glass`}>
        <div className={styles.mobileMenuInner}>
          {['home', 'collections', 'about', 'contact'].map((item) => (
            <button key={item} onClick={() => scrollTo(item)} className={styles.mobileLink}>
              {item === 'home' ? '🏠' : item === 'collections' ? '👕' : item === 'about' ? '📖' : '📬'} {item}
            </button>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} className={styles.mobileAdminBtn}>
            🔐 Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}
