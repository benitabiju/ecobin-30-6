export default function Categories() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header Section */}
        <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white mb-4">
          Waste Categories
        </h2>
        <p className="text-eco-mint dark:text-eco-sage text-lg mb-10 leading-relaxed">
          Sorted right, from the start. Every pickup request is tagged by category, so collection and recycling stay accountable from the bin to the depot. One tag, one destination determines routing, handling, and where the load ends up.
        </p>

        {/* Dynamic Category List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {[
            { tag: "CAT-01", name: "Organic", desc: "Food scraps and garden waste, routed to composting facilities." },
            { tag: "CAT-02", name: "Recyclables", desc: "Paper, plastic, glass, and metal — sorted at the recycling center." },
            { tag: "CAT-03", name: "Hazardous", desc: "Batteries, chemicals, and e-waste, handled under special protocol." },
            { tag: "CAT-04", name: "General", desc: "Non-recyclable household waste headed to standard disposal." }
          ].map((cat, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-eco-emerald bg-eco-earth/30 dark:bg-eco-mint/20 py-1 px-2.5 rounded">
                    {cat.tag}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-eco-sage/60 font-medium">Active Standard</span>
                </div>
                <h4 className="font-bold text-xl text-eco-forest dark:text-white mb-1">{cat.name}</h4>
                <p className="text-sm text-eco-mint dark:text-eco-sage">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What Goes Where Deep Dive */}
        <section className="categories-deep-dive mt-16 border-t border-eco-sage/10 pt-12">
          <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">What Goes Where</h2>
          <p className="text-sm text-eco-mint dark:text-eco-sage mb-8">A granular breakdown of acceptable materials inside each dispatch streamline.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-eco-charcoal/30">
              <h3 className="font-bold text-lg text-eco-forest dark:text-white mb-2">01 Organic</h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Food scraps, garden trimmings, and tea or coffee waste.
                Collected separately and routed to composting facilities — keep
                it free of plastic bags or wrappers.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-eco-charcoal/30">
              <h3 className="font-bold text-lg text-eco-forest dark:text-white mb-2">02 Recyclables</h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Paper, cardboard, clean plastic, glass, and metal. Sorted
                further at the recycling center — rinse containers where you
                can, it improves recovery rates.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-eco-charcoal/30">
              <h3 className="font-bold text-lg text-eco-forest dark:text-white mb-2">03 Hazardous</h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Batteries, light bulbs, chemicals, paint, and e-waste. Flagged
                for special handling on pickup — never bag this in with general
                or recyclable waste.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-eco-charcoal/30">
              <h3 className="font-bold text-lg text-eco-forest dark:text-white mb-2">04 General</h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Anything that doesn't fit the other three — non-recyclable
                packaging, soiled materials, and miscellaneous household waste
                headed to standard disposal.
              </p>
            </div>
          </div>

          {/* Sorting Tips Panel */}
          <section className="sorting-tips bg-[#f4fbf7] dark:bg-eco-charcoal p-8 rounded-xl border border-eco-sage/20 mt-12">
            <h2 className="font-display text-2xl font-bold text-eco-forest dark:text-white mb-1">Sorting Tips</h2>
            <h3 className="text-lg font-medium text-eco-emerald dark:text-eco-sage mb-3">Get it right before pickup.</h3>
            <p className="text-sm text-eco-mint dark:text-eco-sage mb-6">
              Better sorting at the bin means faster collection and a higher
              recycling rate for your zone.
            </p>

            <ul className="flex flex-col gap-4 text-sm text-eco-mint dark:text-eco-sage">
              <li className="p-3 bg-white dark:bg-black/20 rounded-lg">
                <strong className="text-eco-forest dark:text-white block md:inline mr-1">TIP 01 Rinse before you recycle:</strong> A quick rinse
                on containers keeps recyclables from being downgraded to general
                waste at the sorting stage.
              </li>
              <li className="p-3 bg-white dark:bg-black/20 rounded-lg">
                <strong className="text-eco-forest dark:text-white block md:inline mr-1">TIP 02 Bag hazardous separately:</strong> Batteries and
                e-waste should never go in with general or recyclable bags —
                flag them as Hazardous when requesting a pickup.
              </li>
              <li className="p-3 bg-white dark:bg-black/20 rounded-lg">
                <strong className="text-eco-forest dark:text-white block md:inline mr-1">TIP 03 Compost what you can:</strong> Food scraps and
                garden waste collected as Organic are diverted from landfill
                entirely — it's the single biggest lever on your eco score.
              </li>
              <li className="p-3 bg-white dark:bg-black/20 rounded-lg">
                <strong className="text-eco-forest dark:text-white block md:inline mr-1">TIP 04 When in doubt, ask:</strong> Not sure where
                something goes? Check the FAQ or flag it as General — a
                collector can re-sort it on pickup if needed.
              </li>
            </ul>
          </section>

          {/* Bottom Action Section */}
          <div className="category-cta text-center my-12 p-8 border border-dashed border-eco-sage/30 rounded-xl">
            <h3 className="font-bold text-xl text-eco-forest dark:text-white mb-2">Ready to sort? Request your next pickup.</h3>
            <p className="text-sm text-eco-mint dark:text-eco-sage mb-6">
              Pick a category, a bin, and a date — EcoBin handles the rest.
            </p>

            <div className="flex gap-4 justify-center">
              <button className="px-5 py-2.5 bg-eco-forest text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                Request a pickup
              </button>
              <button 
                onClick={() => (window.location.href = "/faq")}
                className="px-5 py-2.5 border border-eco-forest/30 text-eco-forest dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Read the FAQ
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}