export default function Careers() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white mb-4">Shape the Green Frontier</h2>
      <p className="text-eco-mint dark:text-eco-sage max-w-xl mx-auto mb-12">
        Join an elite distributed team engineering structural software patterns aimed directly at global carbon drawdown pipelines.
      </p>
      <div className="text-left max-w-2xl mx-auto space-y-4">
        {['Lead Systems Architect (Rust / React)', 'Environmental Data Modeler', 'Product Designer (Sustainability Core)'].map((job, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20 flex justify-between items-center hover:border-eco-mint transition-colors cursor-pointer">
            <span className="font-bold text-eco-forest dark:text-white">{job}</span>
            <span className="text-sm text-eco-mint underline">Apply Now</span>
          </div>
        ))}
      </div>
    </div>
  );
}