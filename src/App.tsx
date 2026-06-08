import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { AdminPanel } from './components/AdminPanel';
import { ProfileView } from './components/ProfileView';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Sparkles } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const {
    products,
    currentView,
    setCurrentView,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    currentUser,
    orders
  } = useApp();

  // Cart and checkout modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Available categories
  const categories = ['All', 'Accessories', 'Electronics', 'Home & Living'];

  // Count elements per category dynamically
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') {
      return products.length;
    }
    return products.filter(p => p.category === categoryName).length;
  };

  // Filter products by category and search queries
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // 'featured' (original catalog ordering)
    }
  });

  // Real-time footer tracker calculation
  const latestOrderText = orders.length > 0
    ? `#ORD-${orders[0].id.replace('ord-', '')} ${orders[0].status.toUpperCase()} – total $${orders[0].totalAmount.toFixed(2)}`
    : '#ORD-8821 dispatched to London, UK (Simulation)';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-950 selection:bg-slate-900 selection:text-white">
      
      {/* Universal navigation bar */}
      <nav className="sticky top-0 z-40">
        <Navbar onToggleCart={() => setIsCartOpen(!isCartOpen)} />
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: PRODUCT CATALOG SHOP */}
          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Left sidebar controller (Geometric Balance style) */}
              <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs select-none">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Product Categories
                  </h3>
                  <ul className="space-y-2.5">
                    {categories.map(cat => {
                      const isSelected = selectedCategory === cat;
                      const count = getCategoryCount(cat);
                      return (
                        <li
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'text-blue-600 font-bold bg-blue-50 border border-blue-100/60'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-medium">{cat}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {count}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Quick Operations
                  </h3>
                  <div className="space-y-2">
                    {currentUser.role === 'admin' ? (
                      <>
                        <button 
                          onClick={() => setCurrentView('admin')}
                          className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-850 cursor-pointer"
                        >
                          + Add New Product
                        </button>
                        <button 
                          onClick={() => setCurrentView('orders')}
                          className="w-full py-2.5 border border-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
                        >
                          Inventory Orders
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setIsCartOpen(true)}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-blue-700 cursor-pointer"
                        >
                          View Shopping Cart
                        </button>
                        <button 
                          onClick={() => setCurrentView('orders')}
                          className="w-full py-2.5 border border-slate-200 text-slate-950 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
                        >
                          My Real Orders
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 bg-slate-900 rounded-xl p-4 text-white">
                  <p className="text-[10px] text-slate-400 uppercase mb-1 font-mono tracking-wider">Store Status</p>
                  <p className="text-sm font-bold">Live & Secure</p>
                  <div className="mt-3 flex gap-1">
                    <div className="h-1 flex-1 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="h-1 flex-1 bg-green-500 rounded-full animate-pulse delay-100"></div>
                    <div className="h-1 flex-1 bg-green-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </aside>

              {/* Right main products grid */}
              <section className="flex-1 w-full space-y-6">
                
                {/* Catalog View Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage your inventory and explore premium essentials</p>
                  </div>
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-xs select-none shrink-0">
                    <button className="px-4 py-1.5 bg-slate-100 rounded text-xs font-bold text-slate-900">Active</button>
                    <button className="px-4 py-1.5 rounded text-xs font-bold text-slate-400 cursor-not-allowed" disabled>Archived</button>
                  </div>
                </div>

                {/* Featured Best Seller Item (Modern Blue Hero block from the design) */}
                <div className="min-h-48 bg-blue-600 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden text-white shadow-xs border border-blue-700/25">
                  <div className="relative z-10 text-white max-w-md">
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-400/20">
                      Best Seller
                    </span>
                    <h2 className="text-2xl sm:text-4.5xl font-black mt-3 tracking-tight leading-none text-white">
                      Linear Keycap Set
                    </h2>
                    <p className="text-blue-100 text-xs mt-2 leading-relaxed">
                      Precision engineered for modern workflows. Premium tactile feeling with high-durability legends and robust spacing.
                    </p>
                    <div className="mt-4 text-xl sm:text-2xl font-black font-mono">$129.00</div>
                  </div>

                  <div className="w-56 h-56 bg-blue-500 rounded-full absolute -right-6 -top-6 opacity-40 pointer-events-none" />
                  <div className="w-32 h-32 bg-blue-700 rounded-full absolute left-1/3 -bottom-8 opacity-20 pointer-events-none" />

                  {/* Keyboard Keycap Representation Grid from template */}
                  <div className="mt-4 md:mt-0 w-36 h-36 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10 p-3 shrink-0">
                    <div className="grid grid-cols-3 gap-1.5 w-full h-full">
                      <div className="w-full h-8 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold font-mono">Q</div>
                      <div className="w-full h-8 bg-white text-blue-900 rounded flex items-center justify-center text-[9px] font-bold font-mono shadow-xs">W</div>
                      <div className="w-full h-8 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold font-mono">E</div>
                      <div className="w-full h-8 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold font-mono">A</div>
                      <div className="w-full h-8 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold font-mono">S</div>
                      <div className="w-full h-8 bg-white/20 rounded flex items-center justify-center text-[9px] font-bold font-mono">D</div>
                    </div>
                  </div>
                </div>

                {/* Sort / Results Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between py-2 px-1 rounded-2xl select-none font-sans">
                  <div className="text-xs text-slate-500 font-bold p-1">
                    Displaying <span className="text-blue-600 font-black">{sortedProducts.length}</span> matching selections
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>Sort By</span>
                    </span>
                    
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-slate-900 hover:border-slate-300 text-slate-800 transition-colors cursor-pointer"
                      >
                        <option value="featured">Featured Selections</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated (Stars)</option>
                        <option value="name">A – Z Alphabetical</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Main Product grid layout */}
                {sortedProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans text-sm font-bold text-slate-900 mb-1">No Products Match Filters</h3>
                    <p className="font-sans text-xs text-slate-500 max-w-xs leading-relaxed">
                      We couldn't find matches for "{searchQuery}". Try different search terms or categories.
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </section>
            </motion.div>
          )}

          {/* VIEW 2: ORDER LIFECYCLE TRACKER */}
          {currentView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OrdersView />
            </motion.div>
          )}

          {/* VIEW 3: OPERATIONS EXECUTIVE ADMIN */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel />
            </motion.div>
          )}

          {/* VIEW 4: PROFILE & ROLE SWAP PANEL */}
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileView />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Cart sidebar drawers */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Form checkout modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Dynamic bottom order tracker footer matching design styling */}
      <footer className="h-14 bg-slate-900 border-t border-slate-950 text-white flex items-center px-4 sm:px-8 justify-between flex-shrink-0 select-none font-mono text-[10px]">
        <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-bold tracking-wide uppercase">
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length} Active Orders
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-700 shrink-0" />
          <span className="text-slate-400 truncate text-[9px] sm:text-[10px]">
            Latest: <span className="text-white font-bold">{latestOrderText}</span>
          </span>
        </div>
        <div className="flex gap-4 shrink-0 pl-2">
          <span className="text-[9px] text-slate-500 tracking-widest uppercase hidden md:inline">v2.4.0 Production Baseline</span>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StorefrontContent />
    </AppProvider>
  );
}
