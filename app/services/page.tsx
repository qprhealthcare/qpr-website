'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  HeartHandshake,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { qprServices } from '@/lib/services';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

export default function ServicesPage() {
  return (
    <main className="site-shell services-page">
      <SiteHeader activePath="/services" />

      <section className="services-hero"><div className="services-hero-shape" /><div className="container services-hero-grid"><div><div className="eyebrow eyebrow-light"><span /> OUR SERVICES</div><h1>Meaningful support for <em>people living with brain injury and disabilities.</em></h1><p>QPR helps individuals affected by traumatic brain injury and disabilities build independence, pursue meaningful employment, strengthen daily living skills, and stay connected to their communities through the 1915(i) program.</p><div className="hero-actions"><Link className="button button-aqua" href="/#contact">Start a conversation <ArrowRight size={17} /></Link><a className="services-back-link" href="#service-list">Explore the services <ArrowRight size={16} /></a></div></div><div className="services-hero-art"><img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/QPR/services%20hero%202.jpg" alt="Quick's Priority Resources brand imagery" /><div className="hero-art-badge"><ShieldCheck size={19} /><span><strong>Individualized by design</strong><small>Care that starts with listening</small></span></div></div></div></section>

      <section className="service-list section-pad" id="service-list"><div className="container"><div className="service-list-heading"><div><div className="eyebrow eyebrow-teal"><span /> FIND THE RIGHT STARTING POINT</div><h2>Five ways we can <em>support the journey.</em></h2></div><p>Every service is grounded in dignity, consistency, and practical support shaped around the person.</p></div>
        <div className="service-story-list">
          {qprServices.map((service, index) => (
            <article className={`service-story ${index % 2 === 1 ? 'reversed' : ''}`} id={service.number} key={service.title}>
              <div className="service-story-image">
                <img src={service.image} alt={service.imageAlt} loading="lazy" />
                <span className="service-story-number">{service.number}</span>
              </div>
              <div className="service-story-content">
                <p className="service-subtitle">{service.subtitle}</p>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul>{service.focus.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
                <Link className="service-learn-link" href="/#contact">Ask about this service <ArrowRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="referral-banner"><div className="container referral-banner-inner"><div><div className="eyebrow eyebrow-light"><span /> FOR REFERRAL PARTNERS</div><h2>Connecting individuals and families with <em>meaningful support.</em></h2><p>Connect with QPR to learn more about available services and the referral process for individuals affected by traumatic brain injury and disabilities.</p><div className="referral-contact-row"><a className="referral-contact-link" href={CONTACT_PHONE_HREF}><Phone size={15} /> {CONTACT_PHONE}</a><a className="referral-contact-link" href={`mailto:${CONTACT_EMAIL}`}><Mail size={15} /> {CONTACT_EMAIL}</a></div></div><Link className="button button-primary" href="/#contact">Start a referral conversation <ArrowRight size={17} /></Link></div></section>

      <section className="about-slogan-strip"><div className="container about-slogan-strip-inner"><HeartHandshake size={24} /><span>Where your family is our top priority.</span></div></section>

      <section className="eligibility-note"><div className="container eligibility-inner"><ShieldCheck size={23} /><p><strong>A note about eligibility.</strong> Service availability depends on individual eligibility, authorization, program requirements, and applicable coverage rules. QPR can help you understand the next step.</p><Link href="/#contact">Talk with QPR <ArrowRight size={15} /></Link></div></section>
      <SiteFooter />
    </main>
  );
}
