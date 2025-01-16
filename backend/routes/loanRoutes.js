// loanRoutes.js
const express = require('express');
const Loan = require('../models/Loan');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add Loan
router.post('/', authMiddleware, async (req, res) => {
    try {
        const loan = new Loan({ ...req.body, userId: req.user.id });
        await loan.save();
        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User's Loans
router.get('/', authMiddleware, async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user.id });
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Loan Record
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { date, name, phone,email, amount, interestType, interestRate, surety, job, dues, status } = req.body;

    try {
        const loan = await Loan.findOne({ _id: id, userId: req.user.id });

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found or unauthorized' });
        }

        loan.date = date || loan.date;
        loan.name = name || loan.name;
        loan.phone = phone || loan.phone;
        loan.email = email || loan.email;
        loan.amount = amount || loan.amount;
        loan.interestType = interestType || loan.interestType;
        loan.interestRate = interestRate || loan.interestRate;
        loan.surety = surety || loan.surety;
        loan.job = job || loan.job;
        loan.dues = dues || loan.dues;
        loan.status = status || loan.status;

        await loan.save();
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Loan
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found or unauthorized' });
        }

        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        console.error('Error deleting loan:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate Loan Report
router.get('/report', authMiddleware, async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user.id });

        const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalPaid = loans.reduce(
            (sum, loan) =>
                sum +
                loan.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0),
            0
        );

        const report = {
            totalLoans: loans.length,
            totalLoaned,
            totalPaid,
            loans: loans.map((loan) => ({
                name: loan.name,
                phone: loan.phone,
                amount: loan.amount,
                interestRate: loan.interestRate,
                status: loan.status,
                payments: loan.payments,
            })),
        };

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a Payment to a Loan
router.post('/:id/payments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { date, amount } = req.body;

    try {
        if (!date || !amount) {
            return res.status(400).json({ message: 'Date and amount are required' });
        }

        const loan = await Loan.findOne({ _id: id, userId: req.user.id });

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found or unauthorized' });
        }

        // Function to calculate interest based on the type
        const calculateInterest = (amount, interestRate, interestType) => {
            const principal = amount;
            const rate = interestRate / 100; // Convert percentage to decimal
            let n;

            // Determine the interest frequency based on the interest type
            switch (interestType) {
                case 'monthly':
                    n = 12; // Monthly interest
                    break;
                case 'weekly':
                    n = 52; // Weekly interest
                    break;
                case 'daily':
                    n = 365; // Daily interest
                    break;
                case 'yearly':
                    n = 1; // Yearly interest
                    break;
                default:
                    n = 1; // Default to yearly if the type is unknown
                    break;
            }

            // Formula for compound interest: A = P * (1 + r/n)^(nt)
            const t = 1; // For simplicity, assume 1 year for the calculation
            const interestAmount = principal * Math.pow((1 + rate / n), n * t) - principal;

            return interestAmount.toFixed(2); // Return the interest amount rounded to 2 decimal places
        };

        // Calculate the interest for the current loan
        const calculatedInterest = parseFloat(calculateInterest(loan.amount, loan.interestRate, loan.interestType));

        // Update dues to include interest
        loan.dues = loan.amount + calculatedInterest;

        // Subtract the payment amount from the dues
        loan.dues -= amount;

        // Add payment to the loan history
        loan.payments.push({ date, amount });

        // Check if the loan is fully paid or overpaid
        if (loan.dues <= 0) {
            loan.status = 'Closed';
            loan.dues = 0;  // Ensure dues are set to 0 when the loan is closed
        }

        // Save the updated loan
        await loan.save();
        res.status(200).json(loan);
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
