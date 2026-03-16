'use client';

import { WHATSAPP_NUMBER } from '@/lib/data';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Hi UrbanX! 👋\nMujhe aapke collections mein interested hoon. Kripya order details share karein.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <section id="home" className={styles.heroSection}>
      {/* Subtle blurred orbs — behind everything */}
      <div className={styles.orbsContainer}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      {/* Subtle grid */}
      <div className={styles.gridOverlay} />

      {/* Content */}
      <div className={styles.contentWrapper}>

        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          New Collection Dropped
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          <span className={styles.headingBlock1}>Define</span>
          <span className={styles.headingBlock2}>Your Style</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Premium Urban Fashion crafted for the{' '}
          <span className={styles.subtitleHighlight}>Modern Generation</span> of India
        </p>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button onClick={openWhatsApp} className={styles.btnPrimary}>
            📱 Order on WhatsApp
          </button>
          <button onClick={() => scrollTo('collections')} className={styles.btnSecondary}>
            View Collections
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { value: '500+', label: 'Products' },
            { value: '10K+', label: 'Customers' },
            { value: '50+', label: 'Cities' },
          ].map((s, i) => (
            <div key={s.label} className={`${styles.statItem} ${i === 1 ? styles.statBordered : ''}`}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll arrow */}
        <div className={styles.scrollArea}>
          <span className={styles.scrollText}>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>
    </section>
  );
}
