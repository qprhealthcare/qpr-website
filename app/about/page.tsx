'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  HeartHandshake,
  Mail,
  Phone,
  ShieldCheck,
  Target,
} from 'lucide-react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

const brainInjuryFacts = [
  ['Falls', 'The most common cause of TBI, especially among children and older adults.'],
  ['Vehicle crashes', 'A leading cause of TBI-related hospitalization across all ages.'],
  ['Sports injuries', 'Concussions and repeated head impacts can affect learning and development.'],
  ['Other impacts', 'Any blow to the head can result in a brain injury with lasting effects.'],
];

const commitmentValues = [
  ['Respect', 'We treat every person with dignity and honor their individual story.'],
  ['Listening', 'We listen to each person’s goals and tailor support around what matters to them.'],
  ['Partnership', 'We walk alongside individuals and their families at every stage of recovery.'],
];

export default function AboutPage() {
  return (
    <main className="site-shell about-page">
      <SiteHeader activePath="/about" />

      <section className="about-hero">
        <div className="about-hero-glow" />
        <div className="container about-hero-grid">
          <div>
            <div className="eyebrow eyebrow-teal"><span /> ABOUT US</div>
            <h1>Support for lives <em>affected by brain injury and disabilities.</em></h1>
            <p>QPR is dedicated to supporting people of all ages whose lives have been affected by traumatic brain injury and disabilities. We provide individualized home and community-based services through the 1915(i) program.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/#contact">Start a conversation <ArrowRight size={18} /></Link>
              <Link className="button button-quiet" href="/#services">Explore services <ArrowRight size={17} /></Link>
            </div>
          </div>
          <div className="about-hero-visual">
            <div className="about-hero-frame">
              <img src="https://kppbknabhfmsskmbrxfh.supabase.co/storage/v1/object/public/media/Tender%20Hospital%20Recovery%20Moment%20(1).jpg" alt="A tender moment of recovery and care" />
              <div className="about-hero-pill">1915(i)</div>
              <div className="about-hero-caption">
                <span className="about-hero-caption-icon"><ShieldCheck size={18} /></span>
                <span><strong>Support with intention</strong><small>Care that meets you where you are</small></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-who section-pad" id="who-we-are">
        <div className="container about-who-grid">
          <div>
            <div className="eyebrow"><span /> WHO WE ARE</div>
            <h2>Dedicated to people of <em>all ages.</em></h2>
          </div>
          <div className="about-who-copy">
            <p>QPR is dedicated to supporting people of all ages whose lives have been affected by traumatic brain injury (TBI) and disabilities. We provide person-centered home and community-based services through the 1915(i) program, helping children, youth, and adults build independence, pursue meaningful work, and take part fully in their communities.</p>
            <p>We believe that every person deserves support that honors their individual strengths, goals, and circumstances — and that recovery is a journey we walk together.</p>
          </div>
        </div>
      </section>

      <section className="about-brain section-pad" id="understanding-brain-injury">
        <div className="container about-brain-split">
          <div className="about-brain-visual">
            <div className="about-brain-glow" />
            <div className="about-brain-image-frame">
              <img src="https://kppbknabhfmsskmbrxfh.supabase.co/storage/v1/object/public/media/Luminous%20Profile%20Brain%20Anatomy.png" alt="Illustration of human brain anatomy" loading="lazy" />
            </div>
          </div>
          <div className="about-brain-content">
            <div className="eyebrow eyebrow-teal"><span /> UNDERSTANDING BRAIN INJURY</div>
            <h2>No two brain injuries <em>are alike.</em></h2>
            <p className="about-brain-lede">Traumatic brain injury can happen to anyone — through a fall, a car crash, a sports injury, or another impact to the head. No two brain injuries are alike, and the effects can change over time. For children and youth, a brain injury can affect learning and development. Adults may experience changes in thinking, emotions, or daily functioning. Recovery looks different at every stage of life, and our support is designed to adapt along with it.</p>
            <div className="about-brain-grid">
              {brainInjuryFacts.map(([title, text]) => (
                <div className="about-brain-card" key={title}>
                  <div className="about-brain-card-icon"><ShieldCheck size={18} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission section-pad" id="mission">
        <div className="container about-mission-inner">
          <div className="about-mission-icon"><Target size={30} /></div>
          <div className="eyebrow eyebrow-light"><span /> OUR MISSION</div>
          <h2>We empower individuals affected by <em>traumatic brain injury and disabilities</em> to live with dignity, independence, and informed choice.</h2>
          <p>We partner with each person, their family, and their community to build on individual strengths and support personal goals.</p>
        </div>
      </section>

      <section className="about-commitment section-pad" id="commitment">
        <div className="container">
          <div className="about-commitment-header">
            <div className="eyebrow"><span /> OUR COMMITMENT</div>
            <h2>Making your family <em>our top priority.</em></h2>
            <p>Making your family our top priority is central to our mission. We are committed to treating every person with respect, listening to their goals, and walking alongside them and their families at every stage of recovery.</p>
          </div>
          <div className="about-slogan-banner">
            <HeartHandshake size={28} />
            <span>Where your family is our top priority.</span>
          </div>
          <div className="about-commitment-grid">
            {commitmentValues.map(([title, text]) => (
              <div className="about-commitment-card" key={title}>
                <div className="about-commitment-check"><Check size={18} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="about-commitment-cta">
            <Link className="button button-primary" href="/#contact">Start a conversation <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="about-associations section-pad" id="associations">
        <div className="container about-associations-inner">
          <div className="eyebrow eyebrow-teal"><span /> ASSOCIATIONS</div>
          <h2>Connected to our <em>community.</em></h2>
          <div className="about-associations-grid">
            <div className="about-association-card">
              <div className="about-association-logo"><img src="https://kppbknabhfmsskmbrxfh.supabase.co/storage/v1/object/public/media/ALP%20LogoAsset%201.svg" alt="ALP-NC logo" loading="lazy" /></div>
              <h3>ALP-NC</h3>
              <p>Ability Leadership Program</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-contact section-pad" id="get-in-touch">
        <div className="container about-contact-inner">
          <div className="eyebrow eyebrow-teal"><span /> GET IN TOUCH</div>
          <h2>To learn more about our services or <em>begin the referral process,</em> email us.</h2>
          <div className="about-contact-actions">
            <a className="button button-primary" href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} /> {CONTACT_EMAIL}</a>
            <a className="about-contact-phone" href={CONTACT_PHONE_HREF}><Phone size={16} /> {CONTACT_PHONE}</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
