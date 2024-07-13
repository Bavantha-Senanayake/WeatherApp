Weather App
Deployed in Rennder-https://weatherapp-7fay.onrender.com
Endpoints
Login = https://weatherapp-7fay.onrender.com/api/user/login
    { 
       "email":"wgkbandara@gmail.com",   
      "password":"1258633"
}

Register = https://weatherapp-7fay.onrender.com/api/user/register
    {    
       "email":"wgk5badd5ndara@gmail.com",   
      "password":"12534543",
      "location":{
        "lat":44.34,
        "lon":10.99
      }
}

Update Location = https://weatherapp-7fay.onrender.com/api/user/edit-user

{    
       "email":"wgkbandara@gmail.com",
      "location":{
        "lat":74.723185,
        "lon":8022.652888
      }
}


Get By Date = https://weatherapp-7fay.onrender.com/api/user/bydate/6691686ae03fa2e3deb4c38e/2024-07-12
Logout = https://weatherapp-7fay.onrender.com/api/user/logout

how to deply in was 
To host your application, start by configuring an EC2 instance and making sure it satisfies your operating system and resource needs. To run your application code on the instance, install Node.js and npm, then set up security groups to restrict access. Configure connectivity and set up MongoDB using Amazon RDS if your application needs data storage. Use AWS Certificate Manager (ACM) to implement HTTPS for secure communication, and use AWS Route 53 for DNS management to manage domain names. Use Amazon CloudWatch to track the performance of your application, create alarms, and think about auto-scaling and load balancing to manage fluctuating traffic loads efficiently.
