const express = require('express');
const Loan = require('../models/Loan');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/payments-by-month', authMiddleware, async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user.id });

        const paymentsByMonth = {};

        loans.forEach((loan) => {
            loan.payments.forEach((payment) => {
                const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
                paymentsByMonth[month] = (paymentsByMonth[month] || 0) + payment.amount;
            });
        });

        res.status(200).json(paymentsByMonth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;