import { TESTIMONIALS } from '@/lib/data';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Reviews</p>
          <h2 className={styles.title}>
            What Our{' '}
            <span className={styles.titleGradient}>
              Customers Say
            </span>
          </h2>
          <div className={styles.titleDivider} />
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.card}>
              {/* Stars */}
              <div className={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={styles.starIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className={styles.quote}>&ldquo;{t.review}&rdquo;</p>

              {/* Author */}
              <div className={styles.authorContainer}>
                <div className={styles.avatar}>
                  {t.avatar}
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorCity}>{t.city}</div>
                </div>
                <div className={styles.verifiedContainer}>
                  <span className={styles.verifiedBadge}>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
