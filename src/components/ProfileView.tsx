import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, Key, Sliders, Check, UserCheck, Mail, Sparkles, Building } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { currentUser, switchRole, setCurrentUser } = useApp();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 902-1203');
  const [address, setAddress] = useState(currentUser.address || '742 Evergreen Terrace, Springfield');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    setTimeout(() => {
      setCurrentUser({
        ...currentUser,
        fullName,
        email,
        phone,
        address
      });
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 850);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      
      {/* Title */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="font-sans text-2xl font-black text-gray-900 tracking-tight">Your Profile & Roles</h2>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Simulate role-based scopes (Admin vs customer), edit contact credentials, and review permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Role simulations controller (RHS or LHS) */}
        <div className="md:col-span-1 space-y-5">
          {/* Active Role card */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-48 select-none">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${
                currentUser.role === 'admin' 
                  ? 'bg-red-50 border-red-150 text-red-650' 
                  : 'bg-gray-50 border-gray-150 text-gray-650'
              }`}>
                {currentUser.role === 'admin' ? <Shield className="h-5 w-5 text-red-700" /> : <User className="h-5 w-5 text-gray-700" />}
              </div>
              <div>
                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">Active Credentials</span>
                <span className="font-bold text-gray-950 text-base">{currentUser.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              {currentUser.role === 'admin' 
                ? 'Your account handles inventory restocking, additions or terminations, and status shipping lifecycles.' 
                : 'Your account is authorized to browse catalogs, add items to baskets, proceed checkout, and track past order status timelines.'}
            </p>

            <div className="flex gap-2 text-[10px] font-semibold text-gray-650 pt-2 border-t border-gray-55 border-dashed border-gray-100">
              <Key className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Bootstrap ID: {currentUser.uid}</span>
            </div>
          </div>

          {/* Quick Role switcher panel */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5">
            <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 leading-none">
              <Sliders className="h-4 w-4 text-gray-650" />
              <span>Interact Roles</span>
            </h3>
            
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
              Hot-swap roles instantly to test different sections of the system.
            </p>

            <div className="space-y-2">
              {/* Select User Role */}
              <button
                onClick={() => switchRole('user')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentUser.role === 'user' 
                    ? 'bg-white border-gray-950 text-gray-950 shadow-sm font-bold' 
                    : 'bg-white/50 border-gray-150 hover:bg-white/80 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Standard User View</span>
                </div>
                {currentUser.role === 'user' && <Check className="h-4 w-4 text-gray-950" />}
              </button>

              {/* Select Admin Role */}
              <button
                onClick={() => switchRole('admin')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentUser.role === 'admin' 
                    ? 'bg-red-50/50 border-red-550 text-red-950 shadow-xs font-bold border-red-300' 
                    : 'bg-white/50 border-gray-150 hover:bg-white/80 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-650" />
                  <span className="text-xs">System Administrator</span>
                </div>
                {currentUser.role === 'admin' && <Check className="h-4 w-4 text-red-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Contact editor (LHS - 2 cols) */}
        <div className="md:col-span-2">
          <form onSubmit={handleSaveProfile} className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-50 pb-2 mb-2 flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5" />
              <span>Contact Coordinates</span>
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-gray-200 focus:border-gray-950 focus:outline-none bg-white rounded-xl"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-gray-200 focus:border-gray-950 focus:outline-none bg-white rounded-xl"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-gray-950 focus:outline-none bg-white rounded-xl"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Billing & Shipping Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-gray-200 focus:border-gray-950 focus:outline-none bg-white rounded-xl"
                />
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-4">
              {savedSuccess && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 select-none animate-fade-in border border-emerald-150">
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Changes recorded successfully</span>
                </span>
              )}
              
              <button
                type="submit"
                disabled={saving}
                className="ml-auto rounded-xl bg-gray-900 text-white min-w-32 px-5 py-2.5 text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
              >
                {saving ? 'Recording...' : 'Update Details'}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
