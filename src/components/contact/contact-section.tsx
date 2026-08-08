"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Magnetic from "@/components/common/magnetic";
import Reveal from "@/components/common/reveal";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const fieldBase =
  "w-full appearance-none rounded-none border-0 border-b bg-transparent py-3 text-base text-ink outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 transition-colors duration-300 placeholder:text-muted focus:border-accent";

export default function ContactSection() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [building, setBuilding] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const sentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  const clearError = (key: keyof FieldErrors) => {
    setFormError(null);
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!message.trim()) next.message = "Message is required";

    setErrors(next);

    if (next.name || next.email || next.message) {
      setFormError("Please fill out all required fields.");
      if (next.name) document.getElementById("contact-name")?.focus();
      else if (next.email) document.getElementById("contact-email")?.focus();
      else if (next.message) document.getElementById("contact-message")?.focus();
      return;
    }

    setIsSubmitting(true);

    const subject = `Project inquiry — ${name.trim()}`;
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      building.trim() ? `Building: ${building.trim()}` : null,
      "",
      message.trim(),
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const mailtoUrl = `mailto:${site.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        console.error("Mailto error:", err);
      }
      setIsSubmitting(false);
      setSent(true);
    }, 450);
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(site.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoUrl = `mailto:${site.personal.email}?subject=${encodeURIComponent(`Project inquiry — ${name.trim()}`)}&body=${encodeURIComponent(
    [`Name: ${name.trim()}`, `Email: ${email.trim()}`, building.trim() ? `Building: ${building.trim()}` : null, "", message.trim()]
      .filter(Boolean)
      .join("\n"),
  )}`;

  return (
    <section
      id="contact"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <Reveal as="p" className="text-meta text-muted">
        08 / CONTACT
      </Reveal>

      <h2 className="mt-[clamp(2.5rem,6vh,4rem)] text-[clamp(3rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
        {site.contact.hook.map((line, i) => (
          <Reveal key={line} as="span" delay={i * 0.08} className="block">
            {line}
          </Reveal>
        ))}
      </h2>

      <Reveal
        as="p"
        delay={0.2}
        className="mt-6 font-serif italic text-[clamp(1.5rem,3vw,2.25rem)] text-muted"
      >
        Let&rsquo;s talk.
      </Reveal>

      <Reveal delay={0.28} className="mt-[clamp(3rem,7vh,5rem)]">
        <Magnetic className="inline-block">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={open ? "contact-form-panel" : undefined}
            onClick={() => setOpen((v) => !v)}
            className="group inline-flex min-h-[44px] items-center gap-3 border border-line px-8 py-5 text-meta text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {site.contact.cta}
            <ArrowUpRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </Magnetic>
      </Reveal>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="contact-panel"
            id="contact-form-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [...EASE_OUT_EXPO] }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl pt-[clamp(3rem,6vh,4.5rem)]">
              {sent ? (
                <div
                  ref={sentRef}
                  role="status"
                  tabIndex={-1}
                  className="border border-accent/40 bg-surface-2 p-8 outline-none"
                >
                  <div className="flex items-center gap-3 text-accent font-medium">
                    <CheckCircle2 size={20} />
                    <span className="text-meta">MESSAGE FORMATTED & READY</span>
                  </div>
                  <p className="mt-4 text-xl text-ink md:text-2xl">
                    Thank you{name ? `, ${name}` : ""}! Your default email client should open now.
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    If your email application didn&rsquo;t pop up, click below to open or copy the email:
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-2 bg-accent-fill px-6 py-3 text-meta text-black hover:opacity-90 font-medium"
                    >
                      Open Email App
                      <ArrowUpRight size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="border border-line px-6 py-3 text-meta text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      {copied ? "Copied!" : `Copy (${site.personal.email})`}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1 block text-meta-sm text-muted"
                      >
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          clearError("name");
                        }}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={
                          errors.name ? "contact-name-error" : undefined
                        }
                        className={cn(
                          fieldBase,
                          errors.name ? "border-red-400" : "border-line",
                        )}
                      />
                      {errors.name && (
                        <p
                          id="contact-name-error"
                          role="alert"
                          className="mt-2 text-meta-sm text-red-400"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1 block text-meta-sm text-muted"
                      >
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError("email");
                        }}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={
                          errors.email ? "contact-email-error" : undefined
                        }
                        className={cn(
                          fieldBase,
                          errors.email ? "border-red-400" : "border-line",
                        )}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          role="alert"
                          className="mt-2 text-meta-sm text-red-400"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="contact-building"
                        className="mb-1 block text-meta-sm text-muted"
                      >
                        What are you building?
                      </label>
                      <input
                        id="contact-building"
                        name="building"
                        type="text"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className={cn(fieldBase, "border-line")}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="contact-message"
                        className="mb-1 block text-meta-sm text-muted"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          clearError("message");
                        }}
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={
                          errors.message ? "contact-message-error" : undefined
                        }
                        className={cn(
                          fieldBase,
                          "resize-none",
                          errors.message ? "border-red-400" : "border-line",
                        )}
                      />
                      {errors.message && (
                        <p
                          id="contact-message-error"
                          role="alert"
                          className="mt-2 text-meta-sm text-red-400"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-10">
                    {formError && (
                      <p className="mb-4 text-sm font-medium text-red-400">
                        ⚠️ {formError}
                      </p>
                    )}
                    <Magnetic className="inline-block">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex min-h-[44px] cursor-pointer items-center gap-3 bg-accent-fill px-8 py-4 text-meta font-medium text-black transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending message..." : "Send message"}
                        <ArrowRight size={14} aria-hidden="true" className={isSubmitting ? "animate-pulse" : ""} />
                      </button>
                    </Magnetic>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Reveal
        delay={0.1}
        className="mt-[clamp(4rem,8vh,6rem)] flex flex-wrap items-center gap-x-10 gap-y-4 text-meta text-muted"
      >
        <a
          href={`mailto:${site.personal.email}`}
          className="link-underline normal-case transition-colors duration-300 hover:text-ink"
        >
          {site.personal.email}
        </a>
        <a
          href={`tel:${site.personal.phone.replace(/\s+/g, "")}`}
          className="link-underline transition-colors duration-300 hover:text-ink"
        >
          {site.personal.phone}
        </a>
      </Reveal>
    </section>
  );
}
