import { motion } from 'framer-motion';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Categories() {
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header Section */}
        <motion.div variants={fadeUpVariant}>
          <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white mb-4">
            Waste Categories
          </h2>
          <p className="text-eco-mint dark:text-eco-sage text-lg mb-10 leading-relaxed">
            Sorted right, from the start. Every pickup request is tagged by category, so collection and recycling stay accountable from the bin to the depot. One tag, one destination determines routing, handling, and where the load ends up.
          </p>
        </motion.div>

        {/* Dynamic Category List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { tag: "CAT-01", name: "Organic", desc: "Food scraps and garden waste, routed to composting facilities." },
            { tag: "CAT-02", name: "Recyclables", desc: "Paper, plastic, glass, and metal — sorted at the recycling center." },
            { tag: "CAT-03", name: "Hazardous", desc: "Batteries, chemicals, and e-waste, handled under special protocol." },
            { tag: "CAT-04", name: "General", desc: "Non-recyclable household waste headed to standard disposal." }
          ].map((cat, idx) => (
            <motion.div
              variants={fadeUpVariant}
              key={idx}
              className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 flex flex-col justify-between hover:shadow-xl hover:border-eco-emerald/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-eco-emerald bg-eco-earth/30 dark:bg-eco-mint/20 py-1.5 px-3 rounded-md uppercase tracking-wider">
                    {cat.tag}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-eco-sage/60 font-bold uppercase tracking-widest">Active Standard</span>
                </div>
                <h4 className="font-display font-bold text-2xl text-eco-forest dark:text-white mb-2">{cat.name}</h4>
                <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What Goes Where Deep Dive */}
        <motion.section variants={fadeUpVariant} className="categories-deep-dive mt-16 border-t border-eco-sage/10 pt-12">
          <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">What Goes Where</h2>
          <p className="text-base text-eco-mint dark:text-eco-sage mb-10">A granular breakdown of acceptable materials inside each dispatch streamline.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            {[
              { num: '01', title: 'Organic', desc: 'Food scraps, garden trimmings, and tea or coffee waste. Collected separately and routed to composting facilities — keep it free of plastic bags or wrappers.' },
              { num: '02', title: 'Recyclables', desc: 'Paper, cardboard, clean plastic, glass, and metal. Sorted further at the recycling center — rinse containers where you can, it improves recovery rates.' },
              { num: '03', title: 'Hazardous', desc: 'Batteries, light bulbs, chemicals, paint, and e-waste. Flagged for special handling on pickup — never bag this in with general or recyclable waste.' },
              { num: '04', title: 'General', desc: "Anything that doesn't fit the other three — non-recyclable packaging, soiled materials, and miscellaneous household waste headed to standard disposal." }
            ].map((item, idx) => (
              <motion.div variants={fadeUpVariant} key={idx} className="p-6 rounded-2xl bg-gray-50/50 dark:bg-eco-charcoal/30 border border-eco-sage/10 hover:border-eco-sage/30 transition-colors">
                <h3 className="font-bold text-xl text-eco-forest dark:text-white mb-3">
                  <span className="text-eco-emerald mr-2 font-display">{item.num}</span> {item.title}
                </h3>
                <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Sorting Tips Panel */}
          <motion.section variants={fadeUpVariant} className="sorting-tips bg-eco-sage/5 dark:bg-eco-charcoal/50 p-10 rounded-3xl border border-eco-sage/20 mt-16 shadow-inner">
            <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">Sorting Tips</h2>
            <h3 className="text-xl font-medium text-eco-emerald dark:text-eco-sage mb-4">Get it right before pickup.</h3>
            <p className="text-base text-eco-mint dark:text-eco-sage mb-8">
              Better sorting at the bin means faster collection and a higher recycling rate for your zone.
            </p>

            <ul className="flex flex-col gap-4 text-sm text-eco-mint dark:text-eco-sage">
              {[
                { tip: "TIP 01 Rinse before you recycle:", desc: "A quick rinse on containers keeps recyclables from being downgraded to general waste at the sorting stage." },
                { tip: "TIP 02 Bag hazardous separately:", desc: "Batteries and e-waste should never go in with general or recyclable bags — flag them as Hazardous when requesting a pickup." },
                { tip: "TIP 03 Compost what you can:", desc: "Food scraps and garden waste collected as Organic are diverted from landfill entirely — it's the single biggest lever on your eco score." },
                { tip: "TIP 04 When in doubt, ask:", desc: "Not sure where something goes? Check the FAQ or flag it as General — a collector can re-sort it on pickup if needed." }
              ].map((item, idx) => (
                <motion.li variants={fadeUpVariant} key={idx} className="p-4 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
                  <strong className="text-eco-forest dark:text-white block md:inline mr-2">{item.tip}</strong> 
                  {item.desc}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Bottom Action Section */}
          <motion.div variants={fadeUpVariant} className="category-cta text-center my-16 p-12 border border-dashed border-eco-sage/40 rounded-3xl bg-white/30 dark:bg-eco-charcoal/20">
            <h3 className="font-display font-bold text-3xl text-eco-forest dark:text-white mb-4">Ready to sort? Request your next pickup.</h3>
            <p className="text-base text-eco-mint dark:text-eco-sage mb-8">
              Pick a category, a bin, and a date — EcoBin handles the rest.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3.5 bg-eco-forest text-white rounded-lg text-sm font-bold tracking-widest uppercase transition-all glow-emerald">
                Request a pickup
              </button>
              <button 
                onClick={() => (window.location.href = "/faq")}
                className="px-8 py-3.5 border border-eco-forest text-eco-forest dark:border-white/30 dark:text-white rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-eco-sage/10 transition-colors"
              >
                Read the FAQ
              </button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
}