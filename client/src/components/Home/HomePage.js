import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiGrid,
  FiUploadCloud,
  FiSliders,
  FiDownload,
  FiArrowRight,
  FiCheckCircle,
  FiLayers,
  FiZap,
  FiImage,
} from 'react-icons/fi';

/* ─── Static data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: <FiUploadCloud />,
    title: 'Upload Any Image',
    desc: 'Drag & drop or browse to upload JPG, PNG, or any common image format as your drawing reference.',
    accent: 'accent-blue',
  },
  {
    icon: <FiGrid />,
    title: 'Smart Grid Overlay',
    desc: 'Automatically apply a precise grid over your image to help break it down into manageable sections.',
    accent: 'accent-teal',
  },
  {
    icon: <FiSliders />,
    title: 'Fully Customisable',
    desc: 'Adjust grid size, colours, opacity, line weight, and canvas dimensions to match your drawing paper.',
    accent: 'accent-warm',
  },
  {
    icon: <FiDownload />,
    title: 'Export & Save',
    desc: 'Download your grid as a high-resolution PNG or save your project to revisit and edit any time.',
    accent: 'accent-blue',
  },
];

const STEPS = [
  { num: '01', title: 'Create an account', desc: 'Sign up for free — no credit card required.' },
  { num: '02', title: 'Upload your image', desc: 'Import the photo or artwork you want to draw.' },
  { num: '03', title: 'Tune & export', desc: 'Customise the grid, then download or save your project.' },
];

const PERKS = [
  'Free to use',
  'No design skills needed',
  'Works on any device',
  'Projects saved to the cloud',
];

/* ─── Hero grid visual ─────────────────────────────────── */
function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-card">
        <div className="hv-toolbar">
          <span className="hv-dot hv-dot-red" />
          <span className="hv-dot hv-dot-yellow" />
          <span className="hv-dot hv-dot-green" />
          <span className="hv-label">my-portrait.png</span>
        </div>
        <div className="hv-canvas">
          <div className="hv-image-placeholder">
            <FiImage />
            <span>Your image here</span>
          </div>
          {/* Grid lines overlay */}
          <svg className="hv-grid-svg" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
            {[40, 80, 120, 160, 200].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" stroke="rgba(13,107,176,0.45)" strokeWidth="0.8" />
            ))}
            {[36, 72, 108, 144].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="240" y2={y} stroke="rgba(13,107,176,0.45)" strokeWidth="0.8" />
            ))}
          </svg>
        </div>
        <div className="hv-footer">
          <span className="hv-badge">6 × 5 grid</span>
          <span className="hv-badge hv-badge-teal">Ready to export</span>
        </div>
      </div>
      {/* Floating stat chips */}
      <div className="hv-chip hv-chip-1"><FiZap /> Instant overlay</div>
      <div className="hv-chip hv-chip-2"><FiDownload /> PNG export</div>
    </div>
  );
}

/* ─── Component ────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">
              <FiLayers /> Free &amp; open to all
            </span>
            <h1 className="hero-heading">
              Draw Better with a<br />
              <span className="hero-heading-accent">Perfect Grid</span>
            </h1>
            <p className="hero-sub">
              Upload any image, overlay a precise grid, and reproduce it square-by-square.
              The fastest way to improve your drawing accuracy.
            </p>
            <ul className="hero-perks">
              {PERKS.map((p) => (
                <li key={p}>
                  <FiCheckCircle className="perk-icon" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg hero-cta">
                Get Started Free <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
      </section>

      {/* ── Features ── */}
      <section className="home-section home-features">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title-lg">Everything you need to draw with confidence</h2>
            <p className="section-desc">
              A complete toolkit designed for artists, hobbyists, and anyone who wants to draw more accurately.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className={`feature-card ${f.accent}`}>
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-section home-how">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title-lg">Up and drawing in three steps</h2>
          </div>
          <div className="steps-row">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="step-card">
                  <span className="step-num">{s.num}</span>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <FiArrowRight className="step-arrow" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="home-section home-cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-blob cta-blob-1" aria-hidden="true" />
            <div className="cta-blob cta-blob-2" aria-hidden="true" />
            <h2 className="cta-heading">Ready to start drawing?</h2>
            <p className="cta-sub">Create your free account and make your first grid in under a minute.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Free Account <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-outline-white btn-lg">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container home-footer-inner">
          <span className="footer-brand">
            <FiLayers className="footer-logo-icon" />
            Drawing Grid Maker
          </span>
          <p className="footer-copy">© {new Date().getFullYear()} Drawing Grid Maker. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
