# Vimla Designer Jewellery backend

This repository now includes a Node.js + Express + SQLite backend for:

- account signup and login with bcrypt password hashing
- JWT-based authentication
- customer order creation and order tracking
- signed-in customer order history
- jewellery customisation requests with image uploads
- signed-in customer customisation history
- static hosting of the existing frontend

## Run locally

```bash
cp .env.example .env
# edit .env and set a strong JWT_SECRET
npm install
npm start
```

Open `http://localhost:3000` for the site. The API health check is available at `http://localhost:3000/api/health`.

## Main API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` with `Authorization: Bearer <token>`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/me/orders` with authentication
- `POST /api/custom-requests` as multipart form data with field `photo`
- `GET /api/me/custom-requests` with authentication

## Production requirements

The frontend still contains browser-storage demo flows. Connect it to these API endpoints before launch. Deploy behind HTTPS, use a managed database and object storage for images, add email/SMS OTP delivery, rate limiting, validation, admin authorization, payment-provider webhooks, backups and monitoring. Never commit `.env`, passwords, JWT secrets or uploaded customer images.
