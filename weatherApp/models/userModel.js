const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');

// Declare the Schema of sub object
const weatherDataSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    coord: {
        lon: Number,
        lat: Number
    },
    weather: [{
        id: Number,
        main: String,
        description: String,
        icon: String
    }],
    base: String,
    main: {
        temp: Number,
        feels_like: Number,
        temp_min: Number,
        temp_max: Number,
        pressure: Number,
        humidity: Number,
        sea_level: Number,
        grnd_level: Number
    },
    visibility: Number,
    wind: {
        speed: Number,
        deg: Number,
        gust: Number
    },
    clouds: {
        all: Number
    },
    dt: Number,    
    timezone: Number,
    id: Number,
    name: String,
    cod: Number
});

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true,
    },    
    password:{
        type:String,
        required:true,
    },    
    refreshToken:{
        type:String,
    },
    location: {
        lat: { type: Number},
        lon: { type: Number}
    },
    weatherData: [weatherDataSchema]
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
}); 
userSchema.methods.isPasswordMatched = async function(enteredPassword){   
    return await bcrypt.compare(enteredPassword,this.password);
};

module.exports = mongoose.model('User', userSchema);