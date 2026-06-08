import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Truck, ShieldCheck, XCircle, AlertCircle, ShoppingBag, ArrowLeft, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { OrderStatus } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, cancelOrder, setCurrentView } = useApp();

  // Sequence of standard happy-path statuses
  const stepStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Order Placed', color: 'text-amber-500 bg-amber-50', icon: Clock, desc: 'We have received your order and are preparing it.' };
      case 'processing':
        return { label: 'Processing', color: 'text-blue-500 bg-blue-50', icon: RotateCcw, desc: 'Your order is being packaged beautifully at our warehouse.' };
      case 'shipped':
        return { label: 'In Transit', color: 'text-indigo-500 bg-indigo-50', icon: Truck, desc: 'Your package is on its way to you.' };
      case 'delivered':
        return { label: 'Delivered', color: 'text-emerald-500 bg-emerald-50', icon: ShieldCheck, desc: 'The order has been left safely at your address.' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-red-500 bg-red-50', icon: XCircle, desc: 'This transaction was cancelled and stocks restored.' };
      default:
        return { label: 'Unknown', color: 'text-gray-500 bg-gray-50', icon: AlertCircle, desc: 'Status unknown.' };
    }
  };

  const currentStepIndex = (status: OrderStatus) => {
    return stepStatuses.indexOf(status);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-gray-900">
            Order Status Tracking
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Real-time fulfillment shipping checkpoints and receipts.
          </p>
        </div>
        
        <button
          onClick={() => setCurrentView('catalog')}
          className="inline-flex self-start md:self-auto items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-4 border border-gray-100">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h3 className="font-sans text-base font-bold text-gray-900 mb-1">No Orders Found</h3>
          <p className="font-sans text-xs text-gray-500 max-w-xs mb-5 leading-relaxed">
            You haven't placed any premium orders yet. Select items from our catalog to get started.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusDetail = getStatusDetails(order.status);
            const activeStep = currentStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-gray-150 bg-white shadow-xs p-5 sm:p-6"
                key={order.id}
              >
                {/* Order Meta bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4 mb-4 font-sans">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-gray-400">Order ID</span>
                    <h3 className="text-sm font-bold text-gray-900">{order.id}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border border-current ${statusDetail.color}`}>
                      <statusDetail.icon className="h-3.5 w-3.5" />
                      <span>{statusDetail.label.toUpperCase()}</span>
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline (If not cancelled) */}
                {!isCancelled ? (
                  <div className="my-6 px-2 sm:px-4">
                    {/* Stepper Graphic */}
                    <div className="relative flex justify-between items-center w-full">
                      
                      {/* Connection track line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                      
                      {/* Interactive connection overlay indicator */}
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                        style={{ width: `${(activeStep / (stepStatuses.length - 1)) * 100}%` }}
                      />

                      {/* Timeline status bubbles */}
                      {stepStatuses.map((st, idx) => {
                        const stepConfig = getStatusDetails(st);
                        const isReached = idx <= activeStep;
                        const StepIcon = stepConfig.icon;

                        return (
                          <div className="flex flex-col items-center z-10 relative" key={st}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isReached 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              <StepIcon className="h-4 w-4" />
                            </div>
                            <span className={`text-[10px] font-bold mt-2 truncate sm:max-w-none max-w-[60px] ${
                              isReached ? 'text-slate-900 font-bold' : 'text-slate-400'
                            }`}>
                              {stepConfig.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-center font-sans text-xs text-gray-500 mt-6 bg-gray-50 rounded-xl p-2 px-4 inline-block mx-auto border border-gray-100/50">
                      {statusDetail.desc}
                    </p>
                  </div>
                ) : (
                  <div className="my-5 p-4 rounded-2xl bg-red-50/40 border border-red-105 border-red-100 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-650 text-red-600 flex-shrink-0" />
                    <div>
                      <span className="font-sans text-xs text-red-700 font-bold block">Transaction Revoked</span>
                      <p className="font-sans text-[11px] text-red-500">
                        This purchase order was cancelled. Stocks for all selected items were successfully restored to the e-commerce inventory.
                      </p>
                    </div>
                  </div>
                )}

                {/* Placed Items Box */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Purchased Items</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {order.items.map((item) => (
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 border border-gray-100" key={item.product.id}>
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-10 w-10 object-cover rounded-md border border-gray-150 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-semibold text-gray-900 truncate">{item.product.name}</p>
                          <p className="font-mono text-[9px] text-gray-400">Qty {item.quantity} × ${item.product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing and Location summary row */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-3 border-t border-gray-100/50">
                    <div className="text-xs font-sans text-gray-600 max-w-sm">
                      <span className="font-semibold text-gray-800 block mb-0.5">Shipping Destination</span>
                      <p className="font-mono text-[11px] leading-relaxed text-gray-400">
                        {order.shippingAddress.fullName}<br />
                        {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide">Paid ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <p className="font-sans text-base font-black text-gray-950">${order.totalAmount.toFixed(2)}</p>
                      </div>

                      {/* Cancel Order Action Button */}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold px-3 py-1.5 transition-all cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
