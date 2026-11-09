
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  LOGO_URL,
  siteNavLinks,
} from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[#f0f7f5]">
      {/* Main footer */}
      <div className="container mx-auto grid grid-cols-1 items-start gap-9 py-9 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-[55px] lg:py-12">
        {/* Brand */}
        <div className="max-w-[380px] md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="mb-[15px] inline-flex items-center"
          >
            <img
              src={LOGO_URL}
              alt="Quick's Priority Resources"
              className="block h-auto w-[128px] max-w-full"
            />
          </Link>

          <p className="mb-3 font-[var(--font-montserrat)] text-base font-bold leading-relaxed tracking-[-0.01em] text-[var(--navy-deep)] sm:text-lg">
            Where your family is our top priority.
          </p>

          <p className="m-0 max-w-[360px] text-[13px] leading-[1.8] text-[var(--muted)]">
            Person-centered support helping individuals affected by
            traumatic brain injury build independence and thrive in
            their homes and communities.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-[18px] font-[var(--font-montserrat)] text-sm font-bold text-[var(--navy-deep)]">
            Explore
          </h3>

          <nav
            className="flex flex-col items-start gap-[11px] text-[13px] font-semibold text-[#486176]"
            aria-label="Footer navigation"
          >
            {siteNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 hover:text-[var(--teal-dark)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-[18px] font-[var(--font-montserrat)] text-sm font-bold text-[var(--navy-deep)]">
            Contact Us
          </h3>

          <p className="mb-[18px] max-w-[300px] text-xs leading-[1.8] text-[var(--muted)]">
            Have questions about our services? We'd love to hear from
            you.
          </p>

          <div className="flex flex-col items-start gap-[13px]">
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-start gap-[9px] text-xs font-semibold leading-relaxed text-[var(--navy)] transition-colors hover:text-[var(--teal-dark)]"
            >
              <Phone
                size={14}
                className="mt-0.5 shrink-0 text-[var(--teal-dark)]"
              />
              <span>{CONTACT_PHONE}</span>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-start gap-[9px] text-xs font-semibold leading-relaxed text-[var(--navy)] transition-colors hover:text-[var(--teal-dark)]"
            >
              <Mail
                size={14}
                className="mt-0.5 shrink-0 text-[var(--teal-dark)]"
              />
              <span className="break-all sm:break-normal">
                {CONTACT_EMAIL}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Associations */}
      <div className="border-t border-[var(--line)]">
        <div className="container mx-auto flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-center sm:gap-6">
          <h3 className="font-[var(--font-montserrat)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--navy-deep)]">
            Associations
          </h3>

          <a
            href="https://www.alp-nc.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit ALP-NC"
            className="inline-flex items-center justify-center transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="https://kppbknabhfmsskmbrxfh.supabase.co/storage/v1/object/public/media/ALP%20LogoAsset%201.svg"
              alt="ALP-NC logo"
              loading="lazy"
              className="block h-auto w-[110px] max-w-full object-contain"
            />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--line)]">
        <div className="container mx-auto flex flex-col items-start gap-2 py-[18px] text-[10px] leading-[1.7] text-[#80939a] sm:px-0 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <span>
            © {new Date().getFullYear()} Quick's Priority Resources.
            All rights reserved.
          </span>

          <span className="lg:text-center">
            Brain injury and disability support. Real solutions. Lasting impact.
          </span>

          <span>
            Designed by{' '}
            <a
              href="https://www.sitesonpolaris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--navy)] transition-colors hover:text-[var(--teal-dark)]"
            >
              Sites on Polaris
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
