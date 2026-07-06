import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, LayoutDashboard, BarChart3, Leaf, Activity, Globe } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import platformMockup from '../assets/images/platform_mockup.png';

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
 return (
 <main className="min-h-screen">

 {/* 1. HERO CAROUSEL */}
 <HeroCarousel />

 {/* System Stats Mini-Bar */}
 <div className="bg-gray-50 dark:bg-black/40 border-b border-eco-sage/10 py-8">
 <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
 <div><strong className="block text-xl text-primary">6</strong><span className="text-xs text-secondary uppercase">Live Zones</span></div>
 <div><strong className="block text-xl text-primary">12,400+</strong><span className="text-xs text-secondary uppercase">Citizens Onboarded</span></div>
 <div><strong className="block text-xl text-primary">340</strong><span className="text-xs text-secondary uppercase">Smart Bins</span></div>
 <div><strong className="block text-xl text-primary">96%</strong><span className="text-xs text-secondary uppercase">On-time Rate</span></div>
 </div>
 </div>

 {/* 2. ROLES SECTION */}
 <motion.section
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin: "-100px" }}
 variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
 className="max-w-5xl mx-auto px-6 py-20"
 >
 <div className="text-center mb-16">
 <h2 className="font-display text-4xl font-bold text-primary mb-4">A Platform Built For Everyone</h2>
 <p className="text-secondary max-w-2xl mx-auto">Whether you're managing city-wide logistics or simply throwing away a cardboard box, EcoBin gives you the tools to track your impact.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[
 { title: "For Collectors", desc: "Routes built from real fill-levels, not fixed schedules.", detail: "No more guessing which bins are full. Collectors see live sensor data and a route prioritized by what actually needs picking up today.", btn: "Join as collector", Icon: Truck },
 { title: "For Administrators", desc: "One dashboard, every zone, every metric.", detail: "Track users, bins, collections, and recycling output in one place — with reporting your sustainability targets can actually stand on.", btn: "Request demo", Icon: LayoutDashboard }
 ].map((role, i) => (
 <motion.div variants={fadeUpVariant} key={i} className="group p-10 card-modern flex flex-col h-full relative overflow-hidden">
 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-eco-sage/10 rounded-full blur-3xl group-hover:bg-eco-sage/20 transition-colors duration-500"></div>
 
 <role.Icon className="w-12 h-12 mb-6 text-secondary group-hover:scale-110 transition-transform duration-300 relative z-10" strokeWidth={1.5} />
 <h3 className="font-display font-bold text-3xl text-primary mb-3 relative z-10">{role.title}</h3>
 <p className="font-bold text-secondary mb-4 relative z-10">{role.desc}</p>
 <p className="text-sm text-secondary dark:text-muted leading-relaxed mb-8 flex-1 relative z-10">{role.detail}</p>
 <Link to="/login" className="btn-primary w-fit relative z-10 uppercase text-xs">
 {role.btn}
 </Link>
 </motion.div>
 ))}
 </div>
 </motion.section>

 {/* 3. LIVE WIDGET & IMPACT SECTION */}
 <motion.section
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin: "-100px" }}
 variants={fadeUpVariant}
 className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
 >
 <div>
 <span className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs mb-4">
 <Activity size={16} className="animate-pulse" /> Live Metrics
 </span>
 <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight">
 The impact so far
 </h2>
 <p className="text-secondary text-lg mb-10 leading-relaxed">
 Every completed pickup feeds real environmental reporting — so the numbers behind your city's sustainability goals are backed by hard data, not estimates.
 </p>
 <div className="flex flex-wrap gap-8 lg:gap-12 mb-10">
 <div className="relative">
 <div className="absolute -inset-4 bg-eco-sage/10 rounded-full blur-xl"></div>
 <span className="relative block text-5xl font-extrabold text-secondary drop-shadow-sm mb-1">186<span className="text-3xl">t</span></span>
 <span className="relative text-sm text-muted font-bold uppercase tracking-wider">Recycled</span>
 </div>
 <div className="relative">
 <div className="absolute -inset-4 bg-eco-earth/10 rounded-full blur-xl"></div>
 <span className="relative block text-5xl font-extrabold text-secondary dark:text-eco-earth drop-shadow-sm mb-1">94<span className="text-3xl">t</span></span>
 <span className="relative text-sm text-muted font-bold uppercase tracking-wider">CO₂ Saved</span>
 </div>
 </div>
 <Link to="/analytics" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all hover:text-secondary">
 View full analytics &rarr;
 </Link>
 </div>
 
 {/* PLATFORM MOCKUP IMAGE */}
 <motion.div 
 className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-eco-sage/20 group"
 whileHover={{ scale: 1.02 }}
 transition={{ duration: 0.4 }}
 >
 <div className="absolute inset-0 bg-gradient-to-tr from-eco-sage/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
 <img src={platformMockup} alt="EcoBin Dashboard Interface" className="w-full h-auto object-cover relative z-0" />
 </motion.div>
 </motion.section>

 {/* 4. HOW IT WORKS */}
 <section className="bg-eco-lightBg dark:bg-eco-darkBg border-y border-eco-sage/20 py-24 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-eco-sage/5 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-eco-mint/5 rounded-full blur-3xl pointer-events-none"></div>
 
 <div className="max-w-6xl mx-auto px-6 relative z-10">
 <div className="text-center mb-16">
 <h2 className="font-display text-4xl font-bold text-primary mb-4">How it works</h2>
 <p className="text-secondary dark:text-muted">A seamless loop from waste generation to environmental reporting.</p>
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 {s: '01', t: 'Submit request', d: 'Pick a bin, category, and date.'},
 {s: '02', t: 'Collector assigned', d: 'System matches optimal collector.'},
 {s: '03', t: 'Pickup collected', d: 'Weight logged on-site.'},
 {s: '04', t: 'Recycled & reported', d: 'Eco score updated instantly.'}
 ].map((step, i) => (
 <motion.div 
 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
 key={i} 
 className="p-8 card-modern relative group backdrop-blur-sm bg-white/90 dark:bg-eco-charcoal/90"
 >
 <span className="text-6xl font-extrabold text-eco-sage/10 absolute top-4 right-6 group-hover:text-eco-sage/20 transition-colors duration-300">{step.s}</span>
 <div className="w-12 h-12 rounded-full bg-eco-sage/20 flex items-center justify-center text-secondary font-bold mb-6 relative z-10 text-lg">{i+1}</div>
 <h4 className="font-bold text-xl text-primary relative z-10 mb-2">{step.t}</h4>
 <p className="text-sm text-muted relative z-10 leading-relaxed font-medium">{step.d}</p>
 </motion.div>
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
 <h2 className="font-display text-2xl font-bold text-primary mb-6">Waste Categories</h2>
 <ul className="space-y-4">
 {['Organic', 'Recyclables', 'Hazardous', 'General'].map((cat, i) => (
 <li key={i} className="p-4 bg-white dark:bg-eco-charcoal rounded-lg border border-eco-sage/20 text-sm">
 <strong>CAT-0{i+1} {cat}:</strong> Description of waste stream.
 </li>
 ))}
 </ul>
 </div>
 <div>
 <h2 className="font-display text-2xl font-bold text-primary mb-6">Platform Benefits</h2>
 <ul className="space-y-6 text-sm text-secondary">
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
 <h2 className="font-display text-3xl font-bold text-primary text-center mb-2">The team behind</h2>
 <p className="text-sm text-secondary text-center mb-12">The people building EcoBin from the ground up.</p>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
 {['Benita Biju', 'Bala Vishnu', 'Keerthana', 'Sivanesan', 'Anand Mukesh'].map((name, i) => (
 <div key={i} className="flex flex-col items-center text-center p-8 card-modern">
 <div className="w-16 h-16 rounded-full bg-eco-forest text-white flex items-center justify-center font-bold text-xl mb-4 shadow-inner">
 {name.split(' ').map(n => n[0]).join('')}
 </div>
 <h4 className="font-bold text-primary text-sm">{name}</h4>
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
 <div className="card-modern flex flex-col md:flex-row overflow-hidden border-none shadow-2xl">
 <div className="p-12 md:w-5/12 bg-gray-50/50 dark:bg-black/20 flex flex-col justify-center">
 <h2 className="font-display text-4xl font-bold text-primary mb-4 leading-tight">Bring EcoBin to your city.</h2>
 <p className="text-base text-secondary">Reach out to our team for a demo.</p>
 </div>
 <div className="p-12 md:w-7/12">
 <form className="flex flex-col gap-5">
 <input className="input-modern" placeholder="Name" />
 <textarea className="input-modern" placeholder="Message" rows="4"></textarea>
 <button className="btn-primary self-start mt-2">Send message</button>
 </form>
 </div>
 </div>
 </motion.section>
 </main>
 );
}
