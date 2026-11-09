'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, LOGO_URL, siteNavLinks } from '@/lib/site';

export default function SiteHeader({ activePath }: { activePath?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement">
        <div className="container announcement-inner">
          <span className="announcement-dot" />
          <span>Where your family is our top priority.</span>
          <div className="announcement-contact">
            <a href={CONTACT_PHONE_HREF}><Phone size={13} /> {CONTACT_PHONE}</a>
            <Link href="/#contact">Start a conversation <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Quick's Priority Resources home" onClick={closeMenu}>
            <img src={LOGO_URL} alt="Quick's Priority Resources" />
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {siteNavLinks.map((link) =>
              link.href === '/#contact' ? (
                <Link className="nav-cta" href={link.href} key={link.href} onClick={closeMenu}>
                  {link.label} <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={link.href === activePath ? 'active' : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
