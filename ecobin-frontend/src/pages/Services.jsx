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
        <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white text-center mb-12">
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
              className="p-8 bg-white dark:bg-eco-charcoal rounded-3xl border border-eco-sage/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="font-display font-bold text-xl text-eco-forest dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Premium-tier environmental coordination tailored directly to high-capacity municipal and private organizations.
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 2. Platform Core Capabilities Scope */}
      <motion.section variants={fadeUpVariant} className="max-w-5xl mx-auto px-6 py-12 border-t border-eco-sage/10 services-scope">
        <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">What's Included</h2>
        <h3 className="text-xl font-medium text-eco-emerald dark:text-eco-sage mb-2">Everything from request to recycled.</h3>
        <p className="text-sm text-eco-mint dark:text-eco-sage mb-10">Six core capabilities power every dashboard on the platform.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
          {[
            { title: 'Pickup requests', desc: 'Citizens schedule a pickup by bin, category, and date — then track it from Pending through Recycled.' },
            { title: 'Live bin fill-levels', desc: 'Sensor-backed fill data lets routes get prioritized by need, not a fixed weekly schedule.' },
            { title: 'Area-based dispatch', desc: 'Collectors are assigned by zone and availability, with new requests pushed straight to their dashboard.' },
            { title: 'Recycling records', desc: 'Every completed collection can produce a recycling record — weight, center, and date — tied back to the source request.' },
            { title: 'Admin oversight', desc: 'One console for users, bins, categories, assignments, feedback, and a full audit trail of system actions.' },
            { title: 'Impact reporting', desc: 'Recycling rate, collection volume, and CO₂ saved roll up automatically for sustainability reporting.' },
          ].map((item, i) => (
            <motion.div variants={fadeUpVariant} key={i} className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/10 shadow-sm hover:border-eco-emerald/50 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-eco-forest dark:text-white mb-3 text-lg">{item.title}</h4>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 3. Action Footer Container */}
        <motion.div variants={fadeUpVariant} className="services-action-footer text-center mt-16 p-12 bg-gray-50 dark:bg-eco-charcoal/50 rounded-3xl border border-eco-sage/20">
          <h3 className="font-display font-bold text-3xl text-eco-forest dark:text-white mb-4">Ready when you are: Pick a role, get started.</h3>
          <p className="text-base text-eco-mint dark:text-eco-sage mb-8 max-w-2xl mx-auto leading-relaxed">
            Citizens, collectors, and administrators all sign up through the same form — EcoBin sets up the right dashboard automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3.5 bg-eco-forest text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-all glow-emerald">
              Get started
            </button>
            <button 
              onClick={() => window.location.href='/categories'}
              className="px-8 py-3.5 border border-eco-forest text-eco-forest dark:border-white/30 dark:text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-eco-sage/10 transition-colors"
            >
              See waste categories
            </button>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}