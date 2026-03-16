'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, DBProduct } from '@/lib/supabase';
import {
  DEFAULT_ADMIN_USER, DEFAULT_ADMIN_PASS, STORAGE_KEYS,
  WHATSAPP_NUMBER,
} from '@/lib/data';
import './admin.css';

// ---- Map DB row → UI product ----
function fromDB(p: DBProduct) {
  return { ...p, desc: p.description };
}
function toDB(p: ReturnType<typeof fromDB>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { desc, id, created_at, ...rest } = p as DBProduct & { desc: string; created_at?: string };
  return { ...rest, description: desc };
}

type TabId = 'dashboard' | 'products' | 'settings';

// ---- Badge ----
function Badge({ status }: { status: string }) {
  const cls =
    status === 'Active'       ? 'badge badge-green' :
    status === 'Out of Stock' ? 'badge badge-red'   : 'badge badge-gray';
  return <span className={cls}>{status}</span>;
}

// ---- Modal ----
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---- Toast ----
function Toast({ msg, show }: { msg: string; show: boolean }) {
  return <div className={`toast ${show ? '' : 'hidden'}`}>✅ {msg}</div>;
}

// ---- Field ----
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field-wrap">
      <label className="field-lbl">{label}</label>
      {children}
    </div>
  );
}

// ===========================
// EMPTY PRODUCT TEMPLATE
// ===========================
const EMPTY: DBProduct & { desc: string } = {
  id: 0, name: '', category: '', price: 0, stock: 0,
  status: 'Active', description: '', image: '', desc: '',
};

export default function AdminPage() {
  const [loggedIn,     setLoggedIn]     = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErr,     setLoginErr]     = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab,    setActiveTab]    = useState<TabId>('dashboard');
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [toast,        setToast]        = useState({ show: false, msg: '' });

  // Products
  const [products,     setProducts]     = useState<(DBProduct & { desc: string })[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [pForm, setPForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [productSearch,  setProductSearch]  = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Image upload
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [dragOver,  setDragOver]  = useState(false);

  // Settings
  const [newUsername, setNewUsername] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [settingSaved, setSettingSaved] = useState(false);

  // ---- Toast helper ----
  const showToast = useCallback((msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  }, []);

  // ---- Session ----
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setLoggedIn(true);
  }, []);

  // ---- Load products from Supabase ----
  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setProducts(data.map((p: DBProduct) => ({ ...p, desc: p.description })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loggedIn) loadProducts();
  }, [loggedIn, loadProducts]);

  // ---- Login ----
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !pass.trim()) return;
    setLoginLoading(true);
    setLoginErr(false);
    setTimeout(() => {
      const adminU = localStorage.getItem(STORAGE_KEYS.adminUser) || DEFAULT_ADMIN_USER;
      const adminP = localStorage.getItem(STORAGE_KEYS.adminPass) || DEFAULT_ADMIN_PASS;
      if (user === adminU && pass === adminP) {
        setLoggedIn(true);
        sessionStorage.setItem('admin_auth', 'true');
      } else {
        setLoginErr(true);
        setTimeout(() => setLoginErr(false), 3000);
      }
      setLoginLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem('admin_auth');
  };

  // ---- Filtered list ----
  const filteredProducts = products.filter(p => {
    const matchS = p.name.toLowerCase().includes(productSearch.toLowerCase())
                || p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchC = !categoryFilter || p.category === categoryFilter;
    return matchS && matchC;
  });

  // ---- Save product (insert or update) ----
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const dbRow = toDB(pForm);
    if (pForm.id !== 0) {
      await supabase.from('products').update(dbRow).eq('id', pForm.id);
      showToast('Product updated!');
    } else {
      await supabase.from('products').insert(dbRow);
      showToast('Product added!');
    }
    setProductModal(false);
    setPForm({ ...EMPTY });
    loadProducts();
  };

  // ---- Delete ----
  const deleteProduct = async (id: number) => {
    await supabase.from('products').delete().eq('id', id);
    setConfirmDeleteId(null);
    showToast('Product deleted!');
    loadProducts();
  };

  // ---- Settings ----
  const saveSettings = () => {
    if (newUsername) { localStorage.setItem(STORAGE_KEYS.adminUser, newUsername); setNewUsername(''); }
    if (newPass)     { localStorage.setItem(STORAGE_KEYS.adminPass, newPass);     setNewPass('');     }
    setSettingSaved(true);
    setTimeout(() => setSettingSaved(false), 3000);
  };

  // ---- Image Upload → Supabase Storage ----
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadErr('Only image files allowed!'); return; }
    if (file.size > 5 * 1024 * 1024)    { setUploadErr('Image too large! Max 5MB.'); return; }
    setUploadErr('');
    setUploading(true);
    try {
      const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
      const path     = `products/${Date.now()}_${safeName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (error) { setUploadErr(`Upload failed: ${error.message}`); return; }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setPForm(prev => ({ ...prev, image: urlData.publicUrl, description: prev.desc }));
      showToast(`Image uploaded! ✅`);
    } catch {
      setUploadErr('Upload failed. Check Supabase Storage setup.');
    } finally {
      setUploading(false);
    }
  }, [showToast]);

  // ---- Stats ----
  const activeCount = products.filter(p => p.status === 'Active').length;
  const ooStock     = products.filter(p => p.status === 'Out of Stock').length;
  const lowStock    = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const NAV: { id: TabId; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '▣', label: 'Dashboard' },
    { id: 'products',  icon: '◈', label: 'Products'  },
    { id: 'settings',  icon: '⚙', label: 'Settings'  },
  ];

  // ========== LOGIN ==========
  if (!loggedIn) {
    return (
      <div className="admin-root">
        <div className="login-page">
          <div className="login-box">
            <div className="login-brand">
              <span className="login-icon">🔐</span>
              <h1 className="login-title"><span className="grad-text">UrbanX</span> Admin</h1>
              <p className="login-subtitle">Secure access to your store dashboard</p>
            </div>
            <div className="login-card">
              <form onSubmit={handleLogin} className="login-form">
                <div className="field-group">
                  <label className="field-label">Username</label>
                  <div className="field-input-wrap">
                    <span className="field-input-icon">👤</span>
                    <input className="admin-field-input" type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username" required />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="field-input-wrap">
                    <span className="field-input-icon">🔑</span>
                    <input className="admin-field-input" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" required />
                  </div>
                </div>
                {loginErr && <div className="login-error">⚠️ Invalid credentials.</div>}
                <button type="submit" className="login-btn" disabled={loginLoading}>
                  {loginLoading ? (<><span className="spinner" /><span>Authenticating…</span></>) : <span>Secure Login →</span>}
                </button>
              </form>
              <div className="login-secure-badge">
                <span className="login-secure-dot" />
                256-bit SSL secured connection
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== DASHBOARD ==========
  return (
    <div className="admin-root">
      <div className="admin-layout">

        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="topbar-brand grad-text">UrbanX</span>
            <span className="topbar-divider">/</span>
            <span className="topbar-section">Admin Panel</span>
          </div>
          <div className="topbar-right">
            <Link href="/" className="view-site-link">🌐 View Site</Link>
            <div className="admin-avatar">A</div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-section-label">Menu</div>
          {NAV.map(item => (
            <button key={item.id} className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              <span className="sidebar-nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="sidebar-divider" />
          <Link href="/" className="sidebar-nav-btn"><span className="sidebar-nav-icon">🌐</span>View Website</Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="sidebar-nav-btn" style={{ color: '#4ade80' }}>
            <span className="sidebar-nav-icon">💬</span>Open WhatsApp
          </a>
        </aside>

        {/* Main */}
        <main className={`admin-main ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>

          {/* ---- DASHBOARD ---- */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="page-header">
                <div>
                  <h2 className="page-title">Overview</h2>
                  <p className="page-subtitle">Your store at a glance</p>
                </div>
                <button className="btn btn-ghost" onClick={loadProducts} style={{ fontSize: '0.8rem' }}>⟳ Refresh</button>
              </div>

              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">{products.length}</div>
                  <div className="stat-change">{activeCount} active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Out of Stock</div>
                  <div className="stat-value" style={{ color: ooStock > 0 ? '#f87171' : '#4ade80' }}>{ooStock}</div>
                  <div className="stat-change" style={{ color: '#6b7280' }}>need restocking</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Low Stock</div>
                  <div className="stat-value" style={{ color: lowStock > 0 ? '#facc15' : '#4ade80' }}>{lowStock}</div>
                  <div className="stat-change" style={{ color: '#6b7280' }}>≤ 5 units</div>
                </div>
              </div>

              {/* WhatsApp box */}
              <div style={{ background: 'linear-gradient(135deg,rgba(37,211,102,0.1),rgba(37,211,102,0.05))', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '1rem', padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>💬</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80', margin: '0 0 0.5rem' }}>Orders via WhatsApp</h3>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                      Customers order directly on WhatsApp. Your number: <strong style={{ color: '#4ade80', fontFamily: 'monospace' }}>+{WHATSAPP_NUMBER}</strong>
                    </p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="btn btn-primary"
                      style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)', boxShadow: '0 4px 14px rgba(37,211,102,0.3)', textDecoration: 'none' }}>
                      💬 Open WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick product table */}
              <div className="glass-card panel">
                <p className="panel-title">Product Catalog Quick View</p>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading from Supabase…</div>
                ) : products.slice(0, 5).map(p => (
                  <div key={p.id} className="order-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {p.image
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
                        : <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👔</div>
                      }
                      <div>
                        <div className="order-id">{p.name}</div>
                        <div className="order-meta">{p.category} · Stock: {p.stock}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong style={{ color: 'white', fontSize: '0.9rem' }}>₹{p.price.toLocaleString()}</strong>
                      <Badge status={p.status} />
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                    <button className="btn-purple-text" onClick={() => setActiveTab('products')}>View all {products.length} products →</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- PRODUCTS ---- */}
          {activeTab === 'products' && (
            <div>
              <div className="page-header">
                <div>
                  <h2 className="page-title">Products</h2>
                  <p className="page-subtitle">Add, edit, or delete — visible to everyone instantly</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-ghost" onClick={loadProducts} style={{ fontSize: '0.8rem' }}>⟳ Refresh</button>
                  <button className="btn btn-primary" onClick={() => { setPForm({ ...EMPTY }); setProductModal(true); }}>+ Add Product</button>
                </div>
              </div>

              <div className="glass-card">
                <div className="section-toolbar">
                  <input className="search-input" style={{ flex: 1, minWidth: '160px' }} placeholder="🔍  Search products…" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                  <select className="search-input" style={{ width: '180px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {['Street Wear', 'Casual Chic', 'Premium Line', 'Active Wear'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
                    Loading products…
                  </div>
                ) : (
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '48px' }}></th>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th className="right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr><td colSpan={7} className="td-empty">
                            No products found.{' '}
                            {(productSearch || categoryFilter) && <button className="btn-purple-text" onClick={() => { setProductSearch(''); setCategoryFilter(''); }}>Clear filters</button>}
                          </td></tr>
                        ) : filteredProducts.map(p => (
                          <tr key={p.id} className="trow">
                            <td style={{ padding: '0.5rem 0.75rem' }}>
                              {p.image
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                : <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>👔</div>
                              }
                            </td>
                            <td>
                              <div className="td-primary">{p.name}</div>
                              <div className="td-secondary">{p.description?.slice(0, 45)}{p.description?.length > 45 ? '…' : ''}</div>
                            </td>
                            <td>{p.category}</td>
                            <td><strong style={{ color: 'white' }}>₹{p.price.toLocaleString()}</strong></td>
                            <td>
                              <span style={{ color: p.stock > 10 ? '#4ade80' : p.stock > 0 ? '#facc15' : '#f87171', fontWeight: 600 }}>{p.stock}</span>
                            </td>
                            <td><Badge status={p.status} /></td>
                            <td className="td-right">
                              <button className="btn-purple-text" onClick={() => { setConfirmDeleteId(null); setPForm({ ...p, desc: p.description }); setProductModal(true); }}>Edit</button>
                              {confirmDeleteId === p.id ? (
                                <>
                                  <button className="btn-red-text" style={{ background: 'rgba(239,68,68,0.15)', borderRadius: '0.4rem', padding: '0.3rem 0.6rem' }} onClick={() => deleteProduct(p.id)}>✓ Yes, Delete</button>
                                  <button className="btn-purple-text" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                                </>
                              ) : (
                                <button className="btn-red-text" onClick={() => setConfirmDeleteId(p.id)}>Delete</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: '0.75rem', fontSize: '0.82rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                🌐 <span>Products are stored in Supabase — everyone sees the same catalog in real-time.</span>
              </div>
            </div>
          )}

          {/* ---- SETTINGS ---- */}
          {activeTab === 'settings' && (
            <div>
              <div className="page-header">
                <div><h2 className="page-title">Settings</h2><p className="page-subtitle">Configure admin panel</p></div>
              </div>
              <div className="settings-section">
                <p className="settings-section-title">Change Login Credentials</p>
                <div className="settings-form">
                  <Field label="New Username">
                    <input className="admin-input" type="text" placeholder="Leave blank to keep current" value={newUsername} onChange={e => setNewUsername(e.target.value)} autoComplete="off" />
                  </Field>
                  <Field label="New Password">
                    <input className="admin-input" type="password" placeholder="Leave blank to keep current" value={newPass} onChange={e => setNewPass(e.target.value)} autoComplete="new-password" />
                  </Field>
                  <div>
                    <button className="btn btn-primary" onClick={saveSettings}>Save Settings ✓</button>
                    {settingSaved && <div className="settings-saved">✅ Saved!</div>}
                  </div>
                </div>
              </div>
              <div className="settings-section" style={{ background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: '1rem', padding: '1.5rem', marginTop: '1.5rem' }}>
                <p className="settings-section-title" style={{ color: '#4ade80' }}>🌐 Supabase Connected</p>
                <p className="settings-desc">Products aur images Supabase pe hain — deploy ke baad bhi add kar sakte ho, sab ko dikhenge.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ---- PRODUCT MODAL ---- */}
      <Modal open={productModal} onClose={() => { setProductModal(false); setUploadErr(''); }} title={pForm.id ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={saveProduct} className="modal-form">
          <Field label="Product Name">
            <input className="admin-input" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} placeholder="e.g. Urban Hoodie" required />
          </Field>
          <div className="modal-2col">
            <Field label="Category">
              <select className="admin-input" value={pForm.category} onChange={e => setPForm({ ...pForm, category: e.target.value })} required>
                <option value="">Select…</option>
                {['Street Wear', 'Casual Chic', 'Premium Line', 'Active Wear'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input className="admin-input" type="number" min={0} value={pForm.price || ''} onChange={e => setPForm({ ...pForm, price: +e.target.value })} placeholder="999" required />
            </Field>
          </div>
          <div className="modal-2col">
            <Field label="Stock Quantity">
              <input className="admin-input" type="number" min={0} value={pForm.stock || ''} onChange={e => setPForm({ ...pForm, stock: +e.target.value })} placeholder="50" required />
            </Field>
            <Field label="Status">
              <select className="admin-input" value={pForm.status} onChange={e => setPForm({ ...pForm, status: e.target.value as DBProduct['status'] })}>
                {['Active', 'Inactive', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea className="admin-input" rows={2} value={pForm.desc} onChange={e => setPForm({ ...pForm, desc: e.target.value, description: e.target.value })} placeholder="Short description…" style={{ resize: 'vertical' }} />
          </Field>

          {/* ===== DRAG & DROP IMAGE ===== */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
              Product Image
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}
              onClick={() => { (document.getElementById('img-file-input') as HTMLInputElement)?.click(); }}
              style={{
                border: `2px dashed ${dragOver ? '#a855f7' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '0.875rem', padding: '1.5rem', textAlign: 'center',
                cursor: uploading ? 'not-allowed' : 'pointer',
                background: dragOver ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
                  <div style={{ width: 28, height: 28, border: '3px solid rgba(168,85,247,0.3)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Uploading to Supabase…</span>
                </div>
              ) : pForm.image ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pForm.image} alt="preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '0.625rem', flexShrink: 0, border: '2px solid rgba(168,85,247,0.3)' }} />
                  <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700 }}>✅ Image ready!</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '3px', wordBreak: 'break-all' }}>{pForm.image}</div>
                    <button type="button" style={{ marginTop: '6px', fontSize: '0.68rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      onClick={e => { e.stopPropagation(); setPForm(prev => ({ ...prev, image: '' })); }}>
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '2.25rem' }}>🖼️</div>
                  <div style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 600 }}>Drag & drop image here</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>or click to browse · JPG, PNG, WEBP · Max 5MB</div>
                </div>
              )}
            </div>
            <input id="img-file-input" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />
            <input className="admin-input" style={{ marginTop: '0.625rem', fontSize: '0.78rem' }}
              value={pForm.image || ''} onChange={e => setPForm({ ...pForm, image: e.target.value })}
              placeholder="Or paste image URL directly" />
            {uploadErr && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#f87171', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '0.5rem' }}>
                ⚠️ {uploadErr}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => { setProductModal(false); setUploadErr(''); }}>Cancel</button>
            <button type="submit" className="btn btn-primary">{pForm.id ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>

      <Toast show={toast.show} msg={toast.msg} />
    </div>
  );
}
