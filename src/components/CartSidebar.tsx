import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, products } = useApp();

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const shippingCharge = subtotal > freeShippingThreshold || subtotal === 0 ? 0.00 : 15.00;
  const totalAmount = subtotal + shippingCharge;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-900" />
                <h2 className="font-sans text-base font-bold text-gray-900">Your Basket</h2>
                {cart.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-950 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="font-sans text-sm font-bold text-gray-900 mb-1">Basket is empty</h3>
                  <p className="font-sans text-xs text-gray-500 max-w-xs mx-auto">
                    Explore the catalog, find beautiful items, and add them to your order.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const matchedInCatalog = products.find(p => p.id === item.product.id);
                    const currentStock = matchedInCatalog ? matchedInCatalog.stock : item.product.stock;
                    const isOverStock = item.quantity > currentStock;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-4 rounded-xl border border-gray-100 p-3 bg-white hover:border-gray-150 transition-all"
                        key={item.product.id}
                      >
                        {/* Thumbnail image */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Text and quantity controller */}
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-sans text-xs font-bold text-gray-900 line-clamp-1">
                                {item.product.name}
                              </h4>
                              <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                                ${item.product.price.toFixed(2)} each
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded-sm"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Adjustment Row */}
                          <div className="mt-auto flex items-center justify-between pt-1">
                            {/* Quantity buttons */}
                            <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-950 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-mono text-xs font-bold text-gray-900 w-8 text-center bg-gray-50/50 py-0.5 border-x border-gray-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= currentStock}
                                className={`px-2 py-1 text-gray-500 hover:text-gray-950 transition-colors ${
                                  item.quantity >= currentStock ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Row Total Cost */}
                            <span className="font-sans text-xs font-bold text-gray-900">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Stock Warning details */}
                          {isOverStock && (
                            <span className="text-[10px] font-medium text-red-600 mt-1">
                              Exceeded stock! Only {currentStock} left.
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Calculations and Actions Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/30">
                <div className="space-y-2 mb-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-mono font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Packing & Shipping details */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Shipping</span>
                    {shippingCharge === 0 ? (
                      <span className="font-bold text-emerald-600 uppercase text-[10px] tracking-wide">Free</span>
                    ) : (
                      <span className="font-mono font-medium text-gray-900">${shippingCharge.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Free shipping banner */}
                  {subtotal < freeShippingThreshold && (
                    <div className="rounded-lg bg-gray-100/80 px-3 py-1.5 text-[10px] text-center text-gray-600">
                      Add <span className="font-medium text-gray-950">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more to qualify for <span className="font-semibold text-emerald-700">Free Shipping</span>
                    </div>
                  )}

                  {/* Divider line */}
                  <div className="border-t border-gray-100 my-2 pt-2" />

                  {/* Total Cost */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total Amount</span>
                    <span className="font-sans text-lg font-black text-gray-950">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Trigger button */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 h-11 text-sm font-bold text-white hover:bg-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
