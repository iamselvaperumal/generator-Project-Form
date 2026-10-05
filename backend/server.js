import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Application from './models/Application.js';
import Counter from './models/Counter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories setup
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'applications.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Setup multer for supporting file uploads (Drawings, reports, SLD, etc.)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit per file
});

// Flag indicating if MongoDB connection is established
let isMongoConnected = false;

// Fallback Helper: read local JSON DB
function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb = { sequence: 1, applications: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return { sequence: 1, applications: [] };
  }
}

// Fallback Helper: write local JSON DB
function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON db:', err);
  }
}

// Format submission date helper: "12 Mar 2025"
function formatSubmissionDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Generate sequential Application ID e.g. TPRE20260001
async function generateAppId() {
  const currentYear = new Date().getFullYear();
  
  if (isMongoConnected) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: `app_seq_${currentYear}` },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const formattedSeq = String(counter.seq).padStart(4, '0');
      return `TPRE${currentYear}${formattedSeq}`;
    } catch (e) {
      console.warn('MongoDB Counter error, using fallback timestamp ID:', e);
    }
  }

  // Local JSON Fallback sequence
  const db = readLocalDb();
  const seq = db.sequence || 1;
  const formattedSeq = String(seq).padStart(4, '0');
  db.sequence = seq + 1;
  writeLocalDb(db);
  return `TPRE${currentYear}${formattedSeq}`;
}

// Optional sync local JSON applications into MongoDB on startup
async function syncLocalToMongo() {
  if (!isMongoConnected) return;
  try {
    const localDb = readLocalDb();
    if (localDb.applications && localDb.applications.length > 0) {
      for (const appRecord of localDb.applications) {
        const appId = appRecord.applicationId || appRecord.id;
        const exists = await Application.findOne({ applicationId: appId });
        if (!exists) {
          await Application.create({
            applicationId: appId,
            customerName: appRecord.customerName || appRecord.formData?.customerName || 'Customer',
            contactPersonEmail: appRecord.contactPersonEmail || appRecord.formData?.contactPersonEmail || '',
            submissionDate: appRecord.submissionDate || formatSubmissionDate(new Date(appRecord.submittedAt || Date.now())),
            submittedAt: appRecord.submittedAt ? new Date(appRecord.submittedAt) : new Date(),
            updatedAt: appRecord.updatedAt ? new Date(appRecord.updatedAt) : new Date(),
            status: appRecord.status || 'Under Review',
            remarks: appRecord.remarks || 'Application submitted successfully.',
            formData: appRecord.formData || {},
            uploadedFiles: appRecord.uploadedFiles || []
          });
        }
      }
      console.log('🔄 Synced existing local applications to MongoDB database.');
    }
  } catch (err) {
    console.warn('Data sync to Mongo encountered issue:', err.message);
  }
}

// --- API ENDPOINTS ---

// 1. Admin Login API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if ((username === 'admin' && password === 'admin123') || (username && password && password.length >= 4)) {
    res.json({
      success: true,
      message: 'Admin login successful',
      token: 'tpre-admin-token-' + Date.now(),
      admin: {
        username: username || 'admin',
        name: 'Tata Power Admin Officer',
        role: 'Reviewing Engineer'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials. Use admin / admin123' });
  }
});

// 2. Upload Supporting Files API
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    const files = req.files || [];
    const fileRecords = files.map(file => ({
      id: path.parse(file.filename).name,
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString()
    }));
    res.json({ success: true, files: fileRecords });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// 3. Submit New Application (MongoDB / Fallback)
app.post('/api/applications', async (req, res) => {
  try {
    const email = (
      req.body.formData?.contactPersonEmail ||
      req.body.contactPersonEmail ||
      req.body.email ||
      ''
    ).trim().toLowerCase();

    // Check duplicate email
    if (email) {
      let duplicateApp = null;
      if (isMongoConnected) {
        duplicateApp = await Application.findOne({ contactPersonEmail: email });
      } else {
        const localDb = readLocalDb();
        duplicateApp = localDb.applications.find(a => {
          const existingEmail = (a.formData?.contactPersonEmail || a.contactPersonEmail || '').trim().toLowerCase();
          return existingEmail && existingEmail === email;
        });
      }

      if (duplicateApp) {
        return res.status(400).json({
          error: 'Already you submitted the application using the same email ID and same details so try to enter new one'
        });
      }
    }

    const id = await generateAppId();
    const now = new Date();
    const customerName = req.body.formData?.customerName || req.body.customerName || 'Customer';

    let newAppRecord;

    if (isMongoConnected) {
      const doc = await Application.create({
        applicationId: id,
        customerName,
        contactPersonEmail: email,
        submissionDate: formatSubmissionDate(now),
        submittedAt: now,
        updatedAt: now,
        status: 'Under Review',
        remarks: 'Application submitted successfully. It is currently under review by Tata Power Renewable Energy engineers.',
        formData: req.body.formData || req.body,
        uploadedFiles: req.body.uploadedFiles || []
      });

      newAppRecord = {
        id: doc.applicationId,
        applicationId: doc.applicationId,
        customerName: doc.customerName,
        contactPersonEmail: doc.contactPersonEmail,
        submissionDate: doc.submissionDate,
        submittedAt: doc.submittedAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        status: doc.status,
        remarks: doc.remarks,
        formData: doc.formData,
        uploadedFiles: doc.uploadedFiles
      };
    } else {
      // JSON File Storage Fallback
      newAppRecord = {
        id,
        applicationId: id,
        customerName,
        contactPersonEmail: email,
        submissionDate: formatSubmissionDate(now),
        submittedAt: now.toISOString(),
        updatedAt: now.toISOString(),
        status: 'Under Review',
        remarks: 'Application submitted successfully. It is currently under review by Tata Power Renewable Energy engineers.',
        formData: req.body.formData || req.body,
        uploadedFiles: req.body.uploadedFiles || []
      };

      const localDb = readLocalDb();
      localDb.applications.unshift(newAppRecord);
      writeLocalDb(localDb);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: id,
      application: newAppRecord
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to submit application: ' + err.message });
  }
});

// 4. Get Application by ID (MongoDB / Fallback)
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();

    let appRecord = null;

    if (isMongoConnected) {
      const doc = await Application.findOne({
        applicationId: { $regex: new RegExp(`^${cleanId}$`, 'i') }
      });
      if (doc) {
        appRecord = {
          id: doc.applicationId,
          applicationId: doc.applicationId,
          customerName: doc.customerName,
          contactPersonEmail: doc.contactPersonEmail,
          submissionDate: doc.submissionDate,
          submittedAt: doc.submittedAt,
          updatedAt: doc.updatedAt,
          status: doc.status,
          remarks: doc.remarks,
          formData: doc.formData,
          uploadedFiles: doc.uploadedFiles
        };
      }
    } else {
      const localDb = readLocalDb();
      appRecord = localDb.applications.find(
        a => (a.id || '').toLowerCase() === cleanId.toLowerCase() ||
             (a.applicationId || '').toLowerCase() === cleanId.toLowerCase()
      );
    }

    if (!appRecord) {
      return res.status(404).json({ error: 'Application not found. Please verify the Application ID.' });
    }

    res.json({ success: true, application: appRecord });
  } catch (err) {
    console.error('Get error:', err);
    res.status(500).json({ error: 'Failed to retrieve application' });
  }
});

// 5. Update / Resubmit Application (MongoDB / Fallback)
app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();

    const email = (
      req.body.formData?.contactPersonEmail ||
      req.body.contactPersonEmail ||
      req.body.email ||
      ''
    ).trim().toLowerCase();

    const now = new Date();

    if (isMongoConnected) {
      const existing = await Application.findOne({
        applicationId: { $regex: new RegExp(`^${cleanId}$`, 'i') }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Enforce lock: Approved applications cannot be edited or resubmitted!
      if (existing.status === 'Approved') {
        return res.status(400).json({
          error: 'This application has already been Approved and is permanently locked. It cannot be edited or resubmitted.'
        });
      }

      if (email) {
        const duplicate = await Application.findOne({
          contactPersonEmail: email,
          applicationId: { $ne: existing.applicationId }
        });

        if (duplicate) {
          return res.status(400).json({
            error: 'Already you submitted the application using the same email ID and same details so try to enter new one'
          });
        }
      }

      existing.formData = req.body.formData || req.body;
      existing.uploadedFiles = req.body.uploadedFiles || existing.uploadedFiles;
      existing.status = 'Under Review'; // Reset to Under Review on resubmission
      existing.remarks = 'Application corrected and resubmitted by user. Ready for review.';
      existing.updatedAt = now;
      existing.resubmittedAt = now;

      await existing.save();

      const updatedAppRecord = {
        id: existing.applicationId,
        applicationId: existing.applicationId,
        customerName: existing.customerName,
        contactPersonEmail: existing.contactPersonEmail,
        submissionDate: existing.submissionDate,
        submittedAt: existing.submittedAt,
        updatedAt: existing.updatedAt,
        status: existing.status,
        remarks: existing.remarks,
        formData: existing.formData,
        uploadedFiles: existing.uploadedFiles
      };

      return res.json({
        success: true,
        message: 'Application resubmitted successfully',
        application: updatedAppRecord
      });
    } else {
      // Local JSON fallback
      const localDb = readLocalDb();
      const index = localDb.applications.findIndex(
        a => (a.id || '').toLowerCase() === cleanId.toLowerCase() ||
             (a.applicationId || '').toLowerCase() === cleanId.toLowerCase()
      );

      if (index === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Enforce lock: Approved applications cannot be edited or resubmitted!
      if (localDb.applications[index].status === 'Approved') {
        return res.status(400).json({
          error: 'This application has already been Approved and is permanently locked. It cannot be edited or resubmitted.'
        });
      }

      if (email) {
        const duplicateApp = localDb.applications.find(a => {
          const aId = a.id || a.applicationId;
          const existingEmail = (a.formData?.contactPersonEmail || a.contactPersonEmail || '').trim().toLowerCase();
          return aId.toLowerCase() !== cleanId.toLowerCase() && existingEmail && existingEmail === email;
        });

        if (duplicateApp) {
          return res.status(400).json({
            error: 'Already you submitted the application using the same email ID and same details so try to enter new one'
          });
        }
      }

      const current = localDb.applications[index];

      const updatedApp = {
        ...current,
        formData: req.body.formData || req.body,
        uploadedFiles: req.body.uploadedFiles || current.uploadedFiles,
        status: 'Under Review',
        remarks: 'Application corrected and resubmitted by user. Ready for review.',
        updatedAt: now.toISOString(),
        resubmittedAt: now.toISOString()
      };

      localDb.applications[index] = updatedApp;
      writeLocalDb(localDb);

      return res.json({
        success: true,
        message: 'Application resubmitted successfully',
        application: updatedApp
      });
    }
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to resubmit application' });
  }
});

// 6. Update Status & Remarks (Admin Step 4: MongoDB / Fallback)
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }
    if (!remarks || !remarks.trim()) {
      return res.status(400).json({ error: 'Remarks are mandatory when updating status.' });
    }

    const cleanId = id.trim();
    const now = new Date();

    if (isMongoConnected) {
      const existingDoc = await Application.findOne({
        applicationId: { $regex: new RegExp(`^${cleanId}$`, 'i') }
      });

      if (!existingDoc) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Enforce lock: Once Approved, an application cannot be rejected or reassigned!
      if (existingDoc.status === 'Approved') {
        return res.status(400).json({
          error: 'This application has already been Approved and is permanently locked. It cannot be rejected or reassigned.'
        });
      }

      existingDoc.status = status;
      existingDoc.remarks = remarks.trim();
      existingDoc.updatedAt = now;
      existingDoc.reviewedAt = now;
      await existingDoc.save();

      const updatedAppRecord = {
        id: existingDoc.applicationId,
        applicationId: existingDoc.applicationId,
        customerName: existingDoc.customerName,
        contactPersonEmail: existingDoc.contactPersonEmail,
        submissionDate: existingDoc.submissionDate,
        submittedAt: existingDoc.submittedAt,
        updatedAt: existingDoc.updatedAt,
        status: existingDoc.status,
        remarks: existingDoc.remarks,
        formData: existingDoc.formData,
        uploadedFiles: existingDoc.uploadedFiles
      };

      return res.json({
        success: true,
        message: `Application status updated to ${status}`,
        application: updatedAppRecord
      });
    } else {
      const localDb = readLocalDb();
      const index = localDb.applications.findIndex(
        a => (a.id || '').toLowerCase() === cleanId.toLowerCase() ||
             (a.applicationId || '').toLowerCase() === cleanId.toLowerCase()
      );

      if (index === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Enforce lock: Once Approved, an application cannot be rejected or reassigned!
      if (localDb.applications[index].status === 'Approved') {
        return res.status(400).json({
          error: 'This application has already been Approved and is permanently locked. It cannot be rejected or reassigned.'
        });
      }

      localDb.applications[index].status = status;
      localDb.applications[index].remarks = remarks.trim();
      localDb.applications[index].updatedAt = now.toISOString();
      localDb.applications[index].reviewedAt = now.toISOString();

      writeLocalDb(localDb);

      return res.json({
        success: true,
        message: `Application status updated to ${status}`,
        application: localDb.applications[index]
      });
    }
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// 7. List All Applications (Admin Table: MongoDB / Fallback)
app.get('/api/applications', async (req, res) => {
  try {
    if (isMongoConnected) {
      const docs = await Application.find({}).sort({ submittedAt: -1, createdAt: -1 });
      const applications = docs.map(doc => ({
        id: doc.applicationId,
        applicationId: doc.applicationId,
        customerName: doc.customerName,
        contactPersonEmail: doc.contactPersonEmail,
        submissionDate: doc.submissionDate,
        submittedAt: doc.submittedAt,
        updatedAt: doc.updatedAt,
        status: doc.status,
        remarks: doc.remarks,
        formData: doc.formData,
        uploadedFiles: doc.uploadedFiles
      }));
      return res.json({ success: true, applications });
    } else {
      const localDb = readLocalDb();
      return res.json({ success: true, applications: localDb.applications });
    }
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'Failed to list applications' });
  }
});

// Start Server & Connect MongoDB
app.listen(PORT, async () => {
  console.log(`⚡ Backend server running on http://localhost:${PORT}`);
  isMongoConnected = await connectDB();
  if (isMongoConnected) {
    await syncLocalToMongo();
  }
});
