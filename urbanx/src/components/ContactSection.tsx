'use client';

import { useState } from 'react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0.75rem',
    padding: '0.8rem 1rem',
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
    e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Reach Out</p>
          <h2 className={styles.title}>
            Get In{' '}
            <span className={styles.titleGradient}>
              Touch
            </span>
          </h2>
          <p className={styles.subtitle}>We usually respond within 24 hours</p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Your Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="Rahul Singh"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={styles.label}>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="rahul@email.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label className={styles.label}>Subject</label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Order inquiry / Feedback"
                style={inputStyle}
              />
            </div>
            <div>
              <label className={styles.label}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Tell us how we can help you..."
                rows={5}
                required
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>
            <button type="submit" className={styles.btnSubmit}>
              Send Message 🚀
            </button>
          </form>

          {submitted && (
            <div className={styles.successMsg}>
              ✅ Message sent! We&apos;ll get back to you within 24 hours.
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div className={styles.footerInfo}>
          <span className={styles.footerItem}>📧 hello@urbanx.in</span>
          <span className={styles.footerItem}>📱 +91 98765 43210</span>
          <span className={styles.footerItem}>📍 New Delhi, India</span>
        </div>
      </div>
    </section>
  );
}
