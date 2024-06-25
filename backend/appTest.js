const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');

const db = require('./models');
const error404 = require('./Middlewares/error404');
const handleError = require('./Middlewares/handleError');
const passportConfig = require('./passport');
const insertProducts = require('./seeders/insertProducts'); 
const MySQLStore = require('express-mysql-session')(session);
const { userRouter, productRouter, renderRouter, reviewRouter, adminReviewRouter } = require('./routes');
const AdminSetup = require('./config/adminSetup');

const PORT = 8080;

dotenv.config();

const env = process.env.NODE_ENV || 'yerim';
const config = require('./config/config')[env];

const app = express();
db.sequelize
    .sync()
    .then(() => {
        console.log('db 연결 성공');
    }).catch(err => {
        console.error('db 연결 실패', err);
    });

passportConfig();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false, 
    },
    store: new MySQLStore({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use((req, res, next) => {
    console.log('User:', req.user);
    next();
});

app.use('/users', userRouter);
app.use('/reviews', reviewRouter);
app.use('/products', productRouter);
app.use('/admin/reviews', adminReviewRouter);
app.use('/', renderRouter);

app.use(error404);
app.use(handleError);

app.listen(PORT, () => {
    console.log(`${PORT}번 포트에서 서버 실행중 . . .`);
    if (process.env.CREATE_ADMIN === 'true') {
        const adminSetup = new AdminSetup();
        adminSetup.createAdmin();
    }
});