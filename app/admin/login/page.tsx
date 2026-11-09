'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'unauthorized'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        router.replace('/admin');
      }
    };
    checkSession();

 let subscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
            router.replace('/admin');
          }
        })();
      });
      subscription = data.subscription;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleSendMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    if (!supabase) {
      setStatus('error');
      setErrorMsg('Unable to connect. Please try again.');
      return;
    }

    if (!ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
      setStatus('unauthorized');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
    } else {
      setStatus('sent');
    }
  };

  return (
    <main className="admin-auth">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-auth-icon"><Lock size={22} /></div>
          <h1>Admin Sign In</h1>
          <p>Sign in to manage QPR inquiry submissions.</p>
        </div>

        {status === 'sent' ? (
          <div className="admin-auth-sent">
            <ShieldCheck size={28} />
            <h2>Check your email</h2>
            <p>A secure sign-in link has been sent to <strong>{email}</strong>. Click the link to access the dashboard.</p>
            <button className="admin-auth-link" onClick={() => { setStatus('idle'); setEmail(''); }}>
              Use a different email
            </button>
          </div>
        ) : status === 'unauthorized' ? (
          <div className="admin-auth-denied">
            <p>This email is not authorized for admin access.</p>
            <button className="admin-auth-link" onClick={() => { setStatus('idle'); setEmail(''); }}>
              Try again
            </button>
          </div>
        ) : (
          <form className="admin-auth-form" onSubmit={handleSendMagicLink}>
            <label>
              <span><Mail size={14} /> Email address</span>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'sending'}
              />
            </label>
            <button className="button button-primary admin-auth-submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send sign-in link'} <ArrowRight size={17} />
            </button>
            {status === 'error' && <p className="admin-auth-error">{errorMsg}</p>}
          </form>
        )}

        <div className="admin-auth-footer">
          <a href="/" className="admin-auth-back">Back to Quick's Priority Resources</a>
        </div>
      </div>
    </main>
  );
}
