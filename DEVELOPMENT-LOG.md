# Vimla Designer Jewellery — Development Log

All development completed so far is committed to the `main` branch of this repository.

## Brand and visual identity

- Vimla Designer Jewellery brand name and corrected `DESIGNER` spelling.
- Custom SVG logo and royal monogram treatment.
- Burgundy, wine, antique-gold and champagne luxury palette.
- Rajasthani-inspired ornamental borders and heritage-couture styling.
- Regal typography using Cormorant Garamond, Cinzel and Manrope.
- Bridal campaign presentation and boutique packaging/service styling.

## Main storefront

- Responsive luxury Indian jewellery homepage.
- Hero campaign section.
- Bridal, Rajasthani, temple, brass and copper, gold-plated and daily-wear categories.
- Product catalogue with INR prices and category filters.
- Collections navigation and search/filter experience.
- Product cards with images, descriptions, ratings and add-to-cart actions.
- WhatsApp contact/order links.
- Kota, Rajasthan business contact information.

## Cart and checkout

- Dedicated `cart.html` page.
- Persistent browser cart using `vimlaCart` storage.
- Quantity increase/decrease controls.
- Remove-item controls.
- INR subtotal and total calculation.
- Checkout order-request form.
- WhatsApp order link.
- Order records saved under `vimlaOrders` for the demo dashboard.

## Customer account

- `login.html` customer sign-in and account creation page.
- Branded heritage-couture account design.
- Demo signup OTP flow using code `123456`.
- `dashboard.html` branded My Account page.
- Profile details editing.
- Favourites panel.
- Order history panel.
- Sign-out action.

## Order tracking

- `track-order.html` customer order tracking page.
- Order lookup by order number.
- Status timeline for received, crafting, packed, shipped and delivered stages.
- WhatsApp support link.

## Jewellery customisation

- `customize-jewelry.html` dedicated custom jewellery category page.
- Photo upload and preview.
- Renewal, redesign, polishing, stone, meenakari and bridal-set options.
- Jewellery type selection.
- Customer contact and design notes.
- Generated request IDs stored in the browser demo.

## Renewal page

- `renew.html` old-jewellery renewal consultation page.
- Upload validation for JPG, PNG and WEBP images.
- Maximum 5 MB client-side file check.
- Customisation request details and consultation workflow.

## Backend foundation

- Node.js and Express API in `server.js`.
- SQLite database using `better-sqlite3`.
- Password hashing using `bcryptjs`.
- JWT authentication.
- Signup, login and current-user endpoints.
- Order creation, order lookup and customer order history endpoints.
- Custom jewellery request endpoint with image upload support.
- Customer custom-request history endpoint.
- Static hosting for the existing frontend.
- `.env.example` and production security notes.

## Important production work still required

The complete development history is saved, but the site is not yet production-ready. Before accepting real customers or payments, connect the frontend forms to the backend and add:

- Real email/SMS OTP delivery.
- Secure production sessions and CSRF protection.
- Payment gateway and webhook verification.
- Admin authentication and order-management dashboard.
- Managed production database and object storage for uploaded images.
- Server-side validation, rate limiting, backups, monitoring and HTTPS.
- Avoid storing real passwords or sensitive customer information in `localStorage`.
