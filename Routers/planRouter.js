const express = require("express");
const planRouter = express.Router();
const {protectRoute,isAuthorized}=require("../controller/authController");
const {getAllPlans,getPlan,createPlan,updatePlan,deletePlan,top3Plans}= require('../controller/planController');

//all plans leke aayega 
planRouter.route('/allPlans')
.get(getAllPlans)

planRouter.route('/top3').get(top3Plans)

//own plan -> logged in necessary 
planRouter.use(protectRoute);
planRouter.route('/plan/:id')
.get(getPlan);


// admin nd restaurant owner can only create,update or delte plans 
planRouter.use(isAuthorized(['admin','restaurantowner']));
planRouter
.route('/crudPlan')
.post(createPlan)

planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

module.exports=planRouter