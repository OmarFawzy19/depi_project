import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";

type FormState = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
};

const CATEGORIES = [
  "General Inquiry",
  "Recommendation",
  "Complaint",
  "Partnership",
  "Technical Support",
  "Other",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "makany.site@gmail.com",
    href: "mailto:makany.site@gmail.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+20 1xxxxxxxxx",
    href: "tel:+201xxxxxxxxx",
  },
  {
    icon: MapPin,
    label: "Find Us",
    value: "Cairo, Egypt",
    href: "#",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Sun – Thu, 9 AM – 6 PM",
    href: null,
  },
];

export function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.category) e.category = "Please choose a category";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError(null);
    try {
      await axiosClient.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Get In Touch
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-normal text-foreground sm:text-5xl">
            Contact{" "}
            <span className="text-gradient">Us</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Have a recommendation, a complaint, or just want to say hi? We read
            every message and reply within one business day.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-3xl border border-border/70 shadow-card lg:grid lg:grid-cols-5">

          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative overflow-hidden bg-gradient-primary p-8 sm:p-10 lg:col-span-2 flex flex-col justify-between"
          >
            <div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold text-white">
                We&rsquo;d love to hear from you
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Whether it&rsquo;s a complaint, a feature idea, or a partnership
                inquiry &mdash; your voice shapes Makany.
              </p>
            </div>

            <ul className="mt-10 flex flex-col gap-5">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-0.5 text-sm font-medium text-white hover:text-white/80 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="bg-card p-8 sm:p-10 lg:col-span-3"
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-accent"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </motion.div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Message Sent!
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out. Our team will get back to you within
                  one business day.
                </p>
                <Button
                  variant="outline"
                  className="mt-2 rounded-xl"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      category: "",
                      message: "",
                    });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name + Email row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    id="contact-name"
                    error={errors.name}
                  >
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputCls(!!errors.name)}
                    />
                  </Field>
                  <Field
                    label="Email Address"
                    id="contact-email"
                    error={errors.email}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="name@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls(!!errors.email)}
                    />
                  </Field>
                </div>

                {/* Phone + Category row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" id="contact-phone">
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="+20 100 000 0000"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputCls(false)}
                    />
                  </Field>
                  <Field
                    label="Category"
                    id="contact-category"
                    error={errors.category}
                  >
                    <select
                      id="contact-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputCls(!!errors.category)}
                    >
                      <option value="">Select a category…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Message */}
                <Field
                  label="Your Message"
                  id="contact-message"
                  error={errors.message}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputCls(!!errors.message)} resize-none`}
                  />
                </Field>

                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="group w-full rounded-xl text-base font-semibold shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground",
    "placeholder:text-muted-foreground/60",
    "focus:outline-none focus:ring-2 focus:ring-primary/40",
    "transition-colors duration-200",
    hasError
      ? "border-destructive focus:ring-destructive/30"
      : "border-input hover:border-primary/40",
  ].join(" ");
}
