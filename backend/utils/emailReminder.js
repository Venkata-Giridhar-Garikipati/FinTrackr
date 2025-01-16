const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const Loan = require('../models/Loan'); // Adjust path as per your project structure
require('dotenv').config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password
    },
    authMethod: 'PLAIN',
});

// Email Reminder Job
const sendEmailReminders = async () => {
    try {
        console.log("Running email reminder job...");

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
        const threeDaysBefore = new Date(today);
        threeDaysBefore.setDate(today.getDate() + 3);

        // Find loans with due dates within the next 3 days
        const loans = await Loan.find({
            status: 'Running',
            nextDueDate: { $gte: today, $lte: threeDaysBefore },
        });

        for (const loan of loans) {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: loan.email,
                subject: 'Loan Due Date Reminder',
                text: `Dear ${loan.name},
                
This is a reminder that your loan payment is due on ${loan.nextDueDate.toDateString()}.

Loan Details:
- Amount: $${loan.amount}
- Interest Type: ${loan.interestType}
- Interest Rate: ${loan.interestRate}%

Please ensure the payment is made before the due date to avoid any penalties.

Thank you,
Lending System Team.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error sending email for loan ${loan._id}:`, error);
                } else {
                    console.log(`Email sent to ${loan.email}:`, info.response);
                }
            });
        }
    } catch (error) {
        console.error('Error in email reminder job:', error.message);
    }
};

// Schedule Job to Run Daily at Midnight
schedule.scheduleJob('0 0 * * *', sendEmailReminders);

module.exports = sendEmailReminders;
