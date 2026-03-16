'use client';

import { useEffect, useState } from 'react';
import { supabase, DBProduct } from '@/lib/supabase';
import { WHATSAPP_NUMBER } from '@/lib/data';
import styles from './CollectionsSection.module.css';

// Category color palette
const CAT_COLORS: Record<string, { bg: string; btn: string; badge: string; badgeClass: string }> = {
  'Street Wear':  { bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', btn: '#7c3aed', badge: 'NEW',     badgeClass: styles.badgeStreet   },
  'Casual Chic':  { bg: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)', btn: '#db2777', badge: 'TREND',   badgeClass: styles.badgeCasual   },
  'Premium Line': { bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', btn: '#d97706', badge: 'PREMIUM', badgeClass: styles.badgePremium  },
  'Active Wear':  { bg: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', btn: '#0891b2', badge: 'ACTIVE',  badgeClass: styles.badgeActive   },
};

function WhatsAppIcon() {
  return (
    <svg style={{ flexShrink: 0, width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Category emoji for placeholder
const CAT_EMOJI: Record<string, string> = {
  'Street Wear':  '👕',
  'Casual Chic':  '👗',
  'Premium Line': '✨',
  'Active Wear':  '🏃',
};

export default function CollectionsSection() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProducts(data);
      }
    };
    loadProducts();
  }, []);

  const openWhatsApp = (product: DBProduct) => {
    const msg = encodeURIComponent(
      `Hi UrbanX! 👋\nMujhe *${product.name}* order karna hai.\nPrice: ₹${product.price.toLocaleString()}\nCategory: ${product.category}\n\nKripya order confirm karein aur delivery details share karein. 🙏`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <section id="collections" className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Curated For You</p>
          <h2 className={styles.title}>Our Products</h2>
          <div className={styles.titleDivider} />
        </div>

        {/* Not mounted yet (SSR) — show skeleton or nothing */}
        {!mounted && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            Loading products…
          </div>
        )}

        {/* Mounted + no products */}
        {mounted && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '1.5rem',
            color: '#6b7280',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛍️</div>
            <h3 style={{ color: '#9ca3af', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
              No products yet
            </h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Products added from the Admin Panel will appear here automatically.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {mounted && products.length > 0 && (
          <div className={styles.grid}>
            {products.map((product) => {
              const cat = CAT_COLORS[product.category] ?? {
                bg: 'linear-gradient(135deg, #374151, #1f2937)',
                btn: '#374151',
                badge: product.category.toUpperCase().slice(0, 6),
                badgeClass: '',
              };
              const emoji = CAT_EMOJI[product.category] ?? '👔';

              return (
                <div key={product.id} className={styles.card}>
                  {/* Image area */}
                  <div className={styles.cardImageArea} style={{ background: cat.bg }}>
                    {/* Noise texture */}
                    <div className={styles.noiseOverlay} style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                    }} />

                    {/* Real product image OR emoji fallback */}
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.cardImage}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                        onError={(e) => {
                          // If image fails, hide it and show emoji behind
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{
                        fontSize: '4.5rem',
                        position: 'relative',
                        zIndex: 2,
                        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
                        userSelect: 'none',
                      }}>
                        {emoji}
                      </div>
                    )}

                    {/* Emoji shown behind as fallback when image is present but fails */}
                    {product.image && (
                      <div style={{
                        fontSize: '4.5rem',
                        position: 'absolute',
                        zIndex: 0,
                        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
                        userSelect: 'none',
                      }}>
                        {emoji}
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className={styles.imageOverlay} style={{ zIndex: 3 }} />

                    {/* Badge */}
                    <span className={`${styles.badge} ${cat.badgeClass}`} style={{ zIndex: 4 }}>
                      {cat.badge}
                    </span>
                  </div>


                  {/* Card body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <p className={styles.cardDesc}>{product.description || product.category}</p>

                    {/* Price */}
                    <div className={styles.priceContainer}>
                      <span className={styles.priceCurrent}>₹{product.price.toLocaleString()}</span>
                      {product.stock <= 5 && product.stock > 0 && (
                        <span style={{
                          fontSize: '0.7rem',
                          color: '#facc15',
                          background: 'rgba(234,179,8,0.1)',
                          border: '1px solid rgba(234,179,8,0.2)',
                          borderRadius: '999px',
                          padding: '0.1rem 0.5rem',
                          fontWeight: 600,
                        }}>
                          Only {product.stock} left!
                        </span>
                      )}
                    </div>

                    {/* Order button */}
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => openWhatsApp(product)}
                        className={styles.btnExplore}
                        style={{ background: cat.btn }}
                      >
                        📱 Order on WhatsApp
                      </button>
                      <button
                        onClick={() => openWhatsApp(product)}
                        className={styles.btnWhatsapp}
                        aria-label="Order via WhatsApp"
                      >
                        <WhatsAppIcon />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
