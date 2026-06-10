# UrbanClick 📐

UrbanClick is a highly polished, desktop-first, responsive e-commerce application designed with a **Geometric Balance** design language. It integrates refined workspace accessories and minimalist lifestyle gear into a custom catalog powered by an interactive role-simulation engine and zero-trust Firebase services.

---


## 🚀 Key Architectural Modules

### 1. Catalog Grid & Quick Navigation
*   **Sidebar Controller:** A permanent left-hand drawer containing dynamic category count labels, quick-action routing triggers, and an automated store status indicator tracker.
*   **Integrated Best Seller Hero:** A prominent top banner highlighting our best-selling "Linear Keycap Set" styled in rich blueprints with an interactive keycap vector mockup.
*   **Dynamic Searching & Sorting:** Real-time character filtering matched against client-side catalog state. Support-sorted queries for Price (High/Low), Reviews, Rating Stars, and Alphabetical order.

### 2. Live Order Lifecycle Tracker
*   **Tracking Interface:** Real-world step transitions illustrating active shipping pipelines: `Pending ➔ Processing ➔ Shipped ➔ Delivered`.
*   **State-Locking Controls:** Fully authorized cancellation capabilities on non-terminal orders (e.g., users can cancel `Pending` and `Processing` entries, which automatically restores item inventory levels).

### 3. Quick Profile & Role Simulation
*   **No-Credentials Hot Swapper:** Easily transition your viewpoint between standard **User View** and **System Administrator view** directly inside the Profile tab.
*   **Role-Based Scopes:** 
    *   **User:** Browse inventory, update shopping baskets, check out securely, and track active statuses.
    *   **Admin:** Modify product descriptions, introduce new listings, delete items, restock quantities, and manage user shipping milestones.

### 4. Direct High-Fidelity Sync Engine
*   **Local Persistence Fallback:** All entities are seamlessly stored offline in the browser's `localStorage` for responsive client-side testing out-of-the-box.
*   **Premium Cloud Firebase Sync:** When a valid Firebase certificate signature is placed within `/src/firebase-applet-config.json`, the store instantly switches to an online database state utilizing real-time Firestore listeners and user registration pipelines!

---

## 🗄️ Database Schema & Rules
UrbanClick includes a pre-packaged **zero-trust database footprint** matching standard constraints:
*   **`firebase-blueprint.json`**: Explicit structural types covering `userProfile`, `product`, and `order` documents.
*   **`firestore.rules`**: Hardened security protocols verifying role assignments, restricting unauthorized write operations, and protecting inventory counts from external client-side modification.

---

## 🛠️ Executables
Boot the local development server (bound exclusively to host `0.0.0.0` on port `3000` for virtualized routing):
```bash
npm run dev
```

Build the application bundle for production:
```bash
npm run build
```

Run typescript diagnostics & syntax check:
```bash
npm run lint
```
