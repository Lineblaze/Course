const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { User,  Office, Teacher, Order, Price, Recommendation} = require('../models.js');


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index', {});
});
router.get('/loginPage', (req, res) => {
  res.status(200).render('login', {});
});
router.get('/teachers', (req, res) => {
  res.status(200).render('teachers', {});
});
router.get('/register', (req, res) => {
  res.status(200).render('register', {});
});
router.get('/profile', (req, res) => {
  res.status(200).render('profile', {});
});
router.get('/order', (req, res) => {
  res.status(200).render('order', {});
});
router.get('/admin', (req, res) => {
  res.status(200).render('admin', {});
});

router.get('/getRecommendations', async (req, res) => {
  let recommendations = await Recommendation.findAll();
  
  res.json(recommendations);
});
router.get('/getOffices', async (req, res) => {
  let offices = await Office.findAll();
  
  res.json(offices);
});
router.get('/getTeachers', async (req, res) => {
  let teachers = await Teacher.findAll();
  
  res.json(teachers);
});
router.get('/getOrders', async (req, res) => {
  let orders = await Order.findAll();
  
  res.json(orders);
});
router.get('/getPrices', async (req, res) => {
  let prices = await Price.findAll();
  
  res.json(prices);
});
router.get('/getUsers', async (req, res) => {
  let users = await User.findAll();
  
  res.json(users);
});


router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    });
    
    console.log(user);
    
    res.status(200).render('login', {
      username: user.dataValues.username,
      user_id: user.dataValues.id
    });
    
  } catch (e) {
    res.status(400).send('Error!');
  }
  
});

router.post('/createUser', async (req, res) => {
  let userData = {
    username: req.body.username,
    password: req.body.password
  };
  
  try {
  
    let user = await User.create(userData);
    
    res.status(200).render('register', {
      username: user.dataValues.username,
      user_id: user.dataValues.id
    });
    
  } catch (e) {
    console.log('Error while creating a user!');
    res.status(400).send(e);
  }
  
  
});

router.post('/createTeacherAndOffice', async (req, res) => {
  let teacherData = {
    username: req.body.username
  };
  
  let officeData = {
    model: req.body.office_model,
    number: req.body.office_number
  }
  
  try {
    let teacher = await Teacher.create(teacherData);
    teacher.office_id = teacher.dataValues.id;
    await teacher.save();
    
    let office = await Office.create(officeData);
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while creating a teacher or a office!');
    
    res.status(400).send(e);
  }
});

router.post('/updateTeacherAndOffice', async (req, res) => {
  
  let reqID = req.body.id;
  
  let teacherData = {
    username: req.body.username
  };
  
  let officeData = {
    number: req.body.office_number,
    model: req.body.office_model
  }
  

  
  try {
    let teacher = await Teacher.findOne({ where: { id: reqID } });
    let office = await Office.findOne({ where: { id: reqID } });
    
    if (teacherData.username) {
      teacher.username = teacherData.username;
      await teacher.save();
    }
    
    if (officeData.number) {
      office.number = officeData.number;
      await office.save();
    }
    
    if (officeData.model) {
      office.model = officeData.model;
      await office.save();
    }
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while creating a teacher or a office!');
    
    res.status(400).send(e);
  }
  
  
});

router.post('/deleteTeacherAndOffice', async (req, res) => {
  try {
    let reqID = req.body.id;
    
    let teacher = await Teacher.findOne({where: { id: reqID } });
    let office = await Office.findOne({ where: { id: teacher.dataValues.office_id } });
    
    console.log(teacher.dataValues.isBusy);
    
    if (teacher.dataValues.isBusy) {
      let order = await Order.findOne({ where: { id: teacher.dataValues.order_id } });
      let recommendation = await Recommendation.findOne({ where: { id: order.dataValues.recommendation_id } });
      
      await order.destroy();
      await recommendation.destroy();
    }
    
    await teacher.destroy();
    await office.destroy();
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while deleting a teacher or a office!');
    
    res.status(400).send(e);
  }
  
});


router.post('/createOrder', async (req, res) => {
  let recommendationData = {
    title: req.body.text_title,
    text: req.body.text,
    user_id: req.body.user_id
  };
  try {
    let recommendation = await Recommendation.create(recommendationData);
    
    let orderData = {
      recommendation_id: recommendation.dataValues.id,
      user_id: req.body.user_id
    };
    
    let order = await Order.create(orderData);
    
    let teacher = await Teacher.findOne({ 
      where: {
        isBusy: false
      } 
    });
    
    if (!teacher) throw new Error('Все редакторы сейчас заняты');
    
    teacher.order_id = order.dataValues.id;
    teacher.isBusy = true;
    await teacher.save();
    
    res.status(200).render('order', {});
  } catch (e) {
    console.log('Возникла ошибка');
    
    res.status(400).send(e);
  }
  
  
});

router.get('/getOrderTable', async(req, res) => {
  let orders = await Order.findAll();
  let teachers = [];
  let users = [];
  let recommendations = [];
  
  try {
    for (let i = 0; i < orders.length; i++) {
      teachers.push(await Teacher.findOne({ where: { order_id: orders[i].dataValues.id } }));
      users.push(await User.findOne({ where: { id: orders[i].dataValues.user_id } }));
      recommendations.push(await Recommendation.findOne({ where: orders[i].dataValues.recommendation_id }));
    }
    
    res.status(200).json({orders, teachers, users, recommendations});
  } catch (e) {
    res.status(200).json({orders, teachers, users, recommendations});
  }
  
  
  
});

module.exports = router;