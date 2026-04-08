require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const binRoutes = require('./routes/segregateRoute');
const shopRoutes = require('./routes/shopRoute');
const mcUsers = require('./routes/mcUserRoute');
const userRoutes = require('./routes/userRoute');
const notificationRoutes = require('./routes/notificationRoute');
const lanebinRoutes = require('./routes/laneRoute');
const initMQTT = require('./services/mqttService');
const initHouseholdMQTT = require('./services/householdMqttService');

const app = express();
app.use(cors({
  origin: [
    'https://app.envotix.com',
    'http://localhost:5173',
    'http://localhost:8081',
    'http://localhost:19006'
  ],
  credentials: true
}));
app.use(express.json());

initMQTT();
initHouseholdMQTT();

// connecting with the Data_Envotix database in MongoDB Atlas using Environment Variables
const mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/Data_Envotix";

mongoose.connect(mongoUrl)
    .then(() => console.log("ENVOtix Database Connected"))
    .catch(err => console.error("Connection Error:", err));

app.use('/api/bins', binRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/auth', mcUsers);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lanebins', lanebinRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));