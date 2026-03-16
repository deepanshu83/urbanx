'use client';

import styles from './AboutSection.module.css';

export default function AboutSection() {
  const features = [
    {
      icon: '✓',
      label: 'Premium Quality',
      sub: 'Hand-picked fabrics with strict quality control',
      bg: 'rgba(124,58,237,0.12)',
      border: 'rgba(124,58,237,0.2)',
    },
    {
      icon: '✓',
      label: 'Bold Designs',
      sub: 'Designed by artists who understand the streets',
      bg: 'rgba(219,39,119,0.12)',
      border: 'rgba(219,39,119,0.2)',
    },
    {
      icon: '🇮🇳',
      label: 'Made in India',
      sub: 'Proudly supporting local artisans and craftsmen',
      bg: 'rgba(217,119,6,0.12)',
      border: 'rgba(217,119,6,0.2)',
    },
  ];

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>

          {/* Left: Text */}
          <div>
            <p className={styles.eyebrow}>Our Story</p>
            <h2 className={styles.heading}>
              About <span className={styles.headingGradient}>UrbanX</span>
            </h2>
            <p className={styles.description}>
              UrbanX is more than a clothing brand — it&apos;s a{' '}
              <strong className={styles.descriptionHighlight}>lifestyle revolution</strong>. Premium urban fashion that combines bold
              design with uncompromising quality.
            </p>
            <p className={styles.subDescription}>
              Our mission is to empower the youth of India with fashion that speaks to their identity, courage, and
              aspirations. Every stitch tells a story of passion and craftsmanship.
            </p>

            <div className={styles.featuresList}>
              {features.map((f) => (
                <div
                  key={f.label}
                  className={styles.featureItem}
                  style={{ background: f.bg, borderColor: f.border }}
                >
                  <div
                    className={styles.featureIcon}
                    style={{ background: f.bg, border: `1px solid ${f.border}` }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className={styles.featureLabel}>{f.label}</div>
                    <div className={styles.featureSub}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
              }}
              className={styles.contactBtn}
            >
              Get in Touch →
            </button>
          </div>

          {/* Right: Visual card */}
          <div className={styles.visualContainer}>
            {/* Main card */}
            <div className={styles.mainCard}>
              {/* Background glow */}
              <div className={styles.glowWrapper}>
                <div className={styles.glowCircle} />
              </div>
              {/* Content */}
              <div className={styles.cardContent}>
                <div className={styles.cardEmoji}>👑</div>
                <div className={styles.cardYear}>Since 2024</div>
                <div className={styles.cardSubtitle}>Redefining Urban Fashion</div>
              </div>
            </div>

            {/* Stats chips */}
            <div className={`${styles.statsChip} ${styles.statsChipBottom}`}>
              <div className={styles.statsChipValue}>10K+</div>
              <div className={styles.statsChipLabel}>Happy Customers</div>
            </div>
            <div className={`${styles.statsChip} ${styles.statsChipTop}`}>
              <div className={styles.statsChipValue}>⭐ 4.9</div>
              <div className={styles.statsChipLabel}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
