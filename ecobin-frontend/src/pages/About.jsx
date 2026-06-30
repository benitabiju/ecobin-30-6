export default function About() {
  return (
    <>
      {/* 1. Mission Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-10">
        <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white mb-6">Our Mission</h2>
        <p className="text-eco-mint dark:text-eco-sage text-lg mb-6 leading-relaxed">
          Founded with a vision of a waste-free future, EcoBin scales state-of-the-art ecological intelligence tools to map, track, and eliminate resource inefficiencies across urban infrastructures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20">
            <h3 className="font-bold text-xl mb-2 text-eco-forest dark:text-eco-earth">Global Impact</h3>
            <p className="text-sm text-eco-mint dark:text-eco-sage">Deploying regional carbon-reduction frameworks that actively save megatons of landfill debris annually.</p>
          </div>
          <div className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20">
            <h3 className="font-bold text-xl mb-2 text-eco-forest dark:text-eco-earth">Modern Integrity</h3>
            <p className="text-sm text-eco-mint dark:text-eco-sage">Every metrics pipeline is cryptographically verifiable, ensuring perfect transparency for corporate audit requirements.</p>
          </div>
        </div>
      </div>

      {/* 2. Our Story Section */}
      <section className="max-w-4xl mx-auto px-6 py-10 about-extended-content">
        <h2 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">Our Story</h2>
        <h3 className="text-xl text-eco-mint dark:text-eco-sage mb-6">From one overflowing bin to a city-wide system.</h3>
        
        <div className="story-timeline flex flex-col gap-6">
          <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
            <h4 className="font-bold text-eco-forest dark:text-white">01 The problem was obvious</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">A small team kept hearing the same complaint from every ward office: nobody knew which bins were full until someone called to complain.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
            <h4 className="font-bold text-eco-forest dark:text-white">02 We started with one zone</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">EcoBin launched as a pilot in a single collection zone — just enough sensors and structure to prove that data-routed pickups actually worked.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
            <h4 className="font-bold text-eco-forest dark:text-white">03 Collectors shaped the product</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">Early routing logic came directly from collectors' own habits — which streets to batch, which hours to avoid. We built the software around how the job already worked.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-eco-charcoal/50 rounded-lg">
            <h4 className="font-bold text-eco-forest dark:text-white">04 Now it's a full platform</h4>
            <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">Six zones, hundreds of smart bins, and three role-based dashboards later, EcoBin is the system of record for collection, recycling, and reporting.</p>
          </div>
        </div>

        {/* 3. Live Metrics Grid */}
        <div className="about-metrics my-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 border border-eco-sage/20 rounded-lg bg-white dark:bg-eco-charcoal">
            <span className="block text-xs text-eco-mint dark:text-eco-sage uppercase tracking-wider">Citizens Onboarded</span>
            <strong className="text-xl text-eco-forest dark:text-white">12,400+</strong>
          </div>
          <div className="p-4 border border-eco-sage/20 rounded-lg bg-white dark:bg-eco-charcoal">
            <span className="block text-xs text-eco-mint dark:text-eco-sage uppercase tracking-wider">Smart Bins Live</span>
            <strong className="text-xl text-eco-forest dark:text-white">340</strong>
          </div>
          <div className="p-4 border border-eco-sage/20 rounded-lg bg-white dark:bg-eco-charcoal">
            <span className="block text-xs text-eco-mint dark:text-eco-sage uppercase tracking-wider">Collection Zones</span>
            <strong className="text-xl text-eco-forest dark:text-white">6 Live Zones</strong>
          </div>
          <div className="p-4 border border-eco-sage/20 rounded-lg bg-white dark:bg-eco-charcoal">
            <span className="block text-xs text-eco-mint dark:text-eco-sage uppercase tracking-wider">Active Collectors</span>
            <strong className="text-xl text-eco-forest dark:text-white">96% Efficient</strong>
          </div>
        </div>

        {/* 4. Careers CTA */}
        <section className="team-hiring-cta mb-12">
          <h3 className="font-bold text-xl text-eco-forest dark:text-white mb-2">We're a small team and we're hiring.</h3>
          <p className="text-eco-mint dark:text-eco-sage">
            Interested in civic infrastructure? <a href="/careers" className="text-eco-forest dark:text-white underline font-medium hover:no-underline">See open roles →</a>
          </p>
        </section>

        {/* 5. Get Involved Panel */}
        <section className="get-involved mt-10 p-8 bg-gray-50 dark:bg-eco-charcoal rounded-xl border border-eco-sage/10">
          <h2 className="font-display text-2xl font-bold text-eco-forest dark:text-white mb-1">Get Involved</h2>
          <h3 className="text-lg text-eco-mint dark:text-eco-sage mb-4">Bring EcoBin to your city.</h3>
          <p className="text-sm text-eco-mint dark:text-eco-sage mb-6">Whether you're a resident, a collector, or running a ward office — there's a dashboard built for you.</p>
          <div className="flex gap-4">
            <button className="px-5 py-2.5 bg-eco-forest text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
              Get started
            </button>
            <button 
              onClick={() => window.location.href='/contact'} 
              className="px-5 py-2.5 border border-eco-forest/30 text-eco-forest dark:text-white rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Contact us
            </button>
          </div>
        </section>
      </section>
    </>
  );
}