const Notification = require('../models/Notification');
const Loan = require('../models/Loan');

const checkPayments = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const loans = await Loan.find();

        for (const loan of loans) {
            const dueDate = new Date(loan.nextDueDate);
            dueDate.setHours(0, 0, 0, 0);

            const daysDifference = (dueDate - today) / (1000 * 60 * 60 * 24);

            if (daysDifference > 0 && daysDifference <= 7) {
                await Notification.create({
                    userId: loan.userId,
                    message: `Upcoming payment for loan ${loan.name} is due on ${dueDate.toDateString()}.`,
                });
            } else if (daysDifference < 0) {
                await Notification.create({
                    userId: loan.userId,
                    message: `Payment for loan ${loan.name} is overdue!`,
                });
            }
        }
    } catch (error) {
        console.error('Error in checkPayments:', error.message);
    }
};

module.exports = checkPayments;
