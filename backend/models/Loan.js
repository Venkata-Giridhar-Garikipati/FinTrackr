const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
});

const LoanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    interestType: { type: String, required: true, enum: ['weekly', 'monthly', 'yearly', 'daily'], default: 'monthly' },
    interestRate: { type: Number, required: true },
    surety: { type: String, required: true },
    job: { type: String, required: true },
    dues: { type: Number },
    closedDate: { type: Date }, // Date when the loan was closed
    nextDueDate: { type: Date },
    totalAmount:{type: Number},
    status: { type: String, required: true, enum: ['Running', 'Closed'], default: 'Running' },
    payments: [paymentSchema], // Added payments field
    
});

module.exports = mongoose.model('Loan', LoanSchema);
