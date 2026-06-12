/**
 * 4K Production - Backend API Server v2.1
 * Single-file Express with MongoDB (Monk), Session Auth, Nodemailer, File Uploads
 * + Desktop auto-auth (token-based per-request for Electron)
 * + Multer for file uploads (portfolio, announcements, events)
 *
 * MIGRATED: MySQL → MongoDB via Monk
 */
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const monk       = require('monk');
const { ObjectId } = require('monk');
const session    = require('express-session');
const nodemailer = require('nodemailer');
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const archiver   = require('archiver');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = process.env.PORT || 5000;

// =============================================
// File Upload Configuration
// =============================================
const uploadsDir       = path.join(__dirname, 'uploads');
const portfolioDir     = path.join(uploadsDir, 'portfolio');
const announcementsDir = path.join(uploadsDir, 'announcements');
const eventsDir        = path.join(uploadsDir, 'events');

[uploadsDir, portfolioDir, announcementsDir, eventsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.query.upload_type || 'portfolio';
    let dest = portfolioDir;
    if (uploadType === 'announcements') dest = announcementsDir;
    else if (uploadType === 'events')   dest = eventsDir;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
});

// =============================================
// CORS
// =============================================
app.use(cors({
  origin: function(origin, callback) {
    if (
      !origin ||
      origin === 'null' ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin === (process.env.CORS_ORIGIN || 'http://localhost:5173')
    ) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Desktop-Token'],
  credentials:    true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
}, express.static(uploadsDir));

// =============================================
// Session
// =============================================
app.use(session({
  secret:            process.env.SESSION_SECRET || '4k-production-secret-key-2024',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   false,
    httpOnly: true,
    maxAge:   30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// =============================================
// DESKTOP TOKEN MIDDLEWARE
// =============================================
app.use((req, _res, next) => {
  const desktopToken  = process.env.DESKTOP_AUTH_TOKEN;
  const providedToken = req.headers['x-desktop-token'];
  if (desktopToken && providedToken && providedToken === desktopToken) {
    req.session.isAdmin   = true;
    req.session.adminUser = process.env.ADMIN_USERNAME || 'admin';
    req.session.isDesktop = true;
  }
  next();
});

// =============================================
// Database — MongoDB via Monk
// =============================================
let db;

// Collection handles (populated after connection)
let announcements, portfolio, serviceRequests, contactMessages, events;

async function initDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fourk_production';
    db = monk(mongoUri);

    // monk returns a promise-like; wait for connection
    await db.then(() => {});  // monk internally resolves when ready

    // Get collection handles
    announcements   = db.get('announcements');
    portfolio       = db.get('portfolio');
    serviceRequests = db.get('service_requests');
    contactMessages = db.get('contact_messages');
    events          = db.get('events');

    // Create indexes to mirror MySQL unique/query patterns
    await events.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await serviceRequests.createIndex({ status: 1 });
    await serviceRequests.createIndex({ createdAt: -1 });
    await contactMessages.createIndex({ isRead: 1 });
    await contactMessages.createIndex({ createdAt: -1 });
    await announcements.createIndex({ status: 1, createdAt: -1 });
    await portfolio.createIndex({ category: 1 });

    console.log('MongoDB connected via Monk');
  } catch (err) {
    console.error('MongoDB failed:', err.message);
    process.exit(1);
  }
}

// =============================================
// Nodemailer  (unchanged)
// =============================================
let transporter;
function initMailer() {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
    console.warn('Email not configured. Set MAIL_* env vars to enable.');
    return;
  }
  transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST,
    port:   parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
  transporter.verify(err => {
    if (err) console.warn('Email verify failed:', err.message);
    else     console.log('Email transporter ready');
  });
}

async function sendEmails({ type, name, email, details }) {
  if (!transporter) return;
  const companyEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
  const companyName  = process.env.COMPANY_NAME || '4K Production';
  const fromAddress  = `"${companyName}" <${process.env.MAIL_USER}>`;
  const typeLabel    = type === 'contact' ? 'Contact Message' : 'Service Request';

  const baseStyle    = `font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #eef2f7;`;
  const headerStyle  = `background:linear-gradient(135deg,#8b5cf6 0%,#06b6d4 100%);padding:40px 20px;text-align:center;color:#ffffff;`;
  const contentStyle = `padding:40px 35px;color:#334155;line-height:1.6;`;
  const footerStyle  = `padding:25px;background-color:#f8fafc;text-align:center;color:#64748b;font-size:13px;border-top:1px solid #eef2f7;`;
  const divider      = `<div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:30px 0;"></div>`;

  const confirmHtml = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin:0;font-size:28px;letter-spacing:-0.5px;font-weight:800;">4K PRODUCTION</h1>
        <p style="margin:10px 0 0;opacity:0.9;font-size:16px;">Excellence in Every Frame</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color:#1e293b;margin-top:0;font-size:22px;text-align:center;">Hello ${name}!</h2>
        <p style="text-align:center;font-size:16px;">Thank you for reaching out to us. We've received your <strong>${typeLabel}</strong> and our team is already reviewing it.</p>
        ${divider}
        <div style="text-align:center;">
          <p style="margin-bottom:5px;color:#64748b;">What's next?</p>
          <p style="font-size:18px;color:#8b5cf6;font-weight:600;margin-top:0;">We will contact you within 24-48 hours.</p>
        </div>
        ${divider}
        <p style="text-align:center;font-size:14px;color:#94a3b8;">If you have any urgent questions, feel free to reply to this email.</p>
      </div>
      <div style="${footerStyle}">
        <p style="margin:0;">&copy; 2026 ${companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  const detailRows = Object.entries(details).map(([k, v]) => `
    <tr>
      <td style="padding:12px 0;color:#64748b;font-size:14px;width:140px;vertical-align:top;font-weight:600;">${k}</td>
      <td style="padding:12px 0;color:#1e293b;font-size:15px;vertical-align:top;">${v || '—'}</td>
    </tr>
  `).join('');

  const notifyHtml = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin:0;font-size:24px;font-weight:800;">New ${typeLabel}</h1>
        <p style="margin:5px 0 0;opacity:0.9;">From ${name}</p>
      </div>
      <div style="${contentStyle}">
        <table style="width:100%;border-collapse:collapse;">
          ${detailRows}
        </table>
        ${divider}
        <div style="text-align:center;margin-top:20px;">
          <a href="${process.env.ADMIN_URL || '#'}" style="background:#8b5cf6;color:#ffffff;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">View in Dashboard</a>
        </div>
      </div>
      <div style="${footerStyle}">
        <p style="margin:0;">Internal Notification System</p>
      </div>
    </div>
  `;

  try {
    await Promise.all([
      transporter.sendMail({ from: fromAddress, to: email,        subject: `[${companyName}] We received your ${typeLabel}`, html: confirmHtml }),
      transporter.sendMail({ from: fromAddress, to: companyEmail, subject: `New ${typeLabel} from ${name}`, html: notifyHtml })
    ]);
  } catch (err) { console.error('Email error:', err.message); }
}

// =============================================
// Helpers
// =============================================
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
    return true;
  }
  return false;
}

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin === true) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
}

/**
 * normalizeDoc — converts a MongoDB document to the shape the frontend expects.
 *
 * MySQL used numeric auto-increment `id`; MongoDB uses `_id` (ObjectId).
 * The frontend references `item.id` in many places.
 * We expose BOTH `id` (string) and keep `_id` so existing code never breaks.
 * All snake_case field names that existed in MySQL are preserved as-is.
 */
function normalizeDoc(doc) {
  if (!doc) return doc;
  const out = { ...doc };
  // Expose id as string alias of _id
  out.id = doc._id.toString();
  return out;
}

function normalizeDocs(docs) {
  return docs.map(normalizeDoc);
}

// =============================================
// Health
// =============================================
app.get('/health', (_req, res) => res.json({
  success: true, message: '4K Production API running',
  timestamp: new Date().toISOString(), version: '2.1.0'
}));

// =============================================
// Desktop Auto-Auth (one-shot session endpoint)
// =============================================
app.post('/api/admin/desktop-auth', asyncHandler(async (req, res) => {
  const desktopToken  = process.env.DESKTOP_AUTH_TOKEN;
  const providedToken = req.headers['x-desktop-token'] || req.body?.desktopToken;

  if (!desktopToken) {
    return res.status(503).json({ success: false, message: 'Desktop auth not configured. Set DESKTOP_AUTH_TOKEN in .env' });
  }
  if (!providedToken || providedToken !== desktopToken) {
    console.warn('[Desktop Auth] Invalid token');
    return res.status(401).json({ success: false, message: 'Invalid desktop auth token' });
  }

  req.session.isAdmin   = true;
  req.session.adminUser = process.env.ADMIN_USERNAME || 'admin';
  req.session.loginTime = new Date().toISOString();
  req.session.isDesktop = true;

  req.session.save((err) => {
    if (err) {
      console.error('[Desktop Auth] Session save failed:', err);
      return res.status(500).json({ success: false, message: 'Session error' });
    }
    console.log('[Desktop Auth] Session created for desktop app');
    return res.json({
      success: true,
      message: 'Desktop session created',
      user: { username: req.session.adminUser, role: 'admin', isDesktop: true }
    });
  });
}));

// =============================================
// Admin Auth (browser login)  — no DB needed; credentials are env-based
// =============================================
app.post('/api/admin/login',
  [body('username').notEmpty().trim(), body('password').notEmpty()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@4K2024!';
    if (username === adminUser && password === adminPass) {
      req.session.isAdmin   = true;
      req.session.adminUser = username;
      req.session.loginTime = new Date().toISOString();
      return res.json({ success: true, message: 'Logged in successfully', user: { username, role: 'admin' } });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  })
);

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true, message: 'Logged out' }));
});

app.get('/api/admin/me', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ success: true, user: { username: req.session.adminUser, role: 'admin', isDesktop: !!req.session.isDesktop } });
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
});

// =============================================
// Admin Dashboard Stats
// =============================================
app.get('/api/admin/dashboard', requireAdmin, asyncHandler(async (_req, res) => {
  // COUNT queries → Monk .count()
  const [
    total_requests,
    pending_requests,
    total_messages,
    unread_messages,
    total_announcements,
    total_portfolio,
    total_events
  ] = await Promise.all([
    serviceRequests.count({}),
    serviceRequests.count({ status: 'pending' }),
    contactMessages.count({}),
    contactMessages.count({ is_read: false }),
    announcements.count({}),
    portfolio.count({}),
    events.count({})
  ]);

  // Recent rows — mirror the exact SELECT shape the frontend expects
  const [rawRequests, rawMessages, rawEvents] = await Promise.all([
    serviceRequests.find({}, { sort: { createdAt: -1 }, limit: 5 }),
    contactMessages.find({}, { sort: { createdAt: -1 }, limit: 5 }),
    events.find({}, { sort: { createdAt: -1 }, limit: 5 })
  ]);

  // Shape recent requests to match original response shape
  const recentRequests = normalizeDocs(rawRequests).map(r => ({
    id:         r.id,
    name:       r.name,
    email:      r.email,
    detail:     r.service_type,
    status:     r.status,
    created_at: r.created_at,
    type:       'request'
  }));

  // Shape recent messages
  const recentMessages = normalizeDocs(rawMessages).map(m => ({
    id:         m.id,
    name:       m.name,
    email:      m.email,
    detail:     (m.message || '').substring(0, 60),
    status:     m.is_read ? 'read' : 'unread',
    created_at: m.created_at,
    type:       'message'
  }));

  // Shape recent events — same normalisation as original
  const normalisedEvents = normalizeDocs(rawEvents).map(e => {
    const photos = Array.isArray(e.photos) ? e.photos : [];
    const photoCount = photos.length;
    return {
      id:         e.id,
      name:       e.event_name,
      email:      e.client_name || '',
      detail:     `${photoCount} photo${photoCount !== 1 ? 's' : ''} uploaded`,
      status:     'published',
      created_at: e.created_at,
      type:       'event',
      slug:       e.slug,
      thumbnail:  photos[0] || null
    };
  });

  const recentActivity = [...recentRequests, ...recentMessages, ...normalisedEvents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  res.json({
    success: true,
    data: {
      stats: {
        total_requests,
        pending_requests,
        total_messages,
        unread_messages,
        total_announcements,
        total_portfolio,
        total_events
      },
      recentActivity
    }
  });
}));

// =============================================
// File Upload Endpoints  (unchanged — Multer handles these)
// =============================================
app.post('/api/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const uploadType = req.query.upload_type || req.body.upload_type || 'portfolio';
  const fileUrl    = `/uploads/${uploadType}/${req.file.filename}`;
  res.json({ success: true, message: 'File uploaded successfully', file_url: fileUrl, filename: req.file.filename });
}));

app.post('/api/upload/multiple', upload.array('files', 20), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  const uploadType = req.query.upload_type || req.body.upload_type || 'events';
  const fileUrls   = req.files.map(f => `/uploads/${uploadType}/${f.filename}`);
  res.json({ success: true, message: 'Files uploaded successfully', file_urls: fileUrls, filenames: req.files.map(f => f.filename) });
}));

// =============================================
// Announcements (Public)
// =============================================
app.get('/api/announcements', asyncHandler(async (_req, res) => {
  // MySQL: WHERE (status IS NULL OR status='' OR status='published')
  const rows = await announcements.find({
    $or: [
      { status: { $exists: false } },
      { status: '' },
      { status: 'published' }
    ]
  }, { sort: { createdAt: -1 } });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.get('/api/announcements/featured', asyncHandler(async (_req, res) => {
  const rows = await announcements.find({
    is_featured: true,
    $or: [
      { status: { $exists: false } },
      { status: '' },
      { status: 'published' }
    ]
  }, { sort: { createdAt: -1 }, limit: 3 });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.get('/api/announcements/:id', asyncHandler(async (req, res) => {
  const doc = await findById(announcements, req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: normalizeDoc(doc) });
}));

// Announcements (Admin)
app.get('/api/admin/announcements', requireAdmin, asyncHandler(async (_req, res) => {
  const rows = await announcements.find({}, { sort: { createdAt: -1 } });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.post('/api/announcements', requireAdmin,
  [body('title').notEmpty().trim(), body('content').notEmpty().trim()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const {
      title, content,
      category     = 'General',
      image_url    = null,
      is_featured  = false,
      status       = 'published',
      publish_date = null
    } = req.body;

    const now = new Date().toISOString();
    const doc = await announcements.insert({
      title,
      content,
      category,
      image_url,
      is_featured: !!is_featured,
      status,
      publish_date: publish_date || null,
      created_at:  now,
      updated_at:  now
    });
    res.status(201).json({ success: true, message: 'Announcement created', data: normalizeDoc(doc) });
  })
);

app.put('/api/announcements/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(announcements, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

  const fields = {};
  ['title', 'content', 'category', 'image_url', 'is_featured', 'status', 'publish_date'].forEach(f => {
    if (req.body[f] !== undefined) fields[f] = req.body[f];
  });
  if (!Object.keys(fields).length) return res.status(400).json({ success: false, message: 'No fields to update' });

  fields.updated_at = new Date().toISOString();
  await announcements.update({ _id: existing._id }, { $set: fields });
  const updated = await findById(announcements, req.params.id);
  res.json({ success: true, message: 'Updated', data: normalizeDoc(updated) });
}));

app.put('/api/announcements/:id/publish', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(announcements, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await announcements.update({ _id: existing._id }, { $set: { status: 'published', updated_at: new Date().toISOString() } });
  res.json({ success: true, message: 'Published' });
}));

app.put('/api/announcements/:id/unpublish', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(announcements, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await announcements.update({ _id: existing._id }, { $set: { status: 'draft', updated_at: new Date().toISOString() } });
  res.json({ success: true, message: 'Unpublished' });
}));

app.delete('/api/announcements/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(announcements, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await announcements.remove({ _id: existing._id });
  res.json({ success: true, message: 'Deleted' });
}));

// =============================================
// Portfolio
// =============================================
app.get('/api/portfolio', asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = (category && category !== 'All') ? { category } : {};
  const rows  = await portfolio.find(query, { sort: { is_featured: -1, createdAt: -1 } });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.get('/api/portfolio/categories', asyncHandler(async (_req, res) => {
  // Distinct category values
  const rows = await portfolio.distinct('category');
  const sorted = rows.slice().sort();
  res.json({ success: true, data: ['All', ...sorted] });
}));

app.get('/api/portfolio/:id', asyncHandler(async (req, res) => {
  const doc = await findById(portfolio, req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: normalizeDoc(doc) });
}));

app.post('/api/portfolio', requireAdmin,
  [body('title').notEmpty().trim(), body('category').notEmpty().trim(), body('media_url').notEmpty()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const {
      title,
      description = null,
      category,
      media_type  = 'image',
      media_url,
      thumbnail   = null,
      client      = null,
      is_featured = false
    } = req.body;

    const doc = await portfolio.insert({
      title,
      description,
      category,
      media_type,
      media_url,
      thumbnail,
      client,
      is_featured: !!is_featured,
      created_at: new Date().toISOString()
    });
    res.status(201).json({ success: true, message: 'Portfolio item created', data: normalizeDoc(doc) });
  })
);

app.put('/api/portfolio/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(portfolio, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

  const fields = {};
  ['title', 'description', 'category', 'media_type', 'media_url', 'thumbnail', 'client', 'is_featured'].forEach(f => {
    if (req.body[f] !== undefined) fields[f] = req.body[f];
  });

  await portfolio.update({ _id: existing._id }, { $set: fields });
  const updated = await findById(portfolio, req.params.id);
  res.json({ success: true, message: 'Updated', data: normalizeDoc(updated) });
}));

app.delete('/api/portfolio/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(portfolio, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await portfolio.remove({ _id: existing._id });
  res.json({ success: true, message: 'Deleted' });
}));

// =============================================
// Service Requests
// =============================================
app.get('/api/requests', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const rows  = await serviceRequests.find(query, { sort: { createdAt: -1 } });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.get('/api/requests/:id', requireAdmin, asyncHandler(async (req, res) => {
  const doc = await findById(serviceRequests, req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: normalizeDoc(doc) });
}));

app.post('/api/requests',
  [body('name').notEmpty().trim(), body('email').isEmail().normalizeEmail(), body('service_type').notEmpty().trim()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const { name, email, phone = null, service_type, event_date = null, budget = null, message = null } = req.body;

    const doc = await serviceRequests.insert({
      name,
      email,
      phone,
      service_type,
      event_date:  event_date || null,
      budget,
      message,
      status:      'pending',
      created_at:  new Date().toISOString()
    });
    sendEmails({ type: 'service', name, email, details: { 'Name': name, 'Email': email, 'Phone': phone || '—', 'Service Type': service_type, 'Event Date': event_date || '—', 'Budget': budget || '—', 'Message': message || '—' } });
    res.status(201).json({ success: true, message: 'Service request received!', data: normalizeDoc(doc) });
  })
);

app.put('/api/requests/:id/status', requireAdmin,
  [body('status').isIn(['pending', 'reviewed', 'approved', 'confirmed', 'dismissed', 'completed'])],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const existing = await findById(serviceRequests, req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    await serviceRequests.update({ _id: existing._id }, { $set: { status: req.body.status } });
    res.json({ success: true, message: 'Status updated' });
  })
);

app.delete('/api/requests/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(serviceRequests, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await serviceRequests.remove({ _id: existing._id });
  res.json({ success: true, message: 'Deleted' });
}));

// =============================================
// Events (Public & Admin)
// =============================================
app.get('/api/events', asyncHandler(async (_req, res) => {
  const rows = await events.find({}, { sort: { event_date: -1, createdAt: -1 } });
  // photos is stored natively as an array in MongoDB — no JSON.parse needed
  res.json({ success: true, data: normalizeDocs(rows).map(r => ({ ...r, photos: Array.isArray(r.photos) ? r.photos : [] })) });
}));

app.get('/api/events/:idOrSlug', asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let event;

  // Try as ObjectId first, fall back to slug
  if (isValidObjectId(idOrSlug)) {
    event = await events.findOne({ _id: monk.id(idOrSlug) });
  }
  if (!event) {
    // Numeric legacy ID or slug — just treat as slug
    event = await events.findOne({ slug: idOrSlug });
  }
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

  const normalized = normalizeDoc(event);
  res.json({ success: true, data: { ...normalized, photos: Array.isArray(normalized.photos) ? normalized.photos : [] } });
}));

app.post('/api/events', requireAdmin,
  [body('event_name').notEmpty().trim()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const { event_name, client_name = null, event_date = null, video_url = null, photos = [] } = req.body;

    // Generate unique slug
    let slug = slugify(event_name);
    const dup = await events.findOne({ slug });
    if (dup) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const doc = await events.insert({
      event_name,
      client_name,
      event_date:  event_date || null,
      video_url,
      photos:      Array.isArray(photos) ? photos : [],
      slug,
      created_at:  new Date().toISOString()
    });
    res.status(201).json({ success: true, message: 'Event created', id: doc._id.toString(), slug });
  })
);

app.put('/api/events/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(events, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

  const fields = {};
  ['event_name', 'client_name', 'event_date', 'video_url'].forEach(f => {
    if (req.body[f] !== undefined) fields[f] = req.body[f];
  });

  // Regenerate slug if event_name changed
  if (req.body.event_name && req.body.event_name !== existing.event_name) {
    let slug = slugify(req.body.event_name);
    const dup = await events.findOne({ slug, _id: { $ne: existing._id } });
    if (dup) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    fields.slug = slug;
  }

  if (req.body.photos !== undefined) fields.photos = Array.isArray(req.body.photos) ? req.body.photos : [];

  if (Object.keys(fields).length === 0) return res.json({ success: true, message: 'No changes' });

  await events.update({ _id: existing._id }, { $set: fields });
  res.json({ success: true, message: 'Event updated' });
}));

app.delete('/api/events/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(events, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await events.remove({ _id: existing._id });
  res.json({ success: true, message: 'Event deleted' });
}));

// Download all images in an event as a zip
app.get('/api/events/:idOrSlug/download-all', asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let event;
  if (isValidObjectId(idOrSlug)) event = await events.findOne({ _id: monk.id(idOrSlug) });
  if (!event) event = await events.findOne({ slug: idOrSlug });
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

  const photos = Array.isArray(event.photos) ? event.photos : [];
  if (!photos.length) return res.status(400).json({ success: false, message: 'No photos in this event' });

  const archive = archiver('zip', { zlib: { level: 9 } });
  const zipName = `${event.event_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_photos.zip`;

  res.attachment(zipName);
  archive.pipe(res);

  photos.forEach(photoPath => {
    let absolutePath;
    if (photoPath.startsWith('/uploads/'))      absolutePath = path.join(uploadsDir, photoPath.substring(9));
    else if (photoPath.startsWith('uploads/'))  absolutePath = path.join(uploadsDir, photoPath.substring(8));
    else                                         absolutePath = path.join(uploadsDir, photoPath);

    if (fs.existsSync(absolutePath)) {
      archive.file(absolutePath, { name: path.basename(photoPath) });
    } else {
      const eventSpecificPath = path.join(eventsDir, path.basename(photoPath));
      if (fs.existsSync(eventSpecificPath)) archive.file(eventSpecificPath, { name: path.basename(photoPath) });
      else console.warn(`File not found for ZIP: ${absolutePath}`);
    }
  });

  await archive.finalize();
}));

// =============================================
// Contact Messages
// =============================================
app.post('/api/contact',
  [body('name').notEmpty().trim(), body('email').isEmail().normalizeEmail(), body('message').notEmpty().trim()],
  asyncHandler(async (req, res) => {
    if (handleValidation(req, res)) return;
    const { name, email, phone = null, message } = req.body;
    const doc = await contactMessages.insert({
      name,
      email,
      phone,
      message,
      is_read:    false,
      created_at: new Date().toISOString()
    });
    sendEmails({ type: 'contact', name, email, details: { 'Name': name, 'Email': email, 'Phone': phone || '—', 'Message': message } });
    res.status(201).json({ success: true, message: 'Thank you! We will get back to you within 24 hours.', id: doc._id.toString() });
  })
);

app.get('/api/contact', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.query;
  let query = {};
  if (status === 'unread') query = { is_read: false };
  else if (status === 'read') query = { is_read: true };
  const rows = await contactMessages.find(query, { sort: { createdAt: -1 } });
  res.json({ success: true, data: normalizeDocs(rows) });
}));

app.get('/api/contact/:id', requireAdmin, asyncHandler(async (req, res) => {
  const doc = await findById(contactMessages, req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  await contactMessages.update({ _id: doc._id }, { $set: { is_read: true } });
  res.json({ success: true, data: normalizeDoc({ ...doc, is_read: true }) });
}));

app.put('/api/contact/:id/read', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(contactMessages, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await contactMessages.update({ _id: existing._id }, { $set: { is_read: true } });
  res.json({ success: true, message: 'Marked as read' });
}));

app.delete('/api/contact/:id', requireAdmin, asyncHandler(async (req, res) => {
  const existing = await findById(contactMessages, req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
  await contactMessages.remove({ _id: existing._id });
  res.json({ success: true, message: 'Deleted' });
}));

// =============================================
// Public Stats
// =============================================
app.get('/api/stats', asyncHandler(async (_req, res) => {
  const [total_requests, total_portfolio, total_announcements, total_messages] = await Promise.all([
    serviceRequests.count({}),
    portfolio.count({}),
    announcements.count({}),
    contactMessages.count({})
  ]);
  res.json({ success: true, data: { service_requests: total_requests, portfolio_items: total_portfolio, announcements: total_announcements, contact_messages: total_messages } });
}));

// =============================================
// Utility: safe findById — handles both ObjectId and non-ObjectId strings
// =============================================
async function findById(collection, id) {
  if (isValidObjectId(id)) {
    return collection.findOne({ _id: monk.id(id) });
  }
  return null;
}

function isValidObjectId(str) {
  return /^[a-f\d]{24}$/i.test(str);
}

// =============================================
// 404
// =============================================
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// =============================================
// Error handler
// =============================================
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  if (err.code === 11000)        return res.status(409).json({ success: false, message: 'Duplicate entry' });
  if (err.code === 'ECONNREFUSED') return res.status(503).json({ success: false, message: 'Database unavailable' });
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(err.status || 500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

// =============================================
// Boot
// =============================================
async function start() {
  await initDatabase();
  initMailer();
  app.listen(PORT, () => {
    console.log(`\n4K Production API v2.1 (MongoDB) on port ${PORT}`);
    console.log('Desktop auto-auth: ' + (process.env.DESKTOP_AUTH_TOKEN ? 'ENABLED ✓' : 'NOT CONFIGURED'));
    console.log('File uploads: ENABLED ✓');
    console.log(`Uploads directory: ${uploadsDir}`);
  });
}
start().catch(err => { console.error('Failed to start:', err); process.exit(1); });
