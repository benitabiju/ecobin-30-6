export default function Services() {
  return (
    <>
      {/* 1. Enterprise Environmental Services */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white text-center mb-12">
          Enterprise Environmental Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Smart Logistics Optimization', icon: '🤖' },
            { title: 'Regulatory Compliance Auditing', icon: '📋' },
            { title: 'Carbon Offset Asset Creation', icon: '🌱' }
          ].map((service, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="font-display font-bold text-lg text-eco-forest dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
                Premium-tier environmental coordination tailored directly to high-capacity municipal and private organizations.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Platform Core Capabilities Scope */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-eco-sage/10 services-scope">
        <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">What's Included</h2>
        <h3 className="text-xl font-medium text-eco-emerald dark:text-eco-sage mb-2">Everything from request to recycled.</h3>
        <p className="text-sm text-eco-mint dark:text-eco-sage mb-10">Six core capabilities power every dashboard on the platform.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Pickup requests</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              Citizens schedule a pickup by bin, category, and date — then track it from Pending through Recycled.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Live bin fill-levels</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              Sensor-backed fill data lets routes get prioritized by need, not a fixed weekly schedule.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Area-based dispatch</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              Collectors are assigned by zone and availability, with new requests pushed straight to their dashboard.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Recycling records</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              Every completed collection can produce a recycling record — weight, center, and date — tied back to the source request.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Admin oversight</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              One console for users, bins, categories, assignments, feedback, and a full audit trail of system actions.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/10 shadow-sm">
            <h4 className="font-bold text-eco-forest dark:text-white mb-2">Impact reporting</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage leading-relaxed">
              Recycling rate, collection volume, and CO₂ saved roll up automatically for sustainability reporting.
            </p>
          </div>
        </div>

        {/* 3. Action Footer Container */}
        <div className="services-action-footer text-center mt-12 p-8 bg-gray-50 dark:bg-eco-charcoal rounded-xl border border-eco-sage/20">
          <h3 className="font-bold text-xl text-eco-forest dark:text-white mb-2">Ready when you are: Pick a role, get started.</h3>
          <p className="text-sm text-eco-mint dark:text-eco-sage mb-6 max-w-2xl mx-auto">
            Citizens, collectors, and administrators all sign up through the same form — EcoBin sets up the right dashboard automatically.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-5 py-2.5 bg-eco-forest text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
              Get started
            </button>
            <button 
              onClick={() => window.location.href='/categories'}
              className="px-5 py-2.5 border border-eco-forest/30 text-eco-forest dark:text-white rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              See waste categories
            </button>
          </div>
        </div>
      </section>
    </>
  );
}