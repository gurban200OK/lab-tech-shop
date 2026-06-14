# Notes: my design log

**Live URL (Vercel):** https://lab-tech-shop.vercel.app/premium

## 1. Route and storage choice

- **Route:** We created the `/premium` route at `app/premium/page.js`. This matches the navbar routing contract (`href="/premium"`) and represents a clear semantic destination for users seeking to upgrade.
- **Storage:** We chose **`localStorage`** to persist the "this user is premium" flag.
- **Why?** Unlike `sessionStorage`, which clears as soon as the user closes the browser tab, `localStorage` persists across sessions, browser restarts, and tab closures. Since a Premium purchase should feel permanent and survive a fresh visit, `localStorage` is the ideal client-side storage choice. Cookies could also work but would unnecessarily transmit the premium flag with every HTTP header, bloating requests for a purely client-controlled layout state.

## 2. Server vs Client Components

- **Files Touched:**
  - `app/layout.js` (**Server Component**): Left unmodified. Provides the layout wrapper.
  - `app/page.js` (**Server Component**): Left unmodified. Renders the static shop catalog efficiently from mock data.
  - `app/premium/page.js` (**Client Component**): Created as a Client Component (`'use client'`). Needs React state for controlled inputs, submission states, form validation logic, and calling browser storage APIs (`localStorage`, `window.dispatchEvent`).
  - `app/components/AdBanner.js` (**Client Component**): Converted to a Client Component. Needs to read `localStorage` on mount to conditionally display ads and listen to window state events.
  - `app/components/Navbar.js` (**Client Component**): Converted to a Client Component. Needs to check active paths using `usePathname` for link highlighting and listen to window state events to render the "Premium ✓" badge in real time.

- **Forced to Client:** `Navbar.js`, `AdBanner.js`, and `app/premium/page.js` were forced to be Client Components because they interact with client-only hooks (`usePathname`), state hooks (`useState`, `useEffect`), and window APIs (`localStorage`, event dispatchers).
- **Advantages of Server Components:** The main page (`app/page.js`) remains a Server Component. This ensures that the heavy shop catalog content is pre-rendered on the server and delivered instantly to the browser as static HTML with zero hydration overhead, maximizing SEO and speed.

## 3. The first-render problem

- **Hydration Mismatch:** When Next.js pre-renders a Client Component on the server, it runs in a Node environment where browser-only variables like `window` and `localStorage` are `undefined`. If the component tries to read `localStorage` during this initial render, it will throw a reference error on the server, or create a hydration mismatch because the HTML sent by the server (ads shown) disagrees with the first layout render on the client (ads hidden).
- **How we fixed it:** We introduced a `mounted` state (`false` by default). The first render on both the server and client always produces the default state (ads visible). On mount (`useEffect` runs only in the browser), `mounted` becomes `true`. Only then do we read `localStorage` and transition the UI state dynamically if the user is premium.
- **How we know it is fixed:** The console is clean with zero hydration mismatches, warnings, or `localStorage is not defined` errors.

## 4. How the pieces connect

When a user submits the premium checkout form, the inputs are validated on the client side. If successful, the app sets the `isPremium` flag to `'true'` in `localStorage` and dispatches a custom `'premium-change'` event on the global `window` object. The `Navbar` and `AdBanner` components, which listen to this event, immediately catch it and update their local states, removing the advertisements and rendering the premium navigation pill dynamically without requiring a page reload.

## 5. If I had another hour

I would add a micro-interaction package like Framer Motion to animate the ad banners sliding out of view smoothly, instead of disappearing instantly. I would also add real-world card formatting checks (Luhn algorithm for card validation) and integrate a mock Stripe checkout layout for higher visual fidelity.
