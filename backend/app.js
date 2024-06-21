const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db =require('./models');
<<<<<<< Updated upstream
const passport=require('passport')
const {userRouter, productRouter,renderRouter,reviewRouter}= require('./routes');


=======

const passport=require('passport')
const loginRouter=require('./routes/loginRouter')

const PORT = 8080;

>>>>>>> Stashed changes
dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(()=>{
    console.log('db 연결 성공');
  })
  .catch(console.error);
//cookie parser를 활용하여 쿠키 해석하기
<<<<<<< Updated upstream
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/users', userRouter);
app.use('/reviews',reviewRouter);
app.use('/products', productRouter);
app.use('/', renderRouter);

app.use(passport.initialize());
app.use(passport.session());

//express-session 미들웨어를 사용하여 세션 관리
app.use(session({
  secret: 'mysecret', // 세션 암호화에 사용될 키
  resave:false,
  saveUninitialized:true
}))
=======

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
//express-session 미들웨어를 사용하여 세션 관리
app.use(session({
  secret: 'mysecret', // 세션 암호화에 사용될 키
  resave:false,
  saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter)
>>>>>>> Stashed changes

app.listen(PORT,()=>{
  console.log(`${PORT}번 포트에서 서버 실행중 . . . `)
})