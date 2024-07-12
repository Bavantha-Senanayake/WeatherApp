const User=require('../models/userModel');
const token=require('../config/jwtToken');
const asyncHandler=require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt=require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');

//cretae a user
const createUser=asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const findUser=await User.findOne({email:email});
    if(!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error('User already exists');
    }  
});

//login user
const loginUserCtrl=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
   //check if user exists or not
   const findUser=await User.findOne({email});
   if(findUser && (await findUser.isPasswordMatched(password))){
    const refreshToken= await generateRefreshToken(findUser?._id);
    const updateaUser=await User.findByIdAndUpdate(
        findUser._id,
        {
            refreshToken:refreshToken
        },
        {
            new:true
        });
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
           
        });
         
        startCronJob(findUser._id);  // Start cron job
        
    res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:token.generateToken(findUser?._id),
       });

    }else{
        throw new Error('Invalid email or password');
    }
});

//setup every 3 hour task
let task;

const startCronJob = (userId) => {
    if (task) {
        task.stop();  
    }
    task = cron.schedule('* * * * *', () => {  
        sendWeatherReports(userId);
    }, {
        scheduled: true
    });
};

const stopCronJob = () => {
    if (task) {
        task.stop();
    }
};
  
//handle refresh token
const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie.refreshToken)
        throw new Error('no refresh token in cookie');
        const refreshToken=cookie.refreshToken;   
        const user=await User.findOne({refreshToken:refreshToken});
        if(!user)
            throw new Error('no refresh token presen in db ir noit mathcerd');
        jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
            if(err || user.id!==decoded.id){
                throw new Error('token error');
            }
            const accessToken=token.generateToken(user._id);    
                res.json({
                    accessToken,            
            }); 
    });
});

//logout user
const logoutUser=asyncHandler(async(req,res)=>{ 
    const cookie=req.cookies;
    if(!cookie.refreshToken)
        throw new Error('no refresh token in cookie');
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken:refreshToken});  
    if(user){
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true,
        });
        stopCronJob();  // Stop cron job
        return res.json({message:'logout successfully'});
    }
    await User.findOneAndUpdate(refreshToken,{refreshToken:null});
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
    });
    res.status(204).json({message:'logout successfully'});
});

//get a single user
const getSingleUser=asyncHandler(async(req,res)=>{
    try{
        const getUser=await User.findById(req.params.id);
        res.json(getUser);
    }catch (error) {   
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

//update a userLocation
const updateaUser = async (req, res) => {
    const { email, location } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email }, { location }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('Location updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

//fetch user data acording to userid and given date
const getUserWeatherData=asyncHandler(async(req,res)=>{
    const { id, date } = req.params;
    try{
        const user=await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const weatherData = user.weatherData.filter((data) => {
            const dataDate = new Date(data.date).toLocaleDateString();
            return dataDate === date;
        });
        res.json(user);
    }catch(error){
        throw new Error(error);
    }
});
// Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GKEY);
const genarateText = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        console.log(result);        
        const generatedText = result.response.text();
        return generatedText; 
    } catch (error) {
        throw error; 
    }
};

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
   
});
// Google Maps Client
const googleMapsClient = new Client({});

// Fetch weather data, generate text, and send email
const sendWeatherReports = async (id, res) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { lat, lon } = user.location;
        if (!lat || !lon) {
            return res.status(400).json({ message: 'User location is not set' });
        }

        // Get city name from coordinates using Google Geocoding API
        const geoResponse = await googleMapsClient.reverseGeocode({
            params: {
                latlng: [lat, lon],
                key: process.env.GOOGLE_API_KEY,
            }
        });
        const address = geoResponse.data.results[0].formatted_address;
           
        // Fetch weather data from OpenWeatherMap API
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
        const weather = weatherResponse.data;

        // Convert temperatures from Kelvin to Celsius
        const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);
        const sumArray = [
            kelvinToCelsius(weather.main.temp),
            kelvinToCelsius(weather.main.feels_like),
            kelvinToCelsius(weather.main.temp_min),
            kelvinToCelsius(weather.main.temp_max),
            weather.main.pressure,
            weather.main.humidity,
            weather.wind.speed,
            weather.wind.deg,
            weather.clouds.all,
            new Date(weather.sys.sunrise * 1000).toLocaleTimeString(),
            new Date(weather.sys.sunset * 1000).toLocaleTimeString(),
            weather.timezone,
            weather.name,
            weather.cod,
            weather.id,
            weather.coord.lon,
            weather.coord.lat,
            weather.visibility,
            weather.base,
            new Date(weather.dt * 1000).toLocaleString(),
        ];

        // Format the array into a summary text
        const summary = `
            Weather Summary for ${weather.name}:
            - Temperature: ${sumArray[0]}°C
            - Feels Like: ${sumArray[1]}°C
            - Min Temperature: ${sumArray[2]}°C
            - Max Temperature: ${sumArray[3]}°C
            - Pressure: ${sumArray[4]} hPa
            - Humidity: ${sumArray[5]}%
            - Wind Speed: ${sumArray[6]} m/s
            - Wind Direction: ${sumArray[7]}°
            - Cloudiness: ${sumArray[8]}%
            - Sunrise: ${sumArray[9]}
            - Sunset: ${sumArray[10]}
            - Timezone: UTC${sumArray[11] / 3600 >= 0 ? '+' : ''}${sumArray[11] / 3600}
            - Location: (${sumArray[15]}, ${sumArray[16]})
            - Visibility: ${sumArray[17]} meters
            - Base: ${sumArray[18]}
            - Data Time: ${sumArray[19]}
            - Weather Code: ${sumArray[13]}
            - Weather ID: ${sumArray[14]}
        `;

        // Generate text using genarateText function
        const generatedText = await genarateText('Hourly weather report: ' + summary);

        // Save detailed weather data to the database
        user.weatherData.push({
            date: new Date(),
            coord: weather.coord,
            weather: weather.weather,
            base: weather.base,
            main: weather.main,
            visibility: weather.visibility,
            wind: weather.wind,
            clouds: weather.clouds,
            dt: weather.dt,
            timezone: weather.timezone,
            id: weather.id,
            name: weather.name,
            cod: weather.cod
        });
        await user.save();
        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Hourly Weather Report',
            text: `Weather update in ${address} in:\n${generatedText}`,
        });       
    } catch (error) {
        console.error('Error fetching weather data or sending email:', error);
    }
};

module.exports={logoutUser,handleRefreshToken,createUser,loginUserCtrl,getSingleUser,updateaUser,getUserWeatherData,sendWeatherReports}; 