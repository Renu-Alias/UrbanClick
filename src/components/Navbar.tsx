import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, User, ClipboardList, Settings, Store } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onToggleCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleCart }) => {
  const {
    currentUser,
    cart,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('catalog');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo element with blue geometric grids */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => {
              setCurrentView('catalog');
              setSelectedCategory('All');
              setSearchQuery('');
              setLocalSearch('');
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-650 bg-blue-600 text-white font-black">
              UC
            </div>
            <div>
              <span className="font-sans text-lg font-black tracking-tight text-slate-900 leading-none block">
                URBAN<span className="text-blue-600">CLICK</span>
              </span>
              <span className="block font-mono text-[9px] tracking-widest text-slate-400 font-bold -mt-0.5">
                GEOMETRIC BALANCE
              </span>
            </div>
          </div>

          {/* Search bar bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search modern catalog..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs transition-all bg-slate-50/70 focus:bg-white"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 font-sans">
            {/* View Catalog */}
            <button
              onClick={() => setCurrentView('catalog')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'catalog' 
                  ? 'text-blue-600 bg-blue-50/70 border border-blue-100/60 font-black' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Catalog</span>
            </button>

            {/* View Orders */}
            <button
              onClick={() => setCurrentView('orders')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'orders' 
                  ? 'text-blue-600 bg-blue-50/70 border border-blue-100/60 font-black' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </button>

            {/* View Admin Panel (Render only if user is admin) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'admin' 
                    ? 'text-red-700 bg-red-50 border border-red-100' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Settings className="h-4 w-4 text-red-650" />
                <span className="hidden sm:inline">Admin System</span>
              </button>
            )}

            {/* User Profile */}
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'profile' 
                  ? 'text-blue-600 bg-blue-50/70 border border-blue-100/60 font-black' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200 my-auto mx-1" />

            {/* Shopping Cart button */}
            <button 
              onClick={onToggleCart}
              className="relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-xs ring-2 ring-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Small screen Search Row */}
        <div className="py-2.5 pb-4 md:hidden border-t border-gray-50">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search catalog..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none text-xs transition-colors bg-gray-50/50"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </form>
        </div>

      </div>
    </header>
  );
};
