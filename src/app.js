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


app.use('/api/auth', authRoutes); // for login , signup, forgot
app.use('/api/categories', categoryRoutes); // for category crud
app.use('/api/quizzes', quizRoutes); // for quizz list (sub category) crud
app.use('/api/questions', questionRoutes); // for question crud
app.use('/api/admin/users', userRoutes); // for user crud
app.use('/api/user', attemptRoutes); // for user attempts data
app.use('/api/admin/dashboard', dashboardRoutes); // admin dashboard stats
app.use('/api/user/dashboard', userDashboardRoutes); // user dashboard stats

module.exports = app;