import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
export default function Analytics() {
 return (
 <>
 <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }} className="max-w-5xl mx-auto px-6 pt-20 pb-12">
 {/* Top Hero / Chart Section */}
 <motion.h2 variants={fadeUpVariant} className="font-display text-4xl font-bold text-primary mb-8">System Analytics Core</motion.h2>
 <motion.div variants={fadeUpVariant} className="p-8 bg-eco-forest dark:bg-eco-charcoal text-white rounded-3xl border border-eco-sage/20 shadow-2xl mb-12 relative overflow-hidden group">
 <div className="absolute inset-0 bg-eco-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
 <div className="flex justify-between items-center mb-6 relative z-10">
 <div>
 <h3 className="text-xs uppercase tracking-widest text-eco-sage/80 font-bold">Net Diverted Waste</h3>
 <p className="text-4xl font-extrabold text-eco-earth mt-1 drop-shadow-sm">1,248,392 Tons</p>
 </div>
 <div className="text-right">
 <span className="text-xs bg-eco-earth/10 text-eco-earth border border-eco-earth/20 py-1 px-2 rounded font-mono font-bold">+14.2% MoM</span>
 </div>
 </div>
 <div className="h-32 bg-black/40 rounded-xl border border-eco-sage/10 flex items-end justify-between p-4 gap-2 relative z-10">
 {[40, 55, 45, 60, 75, 50, 90, 85, 100].map((val, idx) => (
 <div 
 key={idx} 
 style={{ height: `${val}%` }} 
 className="w-full bg-gradient-to-t from-eco-emerald to-eco-earth rounded-t-sm opacity-90 transition-all duration-500 hover:opacity-100 hover:shadow-[0_0_15px_rgba(236,243,158,0.5)] cursor-pointer" 
 />
 ))}
 </div>
 </motion.div>

 {/* Matrices Section */}
 <motion.section variants={fadeUpVariant} className="analytics-matrices border-t border-eco-sage/20 pt-12">
 <h2 className="font-display text-3xl font-bold text-primary mb-2">Scoped by Role</h2>
 <h3 className="text-xl font-medium text-secondary mb-4">The same data, three different views.</h3>
 <p className="text-secondary mb-10 max-w-2xl">
 Every account sees analytics relevant to its own job — nobody wades through metrics that aren't theirs.
 </p>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {/* Citizen Card */}
  <motion.div variants={fadeUpVariant} className="p-8 card-modern flex flex-col h-full">
  <h4 className="font-bold text-xl text-primary mb-4 pb-4 border-b border-eco-sage/10">Citizen View</h4>
  <p className="text-xs text-secondary mb-4 uppercase tracking-wider font-bold">Your recycling history</p>
  <ul className="flex-1 space-y-4 text-sm text-secondary mb-8 font-medium">
  <li className="flex justify-between"><span>Pickups this month</span> <strong className="text-primary text-base">4</strong></li>
  <li className="flex justify-between"><span>Recycling rate</span> <strong className="text-primary text-base">68%</strong></li>
  <li className="flex justify-between"><span>Eco score</span> <strong className="text-primary text-base">812</strong></li>
  </ul>
  <button className="w-full px-4 py-3 bg-eco-forest/10 dark:bg-white/5 text-primary rounded-xl text-sm font-bold hover:bg-eco-forest/20 dark:hover:bg-white/10 transition mt-auto">
  Preview dashboard
  </button>
  </motion.div>

  {/* Collector Card */}
  <motion.div variants={fadeUpVariant} className="p-8 card-modern flex flex-col h-full">
  <h4 className="font-bold text-xl text-primary mb-4 pb-4 border-b border-eco-sage/10">Collector View</h4>
  <p className="text-xs text-secondary mb-4 uppercase tracking-wider font-bold">Your coverage and load</p>
  <ul className="flex-1 space-y-4 text-sm text-secondary mb-8 font-medium">
  <li className="flex justify-between"><span>Routes completed</span> <strong className="text-primary text-base">12</strong></li>
  <li className="flex justify-between"><span>Avg. stops/day</span> <strong className="text-primary text-base">9</strong></li>
  <li className="flex justify-between"><span>On-time rate</span> <strong className="text-primary text-base">97%</strong></li>
  </ul>
  <button className="w-full px-4 py-3 bg-eco-forest/10 dark:bg-white/5 text-primary rounded-xl text-sm font-bold hover:bg-eco-forest/20 dark:hover:bg-white/10 transition mt-auto">
  Preview dashboard
  </button>
  </motion.div>

  {/* Admin Card */}
  <motion.div variants={fadeUpVariant} className="p-8 card-modern flex flex-col h-full">
  <h4 className="font-bold text-xl text-primary mb-4 pb-4 border-b border-eco-sage/10">Admin View</h4>
  <p className="text-xs text-secondary mb-4 uppercase tracking-wider font-bold">System-wide trends</p>
  <ul className="flex-1 space-y-4 text-sm text-secondary mb-8 font-medium">
  <li className="flex justify-between"><span>Active zones</span> <strong className="text-primary text-base">6</strong></li>
  <li className="flex justify-between"><span>CO₂ saved (YTD)</span> <strong className="text-primary text-base">94.2t</strong></li>
  <li className="flex justify-between"><span>System uptime</span> <strong className="text-primary text-base">99.2%</strong></li>
  </ul>
  <button className="w-full px-4 py-3 bg-eco-forest/10 dark:bg-white/5 text-primary rounded-xl text-sm font-bold hover:bg-eco-forest/20 dark:hover:bg-white/10 transition mt-auto">
  Preview dashboard
  </button>
  </motion.div>
 </div>

  {/* Bottom Call to Action */}
  <motion.div variants={fadeUpVariant} className="text-center p-12 bg-gray-50/50 dark:bg-eco-charcoal/50 rounded-3xl border border-eco-sage/20 shadow-inner">
  <h3 className="font-bold text-3xl text-primary mb-3">See it on your own data.</h3>
  <p className="text-base text-secondary mb-8 max-w-lg mx-auto">
  Request a demo for your city. We'll walk through the admin dashboard with your own zones and numbers.
  </p>
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link to="/login" className="btn-primary">
  Request a demo
  </Link>
  <button 
  onClick={() => window.location.href='/contact'}
  className="btn-secondary"
  >
  Contact us
  </button>
  </div>
  </motion.div>
 </motion.section>
 </motion.div>
 </>
 );
}