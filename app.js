const express = require('express');
const mongoose = require('mongoose');
const emailValidator=require('email-validator');
const cookieParser = require('cookie-parser');

const app = express();
app.listen(3000);
app.use(express.json());
app.use(cookieParser());

const userRouter = require('./Routers/userRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');
//base route , router to use
app.use("/user", userRouter);
app.use("/plans", planRouter);
app.use("/review", reviewRouter);
app.use("/booking",bookingRouter);


