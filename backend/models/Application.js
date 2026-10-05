import mongoose from 'mongoose';

const uploadedFileSchema = new mongoose.Schema({
  id: String,
  originalName: String,
  filename: String,
  size: Number,
  mimetype: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerName: {
    type: String,
    default: 'Customer'
  },
  contactPersonEmail: {
    type: String,
    default: '',
    index: true
  },
  submissionDate: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resubmittedAt: {
    type: Date
  },
  reviewedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Under Review', 'Reassigned', 'Approved', 'Rejected'],
    default: 'Under Review'
  },
  remarks: {
    type: String,
    default: 'Application submitted successfully. It is currently under review by Tata Power Renewable Energy engineers.'
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  uploadedFiles: [uploadedFileSchema]
}, {
  timestamps: true
});

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
