const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
    inspectionNumber: { type: String, unique: true },
    objectName: { type: String, required: true },
    address: { type: String, required: true },
    clientName: { type: String, required: true },
    clientID: { type: String, required: true },
    clientPhone: { type: String },
    clientEmail: { type: String },
    contactPerson: { type: String },
    tenderLink: { type: String, default: '' }, 

    inspectionScope: { type: String, required: true },
    applicationContent: { type: String }, 
    serviceTerm: { type: String, default: 'ჩვეულებრივი' },
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },

    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technicalManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    qualityManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    impartialityConfirmed: { type: Boolean, required: true, default: false },
    status: { type: String, default: 'რეგისტრირებული' },
    
    // 👇 ვერსირებული დოკუმენტები (ISO მოთხოვნა)
    documents: { 
        type: Map, 
        of: [{
            path: String,
            version: Number,
            uploadDate: { type: Date, default: Date.now },
            uploadedBy: String
        }], 
        default: {} 
    }, 

    submittedDocuments: { type: [String], default: [] }, 
    otherDocDescription: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspection', InspectionSchema);