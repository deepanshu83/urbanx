import styles from './FeaturesBanner.module.css';

export default function FeaturesBanner() {
  const features = [
    { icon: '🚚', title: 'Free Shipping', sub: 'On orders above ₹999' },
    { icon: '↩', title: 'Easy Returns', sub: '7-day hassle-free returns' },
    { icon: '🛡', title: 'Secure Payment', sub: 'SSL encrypted checkout' },
    { icon: '🇮🇳', title: 'Made in India', sub: 'Supporting local artisans' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`${styles.featureItem} ${i < 3 ? styles.borderRight : ''}`}
          >
            <div className={styles.iconWrapper}>
              {f.icon}
            </div>
            <div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureSub}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
