export default function Contact() {
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h2 className="font-display text-4xl font-bold text-eco-forest dark:text-white text-center mb-4">Connect with Us</h2>
      <p className="text-center text-eco-mint dark:text-eco-sage mb-8">Our enterprise support operations maintain 24/7 client dispatch lines.</p>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-eco-forest dark:text-eco-sage">Corporate Email</label>
          <input type="email" placeholder="name@company.com" className="w-full p-3 rounded-lg border border-eco-sage/30 bg-white dark:bg-eco-charcoal text-eco-forest dark:text-white focus:outline-none focus:border-eco-emerald" />
        </div>
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-eco-forest dark:text-eco-sage">Message Portfolio</label>
          <textarea rows="4" placeholder="Describe project deployment dimensions..." className="w-full p-3 rounded-lg border border-eco-sage/30 bg-white dark:bg-eco-charcoal text-eco-forest dark:text-white focus:outline-none focus:border-eco-emerald" />
        </div>
        <button className="w-full bg-eco-forest dark:bg-eco-earth dark:text-eco-darkBg text-white font-bold tracking-widest text-xs uppercase py-3.5 rounded shadow">
          Submit Dispatch
        </button>
      </form>
    </div>
  );
}