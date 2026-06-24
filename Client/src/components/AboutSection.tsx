import { motion } from "framer-motion";
import { Sparkles, Building2, Globe, ShieldCheck, MapIcon, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Soft background mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-3xl mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl mb-6"
          >
            About <span className="text-primary">Makany</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            We're on a mission to make finding your perfect place in Egypt simpler, faster, and more human.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 max-w-6xl mx-auto">

          {/* Main Story Card (Spans 2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-card p-10 sm:p-14 border border-border/60 shadow-sm flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary transition-transform duration-700 group-hover:scale-110">
              <Building2 className="w-64 h-64" />
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary w-fit mb-8 ring-1 ring-primary/20">
                <Sparkles className="w-4 h-4" />
                Our Story
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold font-heading mb-6 leading-tight text-balance text-foreground">
                Born out of one simple frustration: <br className="hidden sm:block" />
                finding a home felt harder than it should be.
              </h3>
              <div className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl space-y-4">
                <p className="font-medium text-foreground">
                  Five students. Different academic journeys. One vision.
                </p>
                <p>
                  Makany was created by a team of DEPI trainees who believe that great ideas happen when diverse minds work together. Despite our different backgrounds and experiences, we united to build a platform that makes finding and exploring properties simpler, faster, and more accessible.
                </p>
                <p>
                  Makany represents our teamwork, passion for technology, and commitment to creating solutions that make a difference.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 border border-border/50 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Transparency First</h4>
              <p className="text-muted-foreground leading-relaxed">Every listing is verified. No hidden fees, just honest information you can trust.</p>
            </div>
          </motion.div>

          {/* Value 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-8 border border-border/50 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-600 flex items-center justify-center mb-6">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Owner Direct</h4>
              <p className="text-muted-foreground leading-relaxed">Cut out the middleman. Contact landlords and sellers directly for smoother chats.</p>
            </div>
          </motion.div>

          {/* Vision/Quote Card (Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 rounded-[2.5rem] bg-primary p-10 sm:p-12 text-primary-foreground flex flex-col sm:flex-row items-center gap-8 shadow-xl relative overflow-hidden"
          >
            {/* Glow effect inside blue card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />

            <div className="w-20 h-20 shrink-0 rounded-3xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md relative z-10 shadow-inner">
              <Globe className="w-10 h-10" />
            </div>
            <div className="relative z-10">
              <p className="text-xl sm:text-2xl font-medium leading-relaxed mb-6 drop-shadow-sm">
                "We believe every Egyptian deserves to find their perfect place — without the hassle, without the middlemen, and without the guesswork."
              </p>
              <div className="flex items-center gap-3 opacity-90">
                <div className="h-px w-6 bg-white/40" />
                <p className="font-bold uppercase tracking-widest text-xs text-white">
                  The Makany Team
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 border border-border/50 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6">
              <MapIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Built for Egypt</h4>
              <p className="text-muted-foreground leading-relaxed">Designed for local neighborhoods and Egyptian real-estate norms.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

