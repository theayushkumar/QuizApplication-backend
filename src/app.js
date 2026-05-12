const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const attemptRoutes = require('./routes/attempt.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userDashboardRoutes = require('./routes/user-dashboard.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'quiz application backend running'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', attemptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/user/dashboard', userDashboardRoutes);

module.exports = app;