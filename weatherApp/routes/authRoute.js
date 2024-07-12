const express = require('express');
const router = express.Router();
const { 
    getSingleUser,
    createUser,
    loginUserCtrl,
   sendWeatherReports,
   getUserWeatherData,
    updateaUser,
    handleRefreshToken,
    logoutUser
} = require('../controller/userCtrl');
const {authMiddleWare} = require('../middlewares/authMiddleWare');

router.post('/register',createUser);//register user
router.post('/login',loginUserCtrl);//login user
router.put('/edit-user',authMiddleWare,updateaUser);//update Location
router.get('/bydate/:id/:date',authMiddleWare,getUserWeatherData);//give weather data by date   
router.post('/weather/:id',authMiddleWare,sendWeatherReports);//if want manuaaly get details route
router.get('/refresh',authMiddleWare,handleRefreshToken);//tokenrf
router.get('/logout',authMiddleWare,logoutUser); //logout
router.get('/:id',authMiddleWare,getSingleUser);//getsingleuserdetails

module.exports = router;
 