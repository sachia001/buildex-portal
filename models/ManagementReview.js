const mongoose = require('mongoose');

const ManagementReviewSchema = new mongoose.Schema({
    reviewDate: { type: Date, required: true },
    participants: [String], // ვინ ესწრებოდა
    agenda: String,        // განხილვის თემა
    findings: String,      // რა ხარვეზები ან მიღწევები გამოიკვეთა
    decisions: String,     // რა გადაწყვეტილებები იქნა მიღებული
    nextReviewDate: Date,  // შემდეგი გადახედვის გეგმიური თარიღი
    status: { type: String, default: 'დასრულებული' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ManagementReview', ManagementReviewSchema);