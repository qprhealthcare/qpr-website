import { RECAPTCHA_SITE_KEY } from '@/lib/site';

export const RECAPTCHA_ACTION = 'submit_inquiry';
export const RECAPTCHA_SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function getRecaptchaToken(): Promise<string> {
  const grecaptcha = typeof window !== 'undefined' ? window.grecaptcha : undefined;
  if (!grecaptcha) {
    return Promise.reject(new Error('reCAPTCHA has not loaded yet'));
  }
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION }).then(resolve, reject);
    });
  });
}
