import { motion } from 'framer-motion';

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
 return (
 <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
 {/* 1. Mission Section */}
 <motion.div variants={fadeUpVariant} className="max-w-4xl mx-auto px-6 pt-20 pb-10">
 <h2 className="font-display text-4xl font-bold text-primary mb-6">Our Mission</h2>
 <p className="text-secondary text-lg mb-6 leading-relaxed">
 Founded with a vision of a waste-free future, EcoBin scales state-of-the-art ecological intelligence tools to map, track, and eliminate resource inefficiencies across urban infrastructures.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
 <motion.div variants={fadeUpVariant} className="p-10 card-modern">
 <h3 className="font-bold text-2xl mb-3 text-primary dark:text-eco-earth">Global Impact</h3>
 <p className="text-sm text-secondary leading-relaxed">Deploying regional carbon-reduction frameworks that actively save megatons of landfill debris annually.</p>
 </motion.div>
 <motion.div variants={fadeUpVariant} className="p-10 card-modern">
 <h3 className="font-bold text-2xl mb-3 text-primary dark:text-eco-earth">Modern Integrity</h3>
 <p className="text-sm text-secondary leading-relaxed">Every metrics pipeline is cryptographically verifiable, ensuring perfect transparency for corporate audit requirements.</p>
 </motion.div>
 </div>
 </motion.div>

 {/* 2. Our Story Section */}
 <motion.section variants={fadeUpVariant} className="max-w-4xl mx-auto px-6 py-10 about-extended-content">
 <h2 className="font-display text-3xl font-bold text-primary mb-2">Our Story</h2>
 <h3 className="text-xl text-secondary mb-6">From one overflowing bin to a city-wide system.</h3>

 <div className="story-timeline flex flex-col gap-6">
 <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
 <h4 className="font-bold text-primary">01 The problem was obvious</h4>
 <p className="text-sm text-secondary mt-1">A small team kept hearing the same complaint from every ward office: nobody knew which bins were full until someone called to complain.</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
 <h4 className="font-bold text-primary">02 We started with one zone</h4>
 <p className="text-sm text-secondary mt-1">EcoBin launched as a pilot in a single collection zone — just enough sensors and structure to prove that data-routed pickups actually worked.</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
 <h4 className="font-bold text-primary">03 Collectors shaped the product</h4>
 <p className="text-sm text-secondary mt-1">Early routing logic came directly from collectors' own habits — which streets to batch, which hours to avoid. We built the software around how the job already worked.</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
 <h4 className="font-bold text-primary">04 Now it's a full platform</h4>
 <p className="text-sm text-secondary mt-1">Six zones, hundreds of smart bins, and three role-based dashboards later, EcoBin is the system of record for collection, recycling, and reporting.</p>
 </div>
 </div>

 <div className="about-metrics my-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
 {[
 { label: 'Citizens Onboarded', value: '12,400+' },
 { label: 'Smart Bins Live', value: '340' },
 { label: 'Collection Zones', value: '6 Live Zones' },
 { label: 'Active Collectors', value: '96% Efficient' }
 ].map((stat, i) => (
 <motion.div variants={fadeUpVariant} key={i} className="p-8 card-modern hover:border-eco-sage transition-colors">
 <span className="block text-xs text-secondary uppercase tracking-wider font-bold mb-2">{stat.label}</span>
 <strong className="text-3xl font-extrabold text-primary dark:text-eco-earth">{stat.value}</strong>
 </motion.div>
 ))}
 </div>

 {/* 4. Careers CTA */}
 <section className="team-hiring-cta mb-12">
 <h3 className="font-bold text-xl text-primary mb-2">We're a small team and we're hiring.</h3>
 <p className="text-secondary">
 Interested in civic infrastructure? <a href="/careers" className="text-primary underline font-medium hover:no-underline">See open roles →</a>
 </p>
 </section>

 {/* 5. Get Involved Panel */}
 <motion.section variants={fadeUpVariant} className="get-involved mt-16 p-12 bg-gray-50 dark:bg-eco-charcoal/50 rounded-3xl border border-eco-sage/20 shadow-inner">
 <h2 className="font-display text-4xl font-bold text-primary mb-2">Get Involved</h2>
 <h3 className="text-xl text-secondary mb-6">Bring ECOBIN to your city.</h3>
 <p className="text-secondary mb-8 text-lg">Whether you're a resident, a collector, or running a ward office — there's a dashboard built for you.</p>
 <div className="flex flex-col sm:flex-row gap-4">
 <button onClick={() => window.location.href='/login'} className="btn-primary">
 Get started
 </button>
 <button
 onClick={() => window.location.href = '/contact'}
 className="btn-secondary"
 >
 Contact us
 </button>
 </div>
 </motion.section>
 </motion.section>
 </motion.div>
 );
}