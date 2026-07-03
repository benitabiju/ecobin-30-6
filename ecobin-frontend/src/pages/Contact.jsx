import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
const contactCards = [
  { icon: "📞", title: "Pickup & Collection Support", value: "+1 (800) ECO-BIN1", badge: "24 / 7 Available" },
  { icon: "✉️", title: "Enterprise & Partnerships", value: "partnerships@ecobin.io", badge: "Replies within 2 hours" },
  { icon: "📍", title: "Headquarters", value: "42 Green District, Eco Tower, Floor 9", badge: "Mon – Fri, 9am – 6pm" },
  { icon: "🐦", title: "Social Channels", value: "@EcoBinOfficial · LinkedIn · Instagram", badge: "Follow for updates" },
];

const reasons = [
  { icon: "⚡", title: "Fast response", desc: "Average first reply under 90 minutes." },
  { icon: "🛡️", title: "Secure & private", desc: "Your data never leaves our encrypted servers." },
  { icon: "🌍", title: "City-wide coverage", desc: "Operating in 50+ urban zones." },
  { icon: "♻️", title: "Impact-first", desc: "Every request routed toward zero-landfill outcomes." },
];

const testimonials = [
  { stars: 5, quote: "Submitted a pickup request at 11pm — had a collector assigned before I woke up. Genuinely impressed.", initials: "AP", name: "Arun P.", role: "Resident, Chennai" },
  { stars: 5, quote: "The partnership team was incredibly thorough. Our municipality was onboarded within a week of first contact.", initials: "NK", name: "Nandini K.", role: "Urban Planning Dept." },
  { stars: 4, quote: "Raised a bin overflow issue at 7am and the area was cleared by noon. This is what city tech should look like.", initials: "RS", name: "Ravi S.", role: "Business owner, Madurai" },
  { stars: 5, quote: "Integrated EcoBin's API into our fleet system. Docs were clear, support was fast, went live in 3 days.", initials: "MB", name: "Meera B.", role: "CTO, GreenFleet Pvt. Ltd." },
  { stars: 5, quote: "Called the support line expecting hold music. Got a real person who solved my issue immediately.", initials: "SJ", name: "Sundar J.", role: "Apartment manager, Coimbatore" },
];

const offices = [
  { label: "Green District HQ", sub: "Main operations & partnerships", dim: "" },
  { label: "North Zone Centre", sub: "Collector dispatch & monitoring", dim: "opacity-50" },
  { label: "South Zone Centre", sub: "Recycling coordination", dim: "opacity-50" },
  { label: "East Regional Hub", sub: "Smart bin infrastructure", dim: "opacity-40" },
];

const TABS = ["Request Pickup", "Get Support", "Partner with us"];

const inputCls =
  "w-full p-3 rounded-lg border border-eco-sage/30 bg-white dark:bg-eco-charcoal text-eco-forest dark:text-white placeholder-eco-sage/40 focus:outline-none focus:border-eco-emerald text-sm font-sans";

function FieldLabel({ children }) {
  return (
    <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-eco-forest dark:text-eco-sage">
      {children}
    </label>
  );
}

function Stars({ count }) {
  return (
    <div className="text-eco-emerald text-sm mb-2">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </div>
  );
}

function SubmitBtn({ children }) {
  return (
    <button
      type="button"
      className="w-full bg-eco-forest dark:bg-eco-earth dark:text-eco-darkBg text-white font-bold tracking-widest text-xs uppercase py-3.5 rounded-lg shadow mt-2 hover:opacity-90 transition-opacity"
    >
      {children}
    </button>
  );
}

function PickupForm({ onSubmit }) {
  return (
    <div className="space-y-4">
      
        
      <button
        type="button"
        onClick={onSubmit}
        className="w-full bg-eco-forest dark:bg-eco-earth dark:text-eco-darkBg text-white font-bold tracking-widest text-xs uppercase py-3.5 rounded-lg shadow mt-2 hover:opacity-90 transition-opacity"
      >
        Submit pickup request →
      </button>
      <p className="text-center text-eco-sage/50 dark:text-eco-sage/40 text-xs">
        You'll need to log in to complete your pickup request.
      </p>
    </div>
  );
}

function SupportForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Name</FieldLabel><input className={inputCls} type="text" placeholder="Your name" /></div>
        <div><FieldLabel>Email</FieldLabel><input className={inputCls} type="email" placeholder="you@email.com" /></div>
        <div>
          <FieldLabel>Issue type</FieldLabel>
          <select className={inputCls}>
            <option value="">Select issue</option>
            <option>Missed pickup</option>
            <option>Bin overflow</option>
            <option>App / login issue</option>
            <option>Billing query</option>
            <option>Other</option>
          </select>
        </div>
        <div><FieldLabel>Ticket ID (optional)</FieldLabel><input className={inputCls} type="text" placeholder="ECB-00123" /></div>
      </div>
      <div>
        <FieldLabel>Describe the issue</FieldLabel>
        <textarea className={inputCls} rows={4} placeholder="What happened, when, and where..." />
      </div>
      <SubmitBtn>Submit support ticket →</SubmitBtn>
      <p className="text-center text-eco-sage/50 dark:text-eco-sage/40 text-xs">
        Our team responds within 2 hours on business days, 4 hours on weekends.
      </p>
    </div>
  );
}

function PartnerForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Contact name</FieldLabel><input className={inputCls} type="text" placeholder="Your name" /></div>
        <div><FieldLabel>Organisation</FieldLabel><input className={inputCls} type="text" placeholder="Municipality / Company name" /></div>
        <div><FieldLabel>Email</FieldLabel><input className={inputCls} type="email" placeholder="contact@org.com" /></div>
        <div>
          <FieldLabel>Partnership type</FieldLabel>
          <select className={inputCls}>
            <option value="">Select type</option>
            <option>Municipal contract</option>
            <option>Technology integration</option>
            <option>Collector fleet onboarding</option>
            <option>Investment / funding</option>
          </select>
        </div>
        <div><FieldLabel>City / Region</FieldLabel><input className={inputCls} type="text" placeholder="Chennai, Tamil Nadu" /></div>
        <div>
          <FieldLabel>Expected scale</FieldLabel>
          <select className={inputCls}>
            <option value="">Population / fleet size</option>
            <option>Under 50,000 residents</option>
            <option>50k – 500k</option>
            <option>500k – 2M</option>
            <option>2M+</option>
          </select>
        </div>
      </div>
      <div>
        <FieldLabel>Tell us about your goals</FieldLabel>
        <textarea className={inputCls} rows={3} placeholder="What problem are you trying to solve with EcoBin?" />
      </div>
      <SubmitBtn>Send partnership enquiry →</SubmitBtn>
      <p className="text-center text-eco-sage/50 dark:text-eco-sage/40 text-xs">
        Our partnerships team will reach out within 24 hours to schedule an intro call.
      </p>
    </div>
  );
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="text-eco-forest dark:text-white">

      {/* ── Hero ── */}
      <motion.section variants={fadeUpVariant} className="relative px-6 md:px-16 py-20 border-b border-eco-sage/20 dark:border-eco-sage/10 overflow-hidden">
        {/* bg decorations — visible in dark mode only */}
        <div className="pointer-events-none absolute right-0 top-0 w-96 h-96 rounded-full border border-dashed border-eco-sage/10 -translate-y-1/4 translate-x-1/4 hidden dark:block" />
        <div className="pointer-events-none absolute right-20 top-20 w-64 h-64 rounded-full border border-dashed border-eco-sage/5 hidden dark:block" />
        <div className="pointer-events-none absolute right-40 top-24 w-3 h-3 rounded-full bg-eco-emerald hidden dark:block" />
        <div className="pointer-events-none absolute right-64 top-56 w-2 h-2 rounded-full bg-eco-emerald opacity-50 hidden dark:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
          <div>
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-eco-emerald bg-eco-forest/10 dark:bg-eco-forest border border-eco-sage/20 px-4 py-1.5 rounded-full mb-5">
              Get in touch
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-eco-forest dark:text-white leading-tight">
              Let's build a<br />
              <span className="text-eco-emerald">cleaner city</span><br />
              together.
            </h2>
            <p className="text-eco-mint dark:text-eco-sage mt-5 text-base leading-relaxed max-w-sm">
              Whether you're a citizen, a municipality, or a waste management partner — we're ready to connect.
            </p>
            <div className="flex gap-8 mt-10">
              {[["24/7", "Support lines"], ["<2h", "Response time"], ["50+", "Cities served"]].map(([num, lbl]) => (
                <div key={lbl} className="border-l-2 border-eco-emerald pl-4">
                  <div className="font-display text-2xl font-bold text-eco-emerald">{num}</div>
                  <div className="text-xs uppercase tracking-wider text-eco-sage/60 mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {contactCards.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 bg-eco-sage/5 dark:bg-eco-charcoal border border-eco-sage/20 dark:border-eco-sage/10 rounded-2xl p-4 hover:border-eco-emerald/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-eco-forest border border-eco-sage/20 flex items-center justify-center text-lg shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-eco-forest dark:text-white">{c.title}</div>
                  <div className="text-sm text-eco-sage mt-0.5">{c.value}</div>
                  <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-eco-forest/10 dark:bg-eco-forest text-eco-emerald border border-eco-sage/20 px-2.5 py-0.5 rounded-full mt-1.5">
                    {c.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 px-6 md:px-16 py-6">
        <div className="flex-1 h-px bg-eco-sage/20 dark:bg-eco-sage/10" />
        <span className="text-xs uppercase tracking-widest text-eco-sage/40">Send us a message</span>
        <div className="flex-1 h-px bg-eco-sage/20 dark:bg-eco-sage/10" />
      </div>

      {/* ── Tabbed forms ── */}
      <motion.section variants={fadeUpVariant} className="px-6 md:px-16 pb-6 max-w-6xl mx-auto">
        <div className="flex border-b border-eco-sage/20 dark:border-eco-sage/10 mb-8 gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`text-xs font-bold uppercase tracking-widest px-6 py-3 border-b-2 -mb-px transition-colors ${
                activeTab === i
                  ? "text-eco-emerald border-eco-emerald"
                  : "text-eco-sage/40 border-transparent hover:text-eco-sage"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 0 && <PickupForm onSubmit={() => navigate("/login")} />}
        {activeTab === 1 && <SupportForm />}
        {activeTab === 2 && <PartnerForm />}
      </motion.section>

      {/* ── Why contact us ── */}
      <motion.div variants={fadeUpVariant} className="border-t border-eco-sage/20 dark:border-eco-sage/10 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-16 py-10">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="text-center bg-eco-sage/5 dark:bg-eco-charcoal border border-eco-sage/20 dark:border-eco-sage/10 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{r.icon}</div>
              <div className="text-sm font-semibold text-eco-forest dark:text-white">{r.title}</div>
              <div className="text-xs text-eco-sage mt-1.5 leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Testimonials carousel ── */}
      <motion.section variants={fadeUpVariant} className="px-6 md:px-16 py-10 border-t border-eco-sage/20 dark:border-eco-sage/10">
        <p className="text-xs uppercase tracking-widest text-eco-sage/40 mb-5">
          What people say about reaching out
        </p>
        <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="shrink-0 w-72 bg-eco-sage/5 dark:bg-eco-charcoal border border-eco-sage/20 dark:border-eco-sage/10 rounded-2xl p-5"
            >
              <Stars count={t.stars} />
              <p className="text-sm text-eco-sage leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-5">
                <div className="w-8 h-8 rounded-full bg-eco-forest/10 dark:bg-eco-forest border border-eco-emerald/20 flex items-center justify-center text-xs font-bold text-eco-emerald shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-eco-forest dark:text-white">{t.name}</div>
                  <div className="text-xs text-eco-sage/50">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Office map ── */}
      <motion.section variants={fadeUpVariant} className="px-6 md:px-16 pb-16 border-t border-eco-sage/20 dark:border-eco-sage/10 pt-10">
        <div className="bg-eco-sage/5 dark:bg-eco-charcoal border border-eco-sage/20 dark:border-eco-sage/10 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <svg viewBox="0 0 340 200" className="w-full rounded-xl" xmlns="http://www.w3.org/2000/svg">
            <rect width="340" height="200" fill="#081510" rx="10" />
            <line x1="0" y1="100" x2="340" y2="100" stroke="#1e3028" strokeWidth="0.5" />
            <line x1="170" y1="0" x2="170" y2="200" stroke="#1e3028" strokeWidth="0.5" />
            <circle cx="210" cy="80" r="50" fill="none" stroke="#1e3028" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="210" cy="80" r="26" fill="#0f2318" stroke="#1e4a2a" strokeWidth="1" />
            <line x1="188" y1="80" x2="232" y2="80" stroke="#4ade80" strokeWidth="1.5" />
            <line x1="210" y1="58" x2="210" y2="102" stroke="#4ade80" strokeWidth="1.5" />
            <circle cx="210" cy="80" r="5" fill="#4ade80" />
            <circle cx="60" cy="140" r="4" fill="#4ade80" opacity="0.5" />
            <circle cx="290" cy="50" r="3" fill="#4ade80" opacity="0.4" />
            <circle cx="110" cy="55" r="3.5" fill="#4ade80" opacity="0.45" />
            <circle cx="300" cy="150" r="3" fill="#4ade80" opacity="0.35" />
            <text x="210" y="185" textAnchor="middle" fill="#3a5a48" fontFamily="sans-serif" fontSize="10">
              EcoBin HQ — Green District
            </text>
          </svg>
          <div>
            <h3 className="font-display text-2xl font-bold text-eco-forest dark:text-white mb-3">Our offices</h3>
            <p className="text-sm text-eco-sage leading-relaxed">
              EcoBin operates regional coordination centres across major urban clusters, with a central hub in Green District.
            </p>
            <div className="mt-6 space-y-3">
              {offices.map((o) => (
                <div key={o.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-eco-emerald shrink-0 ${o.dim}`} />
                  <div className="text-sm text-eco-sage">
                    <span className="text-eco-forest dark:text-white font-semibold">{o.label}</span> — {o.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}