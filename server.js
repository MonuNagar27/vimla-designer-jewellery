import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === "replace-this-with-a-long-random-secret") {
  throw new Error("Set a strong JWT_SECRET in .env before starting the server.");
}

const dataDir = path.join(__dirname, ".data");
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });
const db = new Database(path.join(dataDir, "vimla.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id INTEGER, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, payment_method TEXT NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'Order received', items_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id));
  CREATE TABLE IF NOT EXISTS custom_requests (id TEXT PRIMARY KEY, user_id INTEGER, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, service TEXT NOT NULL, jewelry_type TEXT NOT NULL, message TEXT, photo_path TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Request received', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id));
`);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use("/uploads", express.static(uploadDir));

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype)),
});

function tokenFor(user) { return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "7d" }); }
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "Authentication required" });
  try { req.user = jwt.verify(header.slice(7), jwtSecret); next(); } catch { res.status(401).json({ error: "Invalid or expired session" }); }
}
function safeUser(user) { return { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at }; }
function makeId(prefix) { return `${prefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`; }

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "vimla-designer-jewellery" }));

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone = "", password } = req.body;
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: "Name, email and an 8-character password are required" });
  const normalized = email.trim().toLowerCase();
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = db.prepare("INSERT INTO users (name,email,phone,password_hash) VALUES (?,?,?,?)").run(name.trim(), normalized, phone.trim(), hash);
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(result.lastInsertRowid);
    res.status(201).json({ user: safeUser(user), token: tokenFor(user) });
  } catch (error) { res.status(409).json({ error: error.message.includes("UNIQUE") ? "An account with this email already exists" : "Could not create account" }); }
});

app.post("/api/auth/login", async (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(String(req.body.email || "").trim().toLowerCase());
  if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.password_hash))) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ user: safeUser(user), token: tokenFor(user) });
});
app.get("/api/auth/me", auth, (req, res) => res.json({ user: safeUser(db.prepare("SELECT * FROM users WHERE id=?").get(req.user.id)) }));

app.get("/api/orders/:id", (req, res) => {
  const order = db.prepare("SELECT id,total,status,items_json,created_at FROM orders WHERE id=?").get(req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ ...order, items: JSON.parse(order.items_json) });
});
app.get("/api/me/orders", auth, (_req, res) => {
  const orders = db.prepare("SELECT id,total,status,items_json,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC").all(_req.user.id).map(o => ({ ...o, items: JSON.parse(o.items_json) }));
  res.json({ orders });
});
app.post("/api/orders", async (req, res) => {
  const { customerName, phone, address, paymentMethod, items = [], total, userId = null } = req.body;
  if (!customerName || !phone || !address || !paymentMethod || !Array.isArray(items) || !items.length || !Number.isFinite(Number(total))) return res.status(400).json({ error: "Complete customer and order details are required" });
  const id = makeId("VIM");
  db.prepare("INSERT INTO orders (id,user_id,customer_name,phone,address,payment_method,total,items_json) VALUES (?,?,?,?,?,?,?,?)").run(id, userId, customerName, phone, address, paymentMethod, Math.round(Number(total)), JSON.stringify(items));
  res.status(201).json({ order: { id, total: Math.round(Number(total)), status: "Order received" } });
});

app.post("/api/custom-requests", upload.single("photo"), (req, res) => {
  const { name, phone, email = "", service, jewelryType, message = "", userId = null } = req.body;
  if (!req.file || !name || !phone || !service || !jewelryType) return res.status(400).json({ error: "Photo, contact details, service and jewellery type are required" });
  const id = makeId("CUS");
  const photoPath = `/uploads/${req.file.filename}`;
  db.prepare("INSERT INTO custom_requests (id,user_id,name,phone,email,service,jewelry_type,message,photo_path) VALUES (?,?,?,?,?,?,?,?,?)").run(id, userId, name, phone, email, service, jewelryType, message, photoPath);
  res.status(201).json({ request: { id, status: "Request received", photo: photoPath } });
});
app.get("/api/me/custom-requests", auth, (_req, res) => res.json({ requests: db.prepare("SELECT id,service,jewelry_type,message,photo_path,status,created_at FROM custom_requests WHERE user_id=? ORDER BY created_at DESC").all(_req.user.id) }));

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message || "Request failed" }));
app.listen(port, () => console.log(`Vimla API running at http://localhost:${port}`));
