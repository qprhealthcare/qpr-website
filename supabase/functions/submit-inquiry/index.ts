import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SENDER = "Quick's Priority Resources <noreply@quickspriorityresources.com>";
const AUDIENCES = [
  "Family member or caregiver",
  "Prospective client",
  "Referral source",
  "Community partner",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-.\s]+$/;
const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_PER_EMAIL = 3;
const RECAPTCHA_ACTION = "submit_inquiry";
const RECAPTCHA_MIN_SCORE = 0.5;

type Inquiry = {
  name: string;
  email: string;
  phone: string | null;
  audience: string;
  message: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ");
}

function validate(raw: Record<string, unknown>): { value: Inquiry } | { error: string } {
  const field = (key: string) => (typeof raw[key] === "string" ? (raw[key] as string).trim() : "");

  const name = field("name");
  const email = field("email");
  const phone = field("phone");
  const audience = field("audience");
  const message = field("message");

  if (name.length < 2 || name.length > 120) {
    return { error: "Please enter your name." };
  }
  if (email.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (phone.length > 30 || (phone && !PHONE_PATTERN.test(phone))) {
    return { error: "Please enter a valid phone number." };
  }
  if (!AUDIENCES.includes(audience)) {
    return { error: "Please choose who you are reaching out as." };
  }
  if (message.length < 10 || message.length > 4000) {
    return { error: "Please share a little more about what you need (at least 10 characters)." };
  }

  return { value: { name, email, phone: phone || null, audience, message } };
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Resend responded with ${response.status}: ${await response.text()}`);
  }
}

function detailRows(inquiry: Inquiry) {
  const rows: [string, string][] = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone ?? "Not provided"],
    ["Reaching out as", inquiry.audience],
  ];
  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;color:#486176;font-weight:600;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#0f2b3d;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

function adminEmailHtml(inquiry: Inquiry) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f2b3d;">
  <h2 style="color:#003366;">New inquiry from ${escapeHtml(inquiry.name)}</h2>
  <p>A new message was submitted through the QPR contact form.</p>
  <table style="border-collapse:collapse;width:100%;background:#f4f9f8;border-radius:8px;">${detailRows(inquiry)}</table>
  <h3 style="color:#003366;margin-top:24px;">Message</h3>
  <p style="white-space:pre-wrap;line-height:1.5;">${escapeHtml(inquiry.message)}</p>
  <p style="color:#486176;font-size:13px;">Replying to this email will reach ${escapeHtml(inquiry.name)} directly.</p>
</div>`;
}

function visitorEmailHtml(inquiry: Inquiry) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f2b3d;line-height:1.6;">
  <h2 style="color:#003366;">Thank you, ${escapeHtml(inquiry.name)}.</h2>
  <p>We have received your inquiry, and a member of the Quick's Priority Resources team will be in touch soon.</p>
  <p>Here is a copy of what you sent us:</p>
  <p style="white-space:pre-wrap;background:#f4f9f8;border-radius:8px;padding:16px;">${escapeHtml(inquiry.message)}</p>
  <p>Where your family is our top priority.</p>
  <p style="color:#486176;font-size:13px;">Questions? Call (704) 345-7248 or email quickspriorityresources@gmail.com. This is an automated message, so please do not reply to it.</p>
</div>`;
}

async function notify(inquiry: Inquiry) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  if (!adminEmail) throw new Error("ADMIN_EMAIL is not configured");

  const results = await Promise.allSettled([
    sendEmail(apiKey, {
      from: SENDER,
      to: [adminEmail],
      reply_to: inquiry.email,
      subject: `New inquiry from ${singleLine(inquiry.name)}`,
      html: adminEmailHtml(inquiry),
    }),
    sendEmail(apiKey, {
      from: SENDER,
      to: [inquiry.email],
      subject: "We received your inquiry",
      html: visitorEmailHtml(inquiry),
    }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Inquiry email failed", result.reason);
    }
  }
}

async function isHumanRecaptcha(token: string) {
  const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY is not configured");

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  if (!response.ok) {
    throw new Error(`reCAPTCHA responded with ${response.status}`);
  }

  const result = (await response.json()) as { success?: boolean; action?: string; score?: number };
  return result.success === true && result.action === RECAPTCHA_ACTION && (result.score ?? 0) >= RECAPTCHA_MIN_SCORE;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const body = await req.json().catch(() => null);
    if (typeof body !== "object" || body === null) {
      return json({ error: "Invalid request." }, 400);
    }

    // Hidden honeypot field: real visitors never fill it in, bots often do.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return json({ ok: true });
    }

    const result = validate(body);
    if ("error" in result) {
      return json({ error: result.error }, 400);
    }
    const inquiry = result.value;

    const recaptchaToken = typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";
    if (!recaptchaToken || !(await isHumanRecaptcha(recaptchaToken))) {
      return json({ error: "We could not verify your submission. Please try again, or call us at (704) 345-7248." }, 403);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
    const { count, error: countError } = await supabase
      .from("qpr_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("email", inquiry.email)
      .gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= RATE_LIMIT_MAX_PER_EMAIL) {
      return json({ error: "You have sent several inquiries recently. Please try again in a few minutes." }, 429);
    }

    const { error: insertError } = await supabase.from("qpr_inquiries").insert(inquiry);
    if (insertError) throw insertError;

    try {
      await notify(inquiry);
    } catch (notifyError) {
      console.error("Inquiry saved but notifications were not sent", notifyError);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("submit-inquiry failed", err);
    return json({ error: "We could not send your inquiry right now. Please try again." }, 500);
  }
});
