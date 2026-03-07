const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    manufacturer: { type: String },
    
    calibrationDate: { type: Date, required: true },      
    calibrationInterval: { type: Number, default: 12 },   
    nextCalibration: { type: Date }, // ამას სერვერიდან გამოვითვლით
    
    status: { type: String, default: 'active' }, 
    createdAt: { type: Date, default: Date.now }
});

// ❌ წაშლილია: EquipmentSchema.pre('save'...) ბლოკი, რადგან ის იწვევდა შეცდომას.

module.exports = mongoose.model('Equipment', EquipmentSchema);