import { motion } from 'framer-motion';

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Services() {
 return (
 <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
 {/* 1. Enterprise Environmental Services */}
 <motion.div variants={fadeUpVariant} className="max-w-5xl mx-auto px-6 pt-20 pb-12">
 <h2 className="font-display text-4xl font-bold text-primary text-center mb-12">
 Enterprise Environmental Services
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { title: 'Smart Logistics Optimization', icon: '🤖' },
 { title: 'Regulatory Compliance Auditing', icon: '📋' },
 { title: 'Carbon Offset Asset Creation', icon: '🌱' }
 ].map((service, idx) => (
 <motion.div 
 variants={fadeUpVariant}
 key={idx} 
 className="p-10 card-modern text-center"
 >
 <div className="text-5xl mb-6">{service.icon}</div>
 <h3 className="font-display font-bold text-2xl text-primary mb-3">
 {service.title}
 </h3>
 <p className="text-sm text-secondary leading-relaxed">
 Premium-tier environmental coordination tailored directly to high-capacity municipal and private organizations.
 </p>
 </motion.div>
 ))}
 </div>
 </motion.div>

 {/* 2. Platform Core Capabilities Scope */}
 <motion.section variants={fadeUpVariant} className="max-w-5xl mx-auto px-6 py-12 border-t border-eco-sage/10 services-scope">
 <h2 className="font-display text-3xl font-bold text-primary mb-2">What's Included</h2>
 <h3 className="text-xl font-medium text-secondary mb-2">Everything from request to recycled.</h3>
 <p className="text-sm text-secondary mb-10">Six core capabilities power every dashboard on the platform.</p>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
 {[
 { title: 'Pickup requests', desc: 'Citizens schedule a pickup by bin, category, and date — then track it from Pending through Recycled.' },
 { title: 'Live bin fill-levels', desc: 'Sensor-backed fill data lets routes get prioritized by need, not a fixed weekly schedule.' },
 { title: 'Area-based dispatch', desc: 'Collectors are assigned by zone and availability, with new requests pushed straight to their dashboard.' },
 { title: 'Recycling records', desc: 'Every completed collection can produce a recycling record — weight, center, and date — tied back to the source request.' },
 { title: 'Admin oversight', desc: 'One console for users, bins, categories, assignments, feedback, and a full audit trail of system actions.' },
 { title: 'Impact reporting', desc: 'Recycling rate, collection volume, and CO₂ saved roll up automatically for sustainability reporting.' },
 ].map((item, i) => (
 <motion.div variants={fadeUpVariant} key={i} className="p-8 card-modern hover:border-eco-emerald/50">
 <h4 className="font-bold text-primary mb-3 text-xl">{item.title}</h4>
 <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
 </motion.div>
 ))}
 </div>

 {/* 3. Action Footer Container */}
 <motion.div variants={fadeUpVariant} className="services-action-footer text-center mt-16 p-12 bg-gray-50/50 dark:bg-eco-charcoal/50 rounded-3xl border border-eco-sage/20 shadow-inner">
 <h3 className="font-display font-bold text-4xl text-primary mb-4">Ready when you are: Pick a role, get started.</h3>
 <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
 Citizens, collectors, and administrators all sign up through the same form — EcoBin sets up the right dashboard automatically.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <button onClick={() => window.location.href='/login'} className="btn-primary">
 Get started
 </button>
 <button 
 onClick={() => window.location.href='/categories'}
 className="btn-secondary"
 >
 See waste categories
 </button>
 </div>
 </motion.div>
 </motion.section>
 </motion.div>
 );
}