# Customer account and checkout notes

- `dashboard.html` is the branded customer account dashboard.
- `login.html` supports sign-in, account creation and a demo OTP step.
- OTP demo code is `123456`; connect a real email/SMS provider before production.
- The dashboard reads profile, favourites and order records from the browser demo store.
- Never store real passwords or authentication tokens in `localStorage`. Use a secure backend, password hashing, HTTPS, sessions and rate limiting in production.
- A checkout handoff can use `login.html?return=checkout`; the production checkout should verify the customer session server-side before payment.
