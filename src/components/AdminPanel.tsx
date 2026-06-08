import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatus } from '../types';
import { Plus, Edit3, Trash2, ChevronRight, Package, AlertTriangle, FileSpreadsheet, Layers, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  // New/Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'Accessories',
    stock: 10
  });

  const categories = ['Accessories', 'Electronics', 'Home & Living'];

  // Handle Form submissions
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description || productForm.price <= 0 || !productForm.imageUrl) {
      alert('Please fill out all fields with valid information.');
      return;
    }

    addProduct({
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      imageUrl: productForm.imageUrl,
      category: productForm.category,
      stock: Number(productForm.stock),
      rating: 4.5,
      numReviews: 1
    });

    // Reset Form
    setProductForm({ name: '', description: '', price: 0, imageUrl: '', category: 'Accessories', stock: 10 });
    setIsAddFormOpen(false);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsAddFormOpen(false);
  };

  // Status visual color formatting
  const getStatusBadgeStyles = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'processing': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'shipped': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      
      {/* Admin Panel Header */}
      <div className="mb-8 border-b border-gray-150 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Admin Management</span>
            <span className="rounded-md bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-700">
              OPERATIONS MODERATE
            </span>
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Reorder tracking lists, restock levels, and define custom catalog offerings.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto select-none">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Inventory Restocking
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Orders Management</span>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-white rounded-full h-4 w-4 inline-flex items-center justify-center text-[9px]">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: CATALOG INVENTORY Restocking */}
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header controls inside tab */}
            <div className="flex justify-between items-center gap-4 mb-6">
              <h3 className="font-sans text-sm font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Store Catalog Items ({products.length})</span>
              </h3>

              {!isAddFormOpen && !editingProduct && (
                <button
                  onClick={() => setIsAddFormOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 text-white px-4.5 py-2 text-xs font-bold hover:bg-gray-800 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            {/* EXPANDED: Add Product Form */}
            {isAddFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4 border-b border-gray-200/50 pb-2">
                  <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-widest">Construct New Product Listing</h4>
                  <button onClick={() => setIsAddFormOpen(false)} className="text-gray-400 hover:text-gray-950 text-xs">Cancel</button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ergonomic Standing Desk"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description Details</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify premium details, material specifications, sizes, attributes..."
                      value={productForm.description}
                      onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      required
                      value={productForm.price || ''}
                      onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Availability</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock || 0}
                      onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.imageUrl}
                      onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-200/55">
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className="rounded-lg border border-gray-200 text-gray-700 px-4 py-2 text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 text-white px-5 py-2 text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
                    >
                      List New Product
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* EXPANDED: Edit Product Form */}
            {editingProduct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-50/40 border border-amber-200 rounded-2xl p-5 mb-6 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4 border-b border-amber-200/50 pb-2">
                  <h4 className="font-sans text-xs font-bold text-amber-900 uppercase tracking-widest">Adjust Product Parameters</h4>
                  <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-950 text-xs">Cancel</button>
                </div>

                <form onSubmit={handleEditProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description Details</label>
                    <textarea
                      required
                      rows={3}
                      value={editingProduct.description}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      required
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Availability</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-amber-200/50">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="rounded-lg border border-gray-200 text-gray-700 px-4 py-2 text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-600 text-white px-5 py-2 text-xs font-bold hover:bg-amber-700 transition-all cursor-pointer"
                    >
                      Apply Adjustments
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Inventory table panel */}
            <div className="overflow-x-auto rounded-2xl border border-gray-150 bg-white">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Levels</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const lowStock = p.stock <= 5;
                    const out = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Thumbnail details */}
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-10 w-10 min-w-10 object-cover rounded-lg border border-gray-100 placeholder:bg-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block truncate max-w-[200px]">{p.name}</span>
                            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">{p.id}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 text-gray-650 font-medium">{p.category}</td>

                        {/* Price */}
                        <td className="p-4 font-mono font-bold text-gray-900">${p.price.toFixed(2)}</td>

                        {/* Stock status */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block h-2 w-2 rounded-full ${
                              out ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            <span className={`font-mono text-[11px] font-bold ${
                              out ? 'text-red-700' : lowStock ? 'text-amber-700' : 'text-emerald-700'
                            }`}>
                              {p.stock} units
                            </span>
                            {out && <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.2 select-none border border-red-100 font-bold ml-1">SOLD OUT</span>}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-1.5 select-none">
                            <button
                              onClick={() => startEditProduct(p)}
                              className="rounded-lg p-1.5 t border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-colors cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}? This is permanent.`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="rounded-lg p-1.5 border border-red-100 hover:border-red-500 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SIMULATED ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 flex justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <span className="font-sans text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Consolidated System Orders Ledger ({orders.length})</span>
              </span>
              
              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>REAL TIME INGRESS QUEUE</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-gray-105 border-gray-100 rounded-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-4 border border-gray-100">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="font-sans text-sm font-bold text-gray-900 mb-1">Queue is Empty</h3>
                <p className="font-sans text-xs text-gray-500 max-w-xs leading-relaxed">
                  No orders have been recorded in the store yet. Users must proceed through checkout to populate this list.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  return (
                    <div
                      className="border border-gray-150 rounded-2xl bg-white p-5 hover:shadow-xs transition-shadow"
                      key={order.id}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                        {/* Reference details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-black text-gray-900">{order.id}</span>
                            <span className={`text-[9px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wide ${getStatusBadgeStyles(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="block text-[10px] text-gray-400 font-medium">By {order.userEmail} | {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Status updater actions dropdown */}
                        <div className="flex items-center gap-1.5 select-none">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">Dispatch Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-white border border-gray-200 text-xs rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none focus:border-gray-900"
                          >
                            <option value="pending">Pending Receipt</option>
                            <option value="processing">Processing Pack</option>
                            <option value="shipped">Shipped & In Transit</option>
                            <option value="delivered">Delivered Successfully</option>
                            <option value="cancelled">Cancelled/Refunded</option>
                          </select>
                        </div>
                      </div>

                      {/* Purchased lines inside order */}
                      <div className="flex flex-wrap items-center gap-4 justify-between font-sans">
                        <div className="flex flex-wrap items-center gap-3">
                          {order.items.map((item) => (
                            <div className="inline-flex items-center gap-1.5 p-1 px-2 rounded-lg bg-gray-50 border border-gray-100 text-[10px]" key={item.product.id}>
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="h-6 w-6 object-cover rounded-md border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-medium text-gray-800 max-w-[80px] sm:max-w-xs truncate">{item.product.name}</span>
                              <span className="text-gray-400">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Totals Paid */}
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-gray-400 block uppercase">Grand Total Amount</span>
                          <span className="font-sans text-xs font-black text-gray-950">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Display Shipping address info */}
                      <div className="mt-3 pt-3 border-t border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-gray-400 font-mono gap-2 leading-relaxed">
                        <div>
                          <span className="font-bold text-gray-500 capitalize block font-sans text-[10px]">Client Shipping Destination</span>
                          <span>{order.shippingAddress.fullName} – {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-bold text-gray-500 capitalize block font-sans text-[10px]">Billing Details</span>
                          <span>Using Mock account {order.paymentDetails.cardNumber}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
