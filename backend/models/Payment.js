const mongoose = require('mongoose');

// Payment Schema
const PaymentSchema = new mongoose.Schema({
    loan_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', // Links to the Loans collection
        required: true 
    },
    payment_date: { 
        type: Date, 
        required: true 
    },
    amount_paid: { 
        type: Number, 
        required: true 
    },
    remaining_balance: { 
        type: Number, 
        required: true 
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Payment', PaymentSchema);
