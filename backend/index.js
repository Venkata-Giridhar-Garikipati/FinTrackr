const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');
const dotenv = require('dotenv');
const sendEmailReminders = require('./utils/emailReminder');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const checkPayments = require('./utils/checkPayments');
const chatRouter = require('./routes/chat');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors({
    origin: 'https://fintrackr-ctc8.onrender.com',  // React app's domain
}));

//app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



// Scheduled Job for Checking Payments

schedule.scheduleJob('0 15 * * *', sendEmailReminders);
schedule.scheduleJob('0 0 * * *', async () => {
    console.log('Running scheduled payment check...');
    await checkPayments();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRouter); 

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
