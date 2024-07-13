
<h3>.env file</h3><br>

<ul>
  <li>PORT=your_port_number</li>
  <li>MONGODB_URL=your_mongodb_url</li>
  <li>JWT_SECRET=your_jwt_secret</li>
  <li>OPENWEATHERMAP_API_KEY=your_openweathermap_api_key</li>
  <li>OPENAI_API_KEY=your_openai_api_key</li>
  <li>GOOGLE_API_KEY=your_google_api_key</li>
  <li>EMAIL_USER=your_email_user</li>
  <li>EMAIL_PASS=your_email_password</li>
  <li>GKEY=your gemini _gkey</li>
</ul>

<br>

<h2>Endpoints</h2>

<ul>
  <li><strong>Login:</strong> <a href="https://weatherapp-7fay.onrender.com/api/user/login">https://weatherapp-7fay.onrender.com/api/user/login</a></li>
  <code>
    {
      "email":"wgkbandara@gmail.com",
      "password":"1258633"
    }
  </code>

  <li><strong>Register:</strong> <a href="https://weatherapp-7fay.onrender.com/api/user/register">https://weatherapp-7fay.onrender.com/api/user/register</a></li>
  <code>
    {
      "email":"wgk5badd5ndara@gmail.com",
      "password":"12534543",
      "location":{
        "lat":44.34,
        "lon":10.99
      }
    }
  </code>

  <li><strong>Update Location:</strong> <a href="https://weatherapp-7fay.onrender.com/api/user/edit-user">https://weatherapp-7fay.onrender.com/api/user/edit-user</a></li>
  <code>
    {
      "email":"wgkbandara@gmail.com",
      "location":{
        "lat":74.723185,
        "lon":8022.652888
      }
    }
  </code>

  <li><strong>Get By Date:</strong> <a href="https://weatherapp-7fay.onrender.com/api/user/bydate/6691686ae03fa2e3deb4c38e/2024-07-12">https://weatherapp-7fay.onrender.com/api/user/bydate/6691686ae03fa2e3deb4c38e/2024-07-12</a></li>

  <li><strong>Logout:</strong> <a href="https://weatherapp-7fay.onrender.com/api/user/logout">https://weatherapp-7fay.onrender.com/api/user/logout</a></li>
</ul>


<h3>how to deploy in AWS</h3><br> 
To host your application, start by configuring an EC2 instance and making sure it satisfies your operating system and resource needs. To run your application code on the instance, install Node.js and npm, then set up security groups to restrict access. Configure connectivity and set up MongoDB using Amazon RDS if your application needs data storage. Use AWS Certificate Manager (ACM) to implement HTTPS for secure communication, and use AWS Route 53 for DNS management to manage domain names. Use Amazon CloudWatch to track the performance of your application, create alarms, and think about auto-scaling and load balancing to manage fluctuating traffic loads efficiently.
