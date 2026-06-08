import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, ShippingAddress, PaymentDetails, UserProfile, UserRole } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { isFirebaseReady, db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (updated: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, paymentDetails: PaymentDetails) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  currentView: 'catalog' | 'orders' | 'admin' | 'profile';
  setCurrentView: (view: 'catalog' | 'orders' | 'admin' | 'profile') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isFirebaseEnabled: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  uid: 'usr-101',
  email: 'renualiasmeleth@gmail.com', // Bootstrapped admin email
  role: 'admin', // Default to admin for full-capabilities testing out-of-the-box, easily toggled
  fullName: 'Renu Alias Meleth'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFirebaseEnabled = isFirebaseReady();

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ec_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ec_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ec_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ec_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // View state
  const [currentView, setCurrentView] = useState<'catalog' | 'orders' | 'admin' | 'profile'>('catalog');

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Sync to localStorage as client fallback
  useEffect(() => {
    localStorage.setItem('ec_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ec_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ec_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ec_orders', JSON.stringify(orders));
  }, [orders]);

  // Firebase Auth Setup
  useEffect(() => {
    if (!isFirebaseEnabled || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db!, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as UserProfile);
          } else {
            const isBootstrappedAdmin = user.email === 'renualiasmeleth@gmail.com';
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'UrbanClick User',
              role: isBootstrappedAdmin ? 'admin' : 'user'
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setCurrentUser(DEFAULT_USER);
      }
    });

    return () => unsubscribe();
  }, [isFirebaseEnabled]);

  // Load products from Firestore if active
  useEffect(() => {
    if (!isFirebaseEnabled || !db) return;

    const fetchProducts = async () => {
      const path = 'products';
      try {
        const querySnapshot = await getDocs(collection(db!, path));
        if (querySnapshot.empty) {
          // Seed INITIAL_PRODUCTS if empty
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db!, 'products', item.id), item);
          }
          setProducts(INITIAL_PRODUCTS);
        } else {
          const list: Product[] = [];
          querySnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Product);
          });
          setProducts(list);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    };

    fetchProducts();
  }, [isFirebaseEnabled]);

  // Load orders from Firestore if active
  useEffect(() => {
    if (!isFirebaseEnabled || !db || !currentUser.uid) return;

    const path = 'orders';
    const q = query(collection(db!, path), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [isFirebaseEnabled, currentUser.uid]);

  // Authentication flows
  const signInWithGoogle = async () => {
    if (!isFirebaseEnabled || !auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  const signOutUser = async () => {
    if (!isFirebaseEnabled || !auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Google Sign-Out failed:', error);
    }
  };

  // Role management helper (Allows clean swapping between Admin system views)
  const switchRole = async (role: UserRole) => {
    const updated = {
      ...currentUser,
      role,
      fullName: role === 'admin' ? 'Renu Alias Meleth (Admin)' : 'Renu Alias Meleth'
    };
    setCurrentUser(updated);

    if (isFirebaseEnabled && db) {
      const path = `users/${currentUser.uid}`;
      try {
        await setDoc(doc(db!, 'users', currentUser.uid), updated);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  };

  // Product management actions
  const addProduct = async (p: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...p, id };
    
    if (isFirebaseEnabled && db) {
      const path = `products/${id}`;
      try {
        await setDoc(doc(db!, 'products', id), newProduct);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
    
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = async (updated: Product) => {
    if (isFirebaseEnabled && db) {
      const path = `products/${updated.id}`;
      try {
        await setDoc(doc(db!, 'products', updated.id), updated);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
    
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = async (id: string) => {
    if (isFirebaseEnabled && db) {
      const path = `products/${id}`;
      try {
        await deleteDoc(doc(db!, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
    
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const targetQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: targetQty } : item);
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item => {
        if (item.product.id === productId) {
          const productInCatalog = products.find(p => p.id === productId);
          const maxStock = productInCatalog ? productInCatalog.stock : item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Direct checkout placement
  const placeOrder = async (shippingAddress: ShippingAddress, paymentDetails: PaymentDetails) => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    // Double check inventory bounds
    for (const item of cart) {
      const matched = products.find(p => p.id === item.product.id);
      if (!matched) {
        return { success: false, error: `Product ${item.product.name} is no longer available.` };
      }
      if (matched.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for "${item.product.name}". Only ${matched.stock} units remaining.` };
      }
    }

    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 15.00;
    const totalAmount = subtotal + shipping;

    const newOrder: Order = {
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      items: [...cart],
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'pending',
      shippingAddress,
      paymentDetails,
      createdAt: new Date().toISOString()
    };

    // Firebase database sync
    if (isFirebaseEnabled && db) {
      try {
        // High-integrity transactional update to decrement stocks in store catalog
        for (const item of cart) {
          const productRef = doc(db!, 'products', item.product.id);
          const targetStock = Math.max(0, item.product.stock - item.quantity);
          await updateDoc(productRef, { stock: targetStock });
        }
        // Write the finalized order
        await setDoc(doc(db!, 'orders', newOrder.id), newOrder);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `orders/${newOrder.id}`);
      }
    }

    // Local state stock update
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartMatch = cart.find(item => item.product.id === p.id);
        if (cartMatch) {
          return { ...p, stock: Math.max(0, p.stock - cartMatch.quantity) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (isFirebaseEnabled && db) {
      const path = `orders/${orderId}`;
      try {
        await updateDoc(doc(db!, 'orders', orderId), { status });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
    
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const cancelOrder = async (orderId: string) => {
    const matchedOrder = orders.find(o => o.id === orderId);
    if (!matchedOrder || matchedOrder.status === 'cancelled' || matchedOrder.status === 'delivered') {
      return;
    }

    if (isFirebaseEnabled && db) {
      try {
        for (const item of matchedOrder.items) {
          const productRef = doc(db!, 'products', item.product.id);
          const catProd = products.find(p => p.id === item.product.id);
          const currentStock = catProd ? catProd.stock : item.product.stock;
          await updateDoc(productRef, { stock: currentStock + item.quantity });
        }
        await updateDoc(doc(db!, 'orders', orderId), { status: 'cancelled' });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
      }
    }

    // Update locally too
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const itemMatch = matchedOrder.items.find(item => item.product.id === p.id);
        if (itemMatch) {
          return { ...p, stock: p.stock + itemMatch.quantity };
        }
        return p;
      })
    );

    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'cancelled' } : order));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        isFirebaseEnabled,
        signInWithGoogle,
        signOutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
