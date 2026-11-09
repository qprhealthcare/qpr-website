'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Script from 'next/script';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MessageCircleHeart,
  MoveUpRight,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { qprServices } from '@/lib/services';
import { supabase } from '@/lib/supabase';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';
import { getRecaptchaToken, RECAPTCHA_SCRIPT_SRC } from '@/lib/recaptcha';

const audienceCards = [
  ['For families', 'Find a caring starting point, understand your options, and connect with a team that listens.'],
  ['For referral partners', 'Share a referral or start a conversation about coordinated support for someone you serve.'],
  ['For community partners', 'Build a stronger circle of care through thoughtful collaboration and trusted communication.'],
];

const faqs = [
  ['Who does QPR support?', 'QPR supports individuals of all ages affected by traumatic brain injury (TBI) and disabilities, along with the families, caregivers, agencies, and community partners who surround them.'],
  ['How do I start a conversation?', 'Use the inquiry form below. Tell us a little about what you are looking for and our team can help identify the right next step.'],
  ['What can I expect from QPR?', 'You can expect individualized support through the 1915(i) program, respectful communication, and care focused on independence and community participation.'],
];

const DEFAULT_INQUIRY_ERROR = 'We could not send your inquiry right now. Please try again.';

async function readInquiryError(error: unknown) {
  const response = (error as { context?: unknown }).context;
  if (response instanceof Response) {
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') return body.error;
    } catch {
      return DEFAULT_INQUIRY_ERROR;
    }
  }
  return DEFAULT_INQUIRY_ERROR;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus('submitting');
    setFormError('');
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      audience: String(data.get('audience') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      website: String(data.get('website') ?? ''),
    };

    if (!supabase) {
      setFormError(DEFAULT_INQUIRY_ERROR);
      setFormStatus('error');
      return;
    }

    let recaptchaToken: string;
    try {
      recaptchaToken = await getRecaptchaToken();
    } catch {
      setFormError(DEFAULT_INQUIRY_ERROR);
      setFormStatus('error');
      return;
    }

    const { error } = await supabase.functions.invoke('submit-inquiry', { body: { ...payload, recaptchaToken } });
    if (error) {
      setFormError(await readInquiryError(error));
      setFormStatus('error');
      return;
    }
    setFormStatus('success');
    form.reset();
  };

  return (
    <main className="site-shell">
      <Script src={RECAPTCHA_SCRIPT_SRC} strategy="afterInteractive" />
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> QUICK'S PRIORITY RESOURCES</div>
            <h1>Compassionate support for <em>people living with brain injury and disabilities.</em></h1>
            <p className="hero-lede">Person-centered home and community services for people of all ages living with traumatic brain injury or disabilities, and the families beside them.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Start a conversation<ArrowRight size={18} /></a>
              <a className="button button-quiet" href="/about">Learn about QPR <MoveUpRight size={17} /></a>
            </div>
           
            <div className="hero-proof">
              <div className="proof-avatars"><span>Q</span><span>P</span><span>R</span></div>
              <div><strong>A caring place to begin</strong><small>For families, agencies, and community partners</small></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="A welcoming care environment">
            <div className="visual-frame">
              <img src="https://kppbknabhfmsskmbrxfh.supabase.co/storage/v1/object/public/media/Compassionate%20Care%20in%20the%20Sunlit%20Home.jpg" alt="Compassionate Care in the Sunlit Home" />
              <div className="visual-label"><span className="label-icon"><ShieldCheck size={18} /></span><span><strong>Over 20 years of experience</strong><small>Support with intention</small></span></div>
            </div>
            <div className="floating-note"><Sparkles size={17} /><span>Made for meaningful progress</span></div>
          </div>
        </div>
        <div className="hero-wave" />
      </section>

      <section className="intro section-pad" id="about">
        <div className="container intro-grid">
          <div><div className="eyebrow eyebrow-teal"><span /> A DIFFERENT KIND OF SUPPORT</div><h2>Every person deserves to feel <em>seen, safe, and supported.</em></h2></div>
          <div className="intro-copy"><p>At QPR, quality support begins with listening. We partner with individuals, families, and referral sources to create a path forward that feels personal, practical, and hopeful.</p><p>Our work is grounded in dignity, consistency, and over twenty years of experience. Through Medicaid’s 1915(i) program, we help children, youth, and adults build independence and take part fully in their communities.</p><a className="text-link" href="/about">Learn more about QPR <ArrowRight size={16} /></a></div>
        </div>
        <div className="container value-strip"><div><span>01</span><strong>Respect first</strong><small>Every story matters</small></div><div><span>02</span><strong>Support that fits</strong><small>Built around real life</small></div><div><span>03</span><strong>Progress together</strong><small>Stronger with a circle of care</small></div></div>
      </section>

      <section className="services section-pad" id="services">
        <div className="container"><div className="section-heading"><div><div className="eyebrow"><span /> HOW WE HELP</div><h2>Support that meets people <em>where they are.</em></h2></div><p>Five ways we help people build independence, strengthen everyday skills, and stay connected to their community.</p></div>
          <div className="service-image-grid">
            <Link className="service-feature" href={`/services#${qprServices[0].number}`} aria-label={`Learn more about ${qprServices[0].title}`}>
              <img src={qprServices[0].image} alt={qprServices[0].imageAlt} loading="lazy" />
              <div className="service-feature-overlay" />
              <div className="service-feature-content"><span className="service-feature-number">{qprServices[0].number}</span><h3>{qprServices[0].title}</h3><span className="service-feature-link">Learn more <ArrowUpRight size={17} /></span></div>
            </Link>
            <div className="service-supporting">{qprServices.slice(1).map((service) => <Link className="service-image-card" href={`/services#${service.number}`} key={service.title} aria-label={`Learn more about ${service.title}`}><img src={service.image} alt={service.imageAlt} loading="lazy" /><div className="service-image-overlay" /><div className="service-image-content"><span className="service-image-number">{service.number}</span><h4>{service.title}</h4></div></Link>)}</div>
          </div>
          <div className="services-cta"><div><strong>Connecting individuals and families with meaningful support.</strong><span>Explore the full details of each service and find the right place to begin.</span></div><Link className="button button-dark" href="/services">Explore all services <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="specialization section-pad">
        <div className="container specialization-grid"><div className="founder-image"><img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/QPR/Yakita%20Quick.png" alt="Yakita Quick, Chief Executive Officer of Quick's Priority Resources" /><div className="founder-caption"><strong>Yakita Quick</strong><span>Chief Executive Officer</span></div></div><div className="specialization-copy"><div className="eyebrow eyebrow-teal"><span /> OUR SPECIALIZATION</div><h2>Care that creates room for <em>confidence.</em></h2><p>We focus on the whole person, not just the diagnosis. That means helping people build skills, strengthen relationships, and take a fuller part in the communities they call home.</p><ul className="check-list"><li><Check size={17} /> Individualized goals and care planning</li><li><Check size={17} /> Family-informed communication and guidance</li><li><Check size={17} /> Community connection and greater independence</li></ul><a className="button button-dark" href="#contact">Start a conversation<ArrowRight size={17} /></a></div></div>
      </section>

      <section className="audiences section-pad" id="families"><div className="container"><div className="section-heading centered"><div><div className="eyebrow"><span /> WHO WE SERVE</div><h2>A trusted next step for <em>your community.</em></h2></div><p>Whether you are looking for care or helping someone find it, QPR is here to make connection easier.</p></div><div className="audience-grid">{audienceCards.map(([title, text], index) => <a href="#contact" className="audience-card" key={title}><span className="audience-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p><span className="circle-arrow"><ArrowRight size={18} /></span></a>)}</div></div></section>

      <section className="resources section-pad" id="resources"><div className="container resources-grid"><div className="resource-highlight"><div className="eyebrow eyebrow-light"><span /> A PLACE TO START</div><h2>Clear answers. <em>Real support.</em></h2><p>Explore a few common questions, then reach out when you are ready. There is no wrong place to begin.</p><a className="button button-aqua" href="#contact">Start a conversation <ArrowRight size={17} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={18} /></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></div></section>

      <section className="contact section-pad" id="contact"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow eyebrow-teal"><span /> LET'S CONNECT</div><h2>Start with a simple <em>conversation.</em></h2><p>Tell us what you are looking for. We will listen, learn a little more, and help you understand the next step.</p><div className="contact-detail"><div className="detail-icon"><MessageCircleHeart size={20} /></div><div><strong>Questions are welcome</strong><span>Families and referral partners are encouraged to reach out.</span></div></div><div className="contact-detail"><div className="detail-icon"><Phone size={20} /></div><div><strong>Call us</strong><a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></div></div><div className="contact-detail"><div className="detail-icon"><Mail size={20} /></div><div><strong>Email us</strong><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div></div><div className="contact-detail"><div className="detail-icon"><ShieldCheck size={20} /></div><div><strong>Your privacy matters</strong><span>Please share only the information you feel comfortable including. Please don’t include medical records or detailed health information here.</span></div></div></div><form className="inquiry-form" onSubmit={handleSubmit}><div className="form-heading"><span>QPR Inquiry</span><small>We would love to hear from you.</small></div><div className="form-row"><label>Name<input name="name" required minLength={2} placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label></div><div className="form-row"><label>Phone <span>(optional)</span><input name="phone" type="tel" placeholder="(555) 000-0000" /></label><label>I am reaching out as...<select name="audience" required defaultValue=""><option value="" disabled>Select one</option><option>Family member or caregiver</option><option>Prospective client</option><option>Referral source</option><option>Community partner</option></select></label></div><label>How can we help?<textarea name="message" required minLength={10} placeholder="Share a little about what you need..." rows={4} /></label><button className="button button-primary form-button" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Sending...' : 'Send inquiry'} <ArrowRight size={17} /></button>{formStatus === 'success' && <p className="form-message success-message">Thank you. Your inquiry has been received, and our team will be in touch.</p>}{formStatus === 'error' && <p className="form-message error-message">{formError || DEFAULT_INQUIRY_ERROR}</p>}<small className="form-note">By sending this form, you are starting a conversation with Quick's Priority Resources.</small><small className="form-note">This form is protected by reCAPTCHA. The Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.</small></form></div></section>

      <SiteFooter />
    </main>
  );
}
