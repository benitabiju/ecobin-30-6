import { motion } from 'framer-motion';

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Careers() {
 return (
 <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }} className="max-w-4xl mx-auto px-6 py-20 text-center">
 <motion.h2 variants={fadeUpVariant} className="font-display text-4xl font-bold text-primary mb-4">Shape the Green Frontier</motion.h2>
 <motion.p variants={fadeUpVariant} className="text-secondary max-w-xl mx-auto mb-12">
 Join an elite distributed team engineering structural software patterns aimed directly at global carbon drawdown pipelines.
 </motion.p>
 <motion.div variants={fadeUpVariant} className="text-left max-w-2xl mx-auto space-y-5">
 {['Lead Systems Architect (Rust / React)', 'Environmental Data Modeler', 'Product Designer (Sustainability Core)'].map((job, idx) => (
 <motion.div 
 whileHover={{ scale: 1.02 }}
 key={idx} 
 className="p-8 card-modern flex justify-between items-center cursor-pointer group hover:border-eco-emerald/50"
 >
 <span className="font-bold text-xl text-primary">{job}</span>
 <span className="text-sm font-bold tracking-widest uppercase text-eco-forest dark:text-eco-sage group-hover:text-eco-emerald transition-colors">Apply Now</span>
 </motion.div>
 ))}
 </motion.div>
 </motion.div>
 );
}