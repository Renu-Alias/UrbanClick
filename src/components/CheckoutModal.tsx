import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, Home, CheckCircle2, ShoppingBag, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShippingAddress, PaymentDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, placeOrder, setCurrentView } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address form states
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  // Payment form states
  const [payment, setPayment] = useState<PaymentDetails>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});

  // Final Order Response State
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingCharge = subtotal > 150 ? 0 : 15.00;
  const totalAmount = subtotal + shippingCharge;

  // Shipping validation
  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim() || address.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your full name (minimum 3 characters)';
    }
    if (!address.addressLine.trim() || address.addressLine.trim().length < 5) {
      errors.addressLine = 'Please enter a valid shipping address';
    }
    if (!address.city.trim()) {
      errors.city = 'Please enter your shipping city';
    }
    if (!address.postalCode.trim() || !/^[0-9a-zA-Z -]{4,10}$/.test(address.postalCode)) {
      errors.postalCode = 'Please enter a valid postal/zip code';
    }
    if (!address.country.trim()) {
      errors.country = 'Please enter your destination country';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Payment validation
  const validatePayment = (): boolean => {
    const errors: Partial<Record<keyof PaymentDetails, string>> = {};
    if (!payment.cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    }
    // Clean spaces
    const numericCard = payment.cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(numericCard)) {
      errors.cardNumber = 'Card number must be exactly 16 numerical digits';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiryDate)) {
      errors.expiryDate = 'Expiry date must match MM/YY format (e.g. 12/28)';
    }
    if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format Card Number input with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < raw.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    setPayment(prev => ({ ...prev, cardNumber: formatted }));
  };

  // Format Expiry Date input adding slash after month
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setPayment(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateAddress()) setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
  };

  const handlePlaceOrder = () => {
    setCheckoutError('');
    if (!validatePayment()) return;

    const result = placeOrder(address, {
      ...payment,
      cardNumber: payment.cardNumber.replace(/\d(?=\d{4})/g, '•') // Masking for security
    });

    if (result.success && result.order) {
      setPlacedOrderInfo(result.order);
      setStep(3);
    } else {
      setCheckoutError(result.error || 'Checkout process failed.');
    }
  };

  const handleCompleteClose = () => {
    onClose();
    // Reset flow properties
    setStep(1);
    setAddress({ fullName: '', addressLine: '', city: '', postalCode: '', country: 'United States' });
    setPayment({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
    setAddressErrors({});
    setPaymentErrors({});
    setPlacedOrderInfo(null);
  };

  const handleViewOrders = () => {
    handleCompleteClose();
    setCurrentView('orders');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={step === 3 ? undefined : handleCompleteClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Dialog Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-150"
          >
            {/* Main grid containing content and billing sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Form Entry Column (LHS) */}
              <div className="md:col-span-7 p-6 sm:p-8">
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-5">
                  <div>
                    <h2 className="font-sans text-lg font-bold text-gray-900">Checkout Flow</h2>
                    {step < 3 && (
                      <p className="font-sans text-xs text-gray-400">
                        Securely complete your premium purchase.
                      </p>
                    )}
                  </div>
                  {step < 3 && (
                    <button
                      onClick={handleCompleteClose}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Steps Progress Node Indicator (LHS) */}
                {step < 3 && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold transition-all ${
                      step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      1
                    </span>
                    <span className="text-xs font-semibold text-gray-700">Delivery</span>
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold transition-all ${
                      step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      2
                    </span>
                    <span className={`text-xs font-medium ${step >= 2 ? 'text-gray-950 font-semibold' : 'text-gray-400'}`}>Payment</span>
                  </div>
                )}

                {/* Core Wizard States Router */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                      <Home className="h-4 w-4" />
                      <span>Shipping Coordinates</span>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={address.fullName}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                          addressErrors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                        } focus:outline-none`}
                      />
                      {addressErrors.fullName && <span className="text-[10px] text-red-650 font-medium mt-1 block">{addressErrors.fullName}</span>}
                    </div>

                    {/* Address Lines */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line</label>
                      <input
                        type="text"
                        placeholder="742 Evergreen Terrace"
                        value={address.addressLine}
                        onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                        className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                          addressErrors.addressLine ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                        } focus:outline-none`}
                      />
                      {addressErrors.addressLine && <span className="text-[10px] text-red-650 font-medium mt-1 block">{addressErrors.addressLine}</span>}
                    </div>

                    {/* City + State/Zip inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          placeholder="Springfield"
                          value={address.city}
                          onChange={e => setAddress({ ...address, city: e.target.value })}
                          className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                            addressErrors.city ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                          } focus:outline-none`}
                        />
                        {addressErrors.city && <span className="text-[10px] text-red-650 font-medium mt-1 block">{addressErrors.city}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          placeholder="97477"
                          value={address.postalCode}
                          onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                          className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                            addressErrors.postalCode ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                          } focus:outline-none`}
                        />
                        {addressErrors.postalCode && <span className="text-[10px] text-red-650 font-medium mt-1 block">{addressErrors.postalCode}</span>}
                      </div>
                    </div>

                    {/* Country Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                      <select
                        value={address.country}
                        onChange={e => setAddress({ ...address, country: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-gray-900 bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Japan">Japan</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="flex items-center gap-2 rounded-xl bg-gray-905 bg-gray-900 text-white px-5 py-2.5 text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Card Details (Demo Validation)</span>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={payment.cardName}
                        onChange={e => setPayment({ ...payment, cardName: e.target.value })}
                        className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                          paymentErrors.cardName ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                        } focus:outline-none`}
                      />
                      {paymentErrors.cardName && <span className="text-[10px] text-red-650 font-medium mt-1 block">{paymentErrors.cardName}</span>}
                    </div>

                    {/* Card Account Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={payment.cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border ${
                            paymentErrors.cardNumber ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                          } focus:outline-none`}
                        />
                        <CreditCard className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
                      </div>
                      {paymentErrors.cardNumber && <span className="text-[10px] text-red-650 font-medium mt-1 block">{paymentErrors.cardNumber}</span>}
                    </div>

                    {/* Expiry and CVV column */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Expiration Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={payment.expiryDate}
                          onChange={handleExpiryChange}
                          className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                            paymentErrors.expiryDate ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                          } focus:outline-none`}
                        />
                        {paymentErrors.expiryDate && <span className="text-[10px] text-red-650 font-medium mt-1 block">{paymentErrors.expiryDate}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CVV / Security Code</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={payment.cvv}
                          onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })}
                          className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                            paymentErrors.cvv ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-gray-900'
                          } focus:outline-none`}
                        />
                        {paymentErrors.cvv && <span className="text-[10px] text-red-650 font-medium mt-1 block">{paymentErrors.cvv}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] text-gray-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>This is a non-charge sandbox environment. Your financial secrets are strictly masked and never stored.</span>
                    </div>

                    {checkoutError && (
                      <span className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5 block text-center font-medium">
                        {checkoutError}
                      </span>
                    )}

                    {/* Step back/place triggers */}
                    <div className="pt-4 flex justify-between gap-3">
                      <button
                        onClick={handlePrevStep}
                        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handlePlaceOrder}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Place Secure Order</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && placedOrderInfo && (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100"
                    >
                      <CheckCircle2 className="h-7.5 w-7.5" />
                    </motion.div>
                    
                    <h3 className="font-sans text-base font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                    <p className="font-sans text-xs text-gray-500 max-w-sm mb-4 leading-relaxed">
                      Thank you for your purchase. Your order has been registered, catalog stocks have been secured, and tracking is now online.
                    </p>

                    {/* Order Details box */}
                    <div className="w-full rounded-2xl bg-gray-50 border border-gray-100 p-4 text-left max-w-sm mb-6 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-mono">Reference</span>
                        <span className="font-mono font-bold text-gray-900">{placedOrderInfo.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-mono">Status</span>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
                          PENDING TRACKING
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-mono">Total Paid</span>
                        <span className="font-mono font-bold text-gray-950">${placedOrderInfo.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-gray-150">
                        <span className="text-gray-400 font-mono font-normal">Registered Email</span>
                        <span className="text-gray-800 text-[11px] truncate font-sans max-w-[180px]">
                          {placedOrderInfo.userEmail}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full max-w-sm">
                      <button
                        onClick={handleCompleteClose}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        Keep Shopping
                      </button>

                      <button
                        onClick={handleViewOrders}
                        className="flex-1 rounded-xl bg-gray-900 text-white py-2.5 text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping summary Column (RHS) */}
              <div className="md:col-span-5 bg-gray-50/70 border-t md:border-t-0 md:border-l border-gray-150 p-6 sm:p-8 flex flex-col justify-between">
                {step < 3 ? (
                  <>
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200/50 pb-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Order Summary</span>
                      </h4>

                      {/* Items loop */}
                      <div className="max-h-60 overflow-y-auto space-y-3 mb-4 select-none">
                        {cart.map((item) => (
                          <div className="flex items-center gap-3 text-xs" key={item.product.id}>
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-10 w-10 object-cover rounded-md border border-gray-150 bg-white"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                              <p className="font-mono text-[9px] text-gray-400">Qty {item.quantity}</p>
                            </div>
                            <span className="font-mono font-medium text-gray-800">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price calculation block */}
                    <div className="border-t border-gray-200/50 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-mono text-gray-800">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Shipping</span>
                        {shippingCharge === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase text-[9px]">Free</span>
                        ) : (
                          <span className="font-mono text-gray-800">${shippingCharge.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="border-t border-gray-200/30 my-2 pt-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">Total</span>
                        <span className="font-sans text-lg font-black text-gray-950">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-100 mb-2" />
                    <span className="font-mono text-[10px] text-gray-400 tracking-wider">SECURE SHIELD ACTIVE</span>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
