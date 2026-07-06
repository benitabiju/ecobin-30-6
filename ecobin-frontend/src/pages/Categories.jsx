import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from '../api/pickups';
import * as Icons from 'lucide-react';
import RecyclableBadge from '../components/RecyclableBadge';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [wasteCategories, setWasteCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(data => {
        // Handle paginated or unpaginated response
        const results = Array.isArray(data) ? data : (data.results || []);
        // Map backend keys to frontend expected keys
        const mappedData = results.map(cat => ({
          id: cat.category_id,
          name: cat.category_name,
          description: cat.description,
          icon: cat.icon || 'HelpCircle',
          disposal_category: cat.disposal_category,
          items: cat.items || []
        }));
        setWasteCategories(mappedData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Dynamic icon component
  const DynamicIcon = ({ name, className }) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const toggleCategory = (id) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filters = [
    'All',
    'Recyclable',
    'Non-Recyclable',
    'Hazardous',
    'Organic',
    'Electronic',
    'Medical',
    'Industrial',
    'Construction',
    'Plastic',
    'Metal',
    'Glass',
    'Paper'
  ];

  const processedData = useMemo(() => {
    let filteredCategories = JSON.parse(JSON.stringify(wasteCategories));

    // Filter logic
    if (activeFilter !== 'All') {
      filteredCategories = filteredCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
          const typeMatch = item.type.toLowerCase().includes(activeFilter.toLowerCase()) || 
                            item.name.toLowerCase().includes(activeFilter.toLowerCase()) || 
                            item.description.toLowerCase().includes(activeFilter.toLowerCase());
          
          // Map filters to logical types
          if (activeFilter === 'Non-Recyclable') return item.type === 'General Waste';
          if (activeFilter === 'Electronic') return item.name.toLowerCase().includes('laptop') || item.name.toLowerCase().includes('computer') || item.name.toLowerCase().includes('phone') || item.name.toLowerCase().includes('television');
          if (activeFilter === 'Medical') return item.type === 'Biomedical';
          if (activeFilter === 'Industrial') return cat.name.includes('Industrial');
          if (activeFilter === 'Construction') return cat.name.includes('Construction');
          if (activeFilter === 'Plastic') return cat.name.includes('Plastic');
          if (activeFilter === 'Metal') return cat.name.includes('Metal');
          if (activeFilter === 'Glass') return cat.name.includes('Glass');
          if (activeFilter === 'Paper') return cat.name.includes('Paper');

          return typeMatch;
        })
      })).filter(cat => cat.items.length > 0);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredCategories = filteredCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.description.toLowerCase().includes(q)
        )
      })).filter(cat => cat.name.toLowerCase().includes(q) || cat.items.length > 0);
    }

    return filteredCategories;
  }, [searchQuery, activeFilter, wasteCategories]);

  // Statistics
  const totalCategories = wasteCategories.length;
  const totalItems = wasteCategories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const recyclableItems = wasteCategories.reduce((acc, cat) => acc + (cat.items || []).filter(i => i.type === 'Recyclable').length, 0);
  const hazardousItems = wasteCategories.reduce((acc, cat) => acc + (cat.items || []).filter(i => i.type === 'Hazardous').length, 0);
  const organicItems = wasteCategories.reduce((acc, cat) => acc + (cat.items || []).filter(i => i.type === 'Compostable').length, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Icons.Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        Error loading categories: {error}
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        
        {/* Header Section */}
        <motion.div variants={fadeUpVariant} className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Waste Categories Directory
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive catalog of all accepted materials. Search, filter, and discover the correct disposal methods to maximize recycling and safety.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="card-modern p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-primary mb-1">{totalCategories}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Categories</span>
          </div>
          <div className="card-modern p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-primary mb-1">{totalItems}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Items</span>
          </div>
          <div className="card-modern p-6 flex flex-col items-center justify-center text-center border-b-4 border-blue-400">
            <span className="text-3xl font-extrabold text-blue-600 mb-1">{recyclableItems}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Recyclable</span>
          </div>
          <div className="card-modern p-6 flex flex-col items-center justify-center text-center border-b-4 border-red-400">
            <span className="text-3xl font-extrabold text-red-600 mb-1">{hazardousItems}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Hazardous</span>
          </div>
          <div className="card-modern p-6 flex flex-col items-center justify-center text-center border-b-4 border-green-400 col-span-2 md:col-span-1">
            <span className="text-3xl font-extrabold text-green-600 mb-1">{organicItems}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Organic</span>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={fadeUpVariant} className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for a waste item or material (e.g., 'Laptop', 'PET')..." 
              className="input-modern w-full pl-12 py-4 text-lg rounded-full shadow-sm border-gray-200 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-eco-forest text-white shadow-md' 
                    : 'bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-eco-charcoal dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Accordion List */}
        <motion.div variants={fadeUpVariant} className="space-y-4">
          {processedData.length === 0 ? (
            <div className="text-center py-20 card-modern">
              <Icons.Inbox className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">No results found</h3>
              <p className="text-secondary">We couldn't find any waste items matching your search or filters.</p>
              <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="btn-secondary mt-6">
                Clear Filters
              </button>
            </div>
          ) : (
            processedData.map((category) => (
              <div key={category.id} className="card-modern overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-eco-emerald/30 shadow-sm">
                <button 
                  onClick={() => toggleCategory(category.id)}
                  className="w-full text-left p-6 flex items-center justify-between focus:outline-none bg-white dark:bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-eco-sage/10 dark:bg-eco-sage/20 flex items-center justify-center text-eco-forest">
                      <DynamicIcon name={category.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display font-bold text-xl text-primary">{category.name}</h3>
                        {category.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
                      </div>
                      <p className="text-sm text-secondary mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden md:inline-block text-xs font-bold text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {category.items.length} {category.items.length === 1 ? 'Item' : 'Items'}
                    </span>
                    {expandedCategories[category.id] ? (
                      <Icons.ChevronUp className="w-6 h-6 text-muted" />
                    ) : (
                      <Icons.ChevronDown className="w-6 h-6 text-muted" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedCategories[category.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/10"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map((item, idx) => (
                          <div key={idx} className="bg-white dark:bg-eco-charcoal p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-primary">{item.name}</h4>
                            </div>
                            <p className="text-sm text-secondary mb-4 leading-relaxed">{item.description}</p>
                            
                            <div className="flex flex-col gap-2 mt-auto">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.statusBadge}`}>
                                  {item.type}
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-xs text-muted mt-2">
                                <Icons.Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{item.method}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </motion.div>

        {/* Bottom Action Section */}
        <motion.div variants={fadeUpVariant} className="category-cta text-center mt-16 p-12 border border-dashed border-eco-sage/40 rounded-3xl bg-gray-50/30 dark:bg-eco-charcoal/20">
          <h3 className="font-display font-bold text-3xl text-primary mb-4">Can't find what you're looking for?</h3>
          <p className="text-base text-secondary mb-8">
            If you're unsure about an item, you can request a pickup and flag it as "General" or contact our support team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => (window.location.href = "/contact")} className="btn-primary">
              Contact Support
            </button>
            <button onClick={() => (window.location.href = "/faq")} className="btn-secondary">
              Read the FAQ
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}