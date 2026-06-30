import React from 'react';
import { motion } from 'framer-motion';
import { Truck, LayoutDashboard, BarChart3 } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel />

      {/* System Stats Mini-Bar */}
      <div className="bg-gray-50 dark:bg-black/40 border-b border-eco-sage/10 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><strong className="block text-xl text-eco-forest dark:text-white">6</strong><span className="text-xs text-eco-mint dark:text-eco-sage uppercase">Live Zones</span></div>
          <div><strong className="block text-xl text-eco-forest dark:text-white">12,400+</strong><span className="text-xs text-eco-mint dark:text-eco-sage uppercase">Citizens Onboarded</span></div>
          <div><strong className="block text-xl text-eco-forest dark:text-white">340</strong><span className="text-xs text-eco-mint dark:text-eco-sage uppercase">Smart Bins</span></div>
          <div><strong className="block text-xl text-eco-forest dark:text-white">96%</strong><span className="text-xs text-eco-mint dark:text-eco-sage uppercase">On-time Rate</span></div>
        </div>
      </div>

      {/* 2. ROLES SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "For collectors", desc: "Routes built from real fill-levels, not fixed schedules.", detail: "No more guessing which bins are full. Collectors see live sensor data and a route prioritized by what actually needs picking up today.", btn: "Join as collector", Icon: Truck },
            { title: "For administrators", desc: "One dashboard, every zone, every metric.", detail: "Track users, bins, collections, and recycling output in one place — with reporting your sustainability targets can actually stand on.", btn: "Request demo", Icon: LayoutDashboard }
          ].map((role, i) => (
            <div key={i} className="p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-sm flex flex-col h-full">
              <role.Icon className="w-12 h-12 mb-6 text-eco-forest dark:text-eco-sage" strokeWidth={1.5} />
              <h3 className="font-display font-bold text-2xl text-eco-forest dark:text-white mb-2">{role.title}</h3>
              <p className="font-medium text-eco-emerald dark:text-eco-sage mb-4">{role.desc}</p>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed mb-8 flex-1">{role.detail}</p>
              <button className="px-4 py-2 bg-eco-forest text-white rounded-md text-sm font-medium w-fit">{role.btn}</button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. LIVE WIDGET & IMPACT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-4">The impact so far</h2>
          <p className="text-eco-mint dark:text-eco-sage mb-8">Every completed pickup feeds real environmental reporting — so the numbers behind your city's sustainability goals are backed by data, not estimates.</p>
          <div className="flex gap-8 mb-8">
            <div><span className="block text-4xl font-extrabold text-[#74A980]">186t</span><span className="text-sm text-eco-mint dark:text-eco-sage uppercase">Recycled</span></div>
            <div><span className="block text-4xl font-extrabold text-[#74A980]">94t</span><span className="text-sm text-eco-mint dark:text-eco-sage uppercase">CO₂ Saved</span></div>
          </div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-block text-[#74A980]"
          >
            <BarChart3 className="w-20 h-20" strokeWidth={1.5} />
          </motion.div>
        </div>
        <div className="p-6 bg-[#0A1220] rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-white font-bold mb-6">Live Preview: Zone 4</h3>
          <ul className="space-y-4">
            {[{id: 'BIN-1042', fill: 88}, {id: 'BIN-1043', fill: 54}, {id: 'BIN-1047', fill: 31}].map((bin, i) => (
              <li key={i} className="flex items-center gap-4 text-sm text-slate-300">
                <span className="w-20 font-mono">{bin.id}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width: `${bin.fill}%`}}></div></div>
                <span className="w-10 text-right">{bin.fill}%</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-gray-50 dark:bg-eco-charcoal/30 border-y border-eco-sage/10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {s: '01', t: 'Submit request', d: 'Pick a bin, category, and date.'},
              {s: '02', t: 'Collector assigned', d: 'System matches optimal collector.'},
              {s: '03', t: 'Pickup collected', d: 'Weight logged on-site.'},
              {s: '04', t: 'Recycled & reported', d: 'Eco score updated instantly.'}
            ].map((step, i) => (
              <div key={i} className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20 relative">
                <span className="text-4xl font-extrabold text-eco-sage/20 absolute top-2 right-4">{step.s}</span>
                <h4 className="font-bold text-eco-forest dark:text-white mt-4">{step.t}</h4>
                <p className="text-sm text-eco-mint dark:text-eco-sage mt-2">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CATEGORIES & BENEFITS */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16"
      >
        <div>
          <h2 className="font-display text-2xl font-bold text-eco-forest dark:text-white mb-6">Waste Categories</h2>
          <ul className="space-y-4">
            {['Organic', 'Recyclables', 'Hazardous', 'General'].map((cat, i) => (
              <li key={i} className="p-4 bg-white dark:bg-eco-charcoal rounded-lg border border-eco-sage/20 text-sm">
                <strong>CAT-0{i+1} {cat}:</strong> Description of waste stream.
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-eco-forest dark:text-white mb-6">Platform Benefits</h2>
          <ul className="space-y-6 text-sm text-eco-mint dark:text-eco-sage">
            <li><strong>Fewer missed pickups</strong> Structured requests replace phone-based reporting.</li>
            <li><strong>Higher recycling</strong> Real-time impact tracking keeps users engaged.</li>
            <li><strong>Less wasted travel</strong> Routes built on fill-levels, not fixed schedules.</li>
          </ul>
        </div>
      </motion.section>

      {/* 6. TESTIMONIALS */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-eco-forest text-white py-20"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-12">What the field is saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Citizen', 'Collector', 'Admin'].map((role, i) => (
              <blockquote key={i} className="p-6 bg-white/10 rounded-xl border border-white/20">
                <p className="text-sm italic mb-4">"It works seamlessly, finally an automated system."</p>
                <footer className="text-xs font-bold text-eco-sage uppercase">— {role}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TEAM SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white text-center mb-2">The team behind</h2>
        <p className="text-sm text-eco-mint dark:text-eco-sage text-center mb-12">The people building EcoBin from the ground up.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {['Benita Biju', 'Bala Vishnu', 'Keerthana', 'Sivanesan', 'Anand Mukesh'].map((name, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-eco-forest text-white flex items-center justify-center font-bold text-lg mb-4">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="font-bold text-eco-forest dark:text-white text-sm">{name}</h4>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. CONTACT */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        <div className="bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-lg flex flex-col md:flex-row overflow-hidden">
          <div className="p-10 md:w-5/12 bg-gray-50 dark:bg-black/20">
            <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-4">Bring EcoBin to your city.</h2>
            <p className="text-sm text-eco-mint dark:text-eco-sage">Reach out to our team for a demo.</p>
          </div>
          <div className="p-10 md:w-7/12">
            <form className="flex flex-col gap-4">
              <input className="p-3 bg-gray-50 dark:bg-black/30 border rounded-lg" placeholder="Name" />
              <textarea className="p-3 bg-gray-50 dark:bg-black/30 border rounded-lg" placeholder="Message" rows="3"></textarea>
              <button className="py-3 bg-eco-forest text-white font-bold rounded-lg">Send message</button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
