import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Leather Backpack',
    description: 'Handcrafted from full-grain vegetable-tanned leather. Features a padded 15" laptop compartment, hidden pockets for secure storage, and breathable spine support. Built to last a lifetime.',
    price: 185.00,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    stock: 12,
    rating: 4.8,
    numReviews: 44
  },
  {
    id: 'prod-2',
    name: 'Premium Wireless Headphones',
    description: 'Designed for pure acoustic performance. Features hybrid active noise-cancellation (ANC), custom 40mm bio-cellulose drivers, crystal-clear voice microphones, and 45-hour battery life.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 8,
    rating: 4.9,
    numReviews: 128
  },
  {
    id: 'prod-3',
    name: 'Wooden Desk Organizer Set',
    description: 'Made from solid sustainably harvested American Walnut. Keeps your keys, letters, smartphones, and writing instruments organized with a luxurious oiled finish and weighted silicone feet.',
    price: 64.50,
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Living',
    stock: 25,
    rating: 4.6,
    numReviews: 18
  },
  {
    id: 'prod-4',
    name: 'Custom Mechanical Keyboard',
    description: 'Tenkeyless layout with premium linear yellow switches, double-shot PBT keycaps, hot-swappable sockets, and individual per-key RGB backlighting. Features a heavy anodized aluminum frame.',
    price: 145.00,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 5,
    rating: 4.7,
    numReviews: 56
  },
  {
    id: 'prod-5',
    name: 'Ceramic Tea Infuser Mug',
    description: 'Individually thrown artisanal ceramic mug with an extra-fine mesh stainless steel filter and a matching lid that doubles as a coaster. Retains heat perfectly for your loose-leaf tea rituals.',
    price: 34.00,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Living',
    stock: 30,
    rating: 4.5,
    numReviews: 32
  },
  {
    id: 'prod-6',
    name: 'Minimalist Leather Wallet',
    description: 'Ultra-slim bi-fold profile crafted from premium Italian leather. Securely fits up to 6 cards, features a quick-access cash sleeve, and includes RFID-blocking defense for modern security.',
    price: 48.00,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    stock: 18,
    rating: 4.6,
    numReviews: 27
  },
  {
    id: 'prod-7',
    name: 'Sleek Metal Desk Lamp',
    description: 'Architectural desk lamp with dual counterweight pivoting arms. Provides continuous warm-to-cool LED temperature slider modes, side utility USB charging port, and full aluminum construction.',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Living',
    stock: 14,
    rating: 4.7,
    numReviews: 41
  },
  {
    id: 'prod-8',
    name: 'Cotton Knit Throw Blanket',
    description: 'Woven from 100% premium long-staple organic cotton in a classic moss-stitch pattern. Sized perfectly for draping over a couch or matching your bedding, offering soft, year-round comfort and breathability.',
    price: 78.00,
    imageUrl: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Living',
    stock: 6,
    rating: 4.8,
    numReviews: 50
  }
];
