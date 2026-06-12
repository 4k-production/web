/**
 * migrate.js — 4K Production MySQL → MongoDB Migration Script
 *
 * Usage:
 *   node migrate.js
 *
 * Prerequisites:
 *   npm install mysql2 monk dotenv
 *
 * What it does:
 *   1. Reads every row from all 5 MySQL tables
 *   2. Converts field names and value types
 *   3. Inserts into MongoDB (idempotent — skips duplicates via upsert)
 *   4. Prints a summary at the end
 *
 * It is safe to run multiple times — records are upserted, not duplicated.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const monk  = require('monk');

// ---- Config ----------------------------------------------------------------

const mysqlConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'fourk_production',
  charset:  'utf8mb4'
};

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://4k-production:4k-production@4k-production.i0zgwjv.mongodb.net/?appName=4k-production';

// ---- Helpers ---------------------------------------------------------------

function toISOString(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function toBoolean(val) {
  if (typeof val === 'boolean') return val;
  return val === 1 || val === '1' || val === true;
}

// ---- Table converters ------------------------------------------------------

/**
 * announcements
 * MySQL                   → MongoDB
 * id (INT AI PK)          → _id (ObjectId, auto-generated; legacy id stored as legacyId)
 * title                   → title
 * content                 → content
 * category                → category
 * image_url               → image_url
 * is_featured (TINYINT)   → is_featured (Boolean)
 * status (ENUM)           → status
 * publish_date (DATETIME) → publish_date (ISO string | null)
 * created_at (DATETIME)   → created_at (ISO string)
 * updated_at (DATETIME)   → updated_at (ISO string)
 */
function convertAnnouncement(row) {
  return {
    legacyId:    row.id,              // keep original numeric id for reference
    title:       row.title,
    content:     row.content,
    category:    row.category || 'General',
    image_url:   row.image_url || null,
    is_featured: toBoolean(row.is_featured),
    status:      row.status || 'published',
    publish_date: toISOString(row.publish_date),
    created_at:  toISOString(row.created_at) || new Date().toISOString(),
    updated_at:  toISOString(row.updated_at) || new Date().toISOString()
  };
}

/**
 * portfolio
 * MySQL                 → MongoDB
 * id (INT AI PK)        → legacyId
 * title                 → title
 * description           → description
 * category              → category
 * media_type (ENUM)     → media_type
 * media_url             → media_url
 * thumbnail             → thumbnail
 * client                → client
 * is_featured (TINYINT) → is_featured (Boolean)
 * created_at            → created_at (ISO string)
 */
function convertPortfolio(row) {
  return {
    legacyId:    row.id,
    title:       row.title,
    description: row.description || null,
    category:    row.category,
    media_type:  row.media_type || 'image',
    media_url:   row.media_url,
    thumbnail:   row.thumbnail || null,
    client:      row.client || null,
    is_featured: toBoolean(row.is_featured),
    created_at:  toISOString(row.created_at) || new Date().toISOString()
  };
}

/**
 * service_requests
 * MySQL                  → MongoDB
 * id (INT AI PK)         → legacyId
 * name                   → name
 * email                  → email
 * phone                  → phone
 * service_type           → service_type
 * event_date (DATE)      → event_date (ISO string | null)
 * budget                 → budget
 * message                → message
 * status (ENUM)          → status
 * created_at             → created_at (ISO string)
 */
function convertServiceRequest(row) {
  return {
    legacyId:     row.id,
    name:         row.name,
    email:        row.email,
    phone:        row.phone || null,
    service_type: row.service_type,
    event_date:   toISOString(row.event_date),
    budget:       row.budget || null,
    message:      row.message || null,
    status:       row.status || 'pending',
    created_at:   toISOString(row.created_at) || new Date().toISOString()
  };
}

/**
 * contact_messages
 * MySQL                → MongoDB
 * id (INT AI PK)       → legacyId
 * name                 → name
 * email                → email
 * phone                → phone
 * message              → message
 * is_read (TINYINT(1)) → is_read (Boolean)
 * created_at           → created_at (ISO string)
 */
function convertContactMessage(row) {
  return {
    legacyId:   row.id,
    name:       row.name,
    email:      row.email,
    phone:      row.phone || null,
    message:    row.message,
    is_read:    toBoolean(row.is_read),
    created_at: toISOString(row.created_at) || new Date().toISOString()
  };
}

/**
 * events
 * MySQL                   → MongoDB
 * id (INT AI PK)          → legacyId
 * event_name              → event_name
 * client_name             → client_name
 * event_date (DATE)       → event_date (ISO string | null)
 * video_url               → video_url
 * photos_json (LONGTEXT)  → photos (native Array — no more JSON.stringify/parse)
 * slug (VARCHAR UNIQUE)   → slug
 * created_at              → created_at (ISO string)
 */
function convertEvent(row) {
  let photos = [];
  try {
    photos = row.photos_json ? JSON.parse(row.photos_json) : [];
    if (!Array.isArray(photos)) photos = [];
  } catch (_) {
    photos = [];
  }
  return {
    legacyId:    row.id,
    event_name:  row.event_name,
    client_name: row.client_name || null,
    event_date:  toISOString(row.event_date),
    video_url:   row.video_url || null,
    photos,                               // stored as native array in MongoDB
    slug:        row.slug || null,
    created_at:  toISOString(row.created_at) || new Date().toISOString()
  };
}

// ---- Upsert helper ---------------------------------------------------------

async function upsertMany(collection, docs, uniqueKey) {
  let inserted = 0, updated = 0, errors = 0;
  for (const doc of docs) {
    try {
      const filter = { [uniqueKey]: doc[uniqueKey] };
      const existing = await collection.findOne(filter);
      if (existing) {
        await collection.update(filter, { $set: doc });
        updated++;
      } else {
        await collection.insert(doc);
        inserted++;
      }
    } catch (err) {
      console.error(`  ✗ Error on doc ${JSON.stringify(doc[uniqueKey])}: ${err.message}`);
      errors++;
    }
  }
  return { inserted, updated, errors };
}

// ---- Main ------------------------------------------------------------------

async function migrate() {
  console.log('\n══════════════════════════════════════════');
  console.log('  4K Production — MySQL → MongoDB Migration');
  console.log('══════════════════════════════════════════\n');

  // Connect MySQL
  console.log('→ Connecting to MySQL...');
  const mysqlConn = await mysql.createConnection(mysqlConfig);
  console.log('  ✓ MySQL connected\n');

  // Connect MongoDB
  console.log('→ Connecting to MongoDB...');
  const db = monk(mongoUri);
  await db.then(() => {});
  console.log('  ✓ MongoDB connected\n');

  const announcementsColl  = db.get('announcements');
  const portfolioColl      = db.get('portfolio');
  const serviceRequestColl = db.get('service_requests');
  const contactMessageColl = db.get('contact_messages');
  const eventsColl         = db.get('events');

  // ── Ensure indexes ──────────────────────────────────────────────
  await eventsColl.createIndex({ slug: 1 }, { unique: true, sparse: true });
  await serviceRequestColl.createIndex({ status: 1 });
  await contactMessageColl.createIndex({ isRead: 1 });

  const summary = {};

  // ── announcements ───────────────────────────────────────────────
  console.log('→ Migrating announcements...');
  const [announcementRows] = await mysqlConn.query('SELECT * FROM announcements');
  console.log(`  Found ${announcementRows.length} rows`);
  const annDocs = announcementRows.map(convertAnnouncement);
  summary.announcements = await upsertMany(announcementsColl, annDocs, 'legacyId');
  console.log(`  ✓ inserted: ${summary.announcements.inserted}  updated: ${summary.announcements.updated}  errors: ${summary.announcements.errors}\n`);

  // ── portfolio ───────────────────────────────────────────────────
  console.log('→ Migrating portfolio...');
  const [portfolioRows] = await mysqlConn.query('SELECT * FROM portfolio');
  console.log(`  Found ${portfolioRows.length} rows`);
  const portDocs = portfolioRows.map(convertPortfolio);
  summary.portfolio = await upsertMany(portfolioColl, portDocs, 'legacyId');
  console.log(`  ✓ inserted: ${summary.portfolio.inserted}  updated: ${summary.portfolio.updated}  errors: ${summary.portfolio.errors}\n`);

  // ── service_requests ────────────────────────────────────────────
  console.log('→ Migrating service_requests...');
  const [requestRows] = await mysqlConn.query('SELECT * FROM service_requests');
  console.log(`  Found ${requestRows.length} rows`);
  const reqDocs = requestRows.map(convertServiceRequest);
  summary.serviceRequests = await upsertMany(serviceRequestColl, reqDocs, 'legacyId');
  console.log(`  ✓ inserted: ${summary.serviceRequests.inserted}  updated: ${summary.serviceRequests.updated}  errors: ${summary.serviceRequests.errors}\n`);

  // ── contact_messages ────────────────────────────────────────────
  console.log('→ Migrating contact_messages...');
  const [messageRows] = await mysqlConn.query('SELECT * FROM contact_messages');
  console.log(`  Found ${messageRows.length} rows`);
  const msgDocs = messageRows.map(convertContactMessage);
  summary.contactMessages = await upsertMany(contactMessageColl, msgDocs, 'legacyId');
  console.log(`  ✓ inserted: ${summary.contactMessages.inserted}  updated: ${summary.contactMessages.updated}  errors: ${summary.contactMessages.errors}\n`);

  // ── events ──────────────────────────────────────────────────────
  console.log('→ Migrating events...');
  const [eventRows] = await mysqlConn.query('SELECT * FROM events');
  console.log(`  Found ${eventRows.length} rows`);
  const evtDocs = eventRows.map(convertEvent);
  summary.events = await upsertMany(eventsColl, evtDocs, 'legacyId');
  console.log(`  ✓ inserted: ${summary.events.inserted}  updated: ${summary.events.updated}  errors: ${summary.events.errors}\n`);

  // ── Summary ─────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════');
  console.log('  Migration Complete — Summary');
  console.log('══════════════════════════════════════════');
  for (const [table, counts] of Object.entries(summary)) {
    console.log(`  ${table.padEnd(20)} inserted: ${counts.inserted}  updated: ${counts.updated}  errors: ${counts.errors}`);
  }
  const totalErrors = Object.values(summary).reduce((s, c) => s + c.errors, 0);
  console.log('──────────────────────────────────────────');
  console.log(totalErrors === 0 ? '  ✓ All records migrated successfully!\n' : `  ⚠ ${totalErrors} error(s) encountered. Check logs above.\n`);

  await mysqlConn.end();
  await db.close();
}

migrate().catch(err => {
  console.error('\nFATAL migration error:', err.message);
  process.exit(1);
});
