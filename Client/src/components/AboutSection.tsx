import { motion } from "framer-motion";
import { Building2, MapPin, Star, Users } from "lucide-react";

const stats = [
  { icon: Building2, value: "2,400+", label: "Active Listings" },
  { icon: Users, value: "18,000+", label: "Happy Renters" },
  { icon: MapPin, value: "30+", label: "Cities Covered" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

const values = [
  {
    title: "Transparency First",
    description:
      "Every listing is verified by our team. No hidden fees, no surprises — just honest information you can trust.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    accent: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Owner Direct",
    description:
      "We cut out the middleman. Contact landlords and sellers directly for faster, smoother conversations.",
    gradient: "from-violet-500/10 to-purple-500/10",
    accent: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Built for Egypt",
    description:
      "Makany is designed around local neighborhoods, Arabic-speaking communities, and Egyptian real-estate norms.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    accent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          {/* Decorative pill badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Who We Are
          </span>

          <h2 className="mt-3 font-heading text-3xl font-bold tracking-normal text-foreground sm:text-5xl">
            About{" "}
            <span className="text-gradient">Makany</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Makany — Arabic for <em>&ldquo;My Place&rdquo;</em> — is Egypt&rsquo;s modern real-estate marketplace
            born out of one simple frustration: finding a home felt harder than it should be.
            We set out to change that.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Launched in 2026, we bring verified listings, map-first discovery, and direct
            owner contact together in one beautifully simple platform — serving renters,
            buyers, and landlords across 30+ Egyptian cities.
          </p>
        </motion.div>

        {/* Pull-quote strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 overflow-hidden rounded-2xl bg-gradient-primary p-px shadow-glow"
        >
          <div className="rounded-[calc(1rem-1px)] bg-card/95 px-8 py-7 backdrop-blur-sm sm:px-12 sm:py-8">
            <p className="text-center font-heading text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">
              &ldquo;We believe every Egyptian deserves to find their perfect place —
              without the hassle, without the middlemen, and without the guesswork.&rdquo;
            </p>
            <p className="mt-3 text-center text-sm text-muted-foreground">— The Makany Team</p>
          </div>
        </motion.div>

        {/* Stats strip */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                <stat.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <p className="font-heading text-3xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission + Values side-by-side */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

          {/* Left — mission copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-primary">Our Mission</p>
            <h3 className="mb-5 font-heading text-2xl font-bold tracking-normal text-foreground sm:text-3xl">
              Making home-finding human again
            </h3>
            <p className="mb-4 text-base leading-7 text-muted-foreground">
              We believe finding a home should feel exciting, not exhausting. That&rsquo;s why we built a platform
              that puts people first — transparent listings, real owners, and a map-driven discovery experience
              that lets you explore neighborhoods the way you actually live in them.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Whether you&rsquo;re a first-time renter or a seasoned investor, Makany gives you the tools to search
              smarter, compare faster, and move with complete confidence.
            </p>
          </motion.div>

          {/* Right — value cards */}
          <div className="flex flex-col gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
                className={`rounded-2xl border border-border/70 bg-gradient-to-br ${v.gradient} p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover`}
              >
                <span className={`mb-3 inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${v.accent}`}>
                  {v.title}
                </span>
                <p className="text-sm leading-6 text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
