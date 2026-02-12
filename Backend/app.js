const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const binRoutes = require('./routes/segregateRoute');
const shopRoutes = require('./routes/shopRoute');
const mcUsers = require('./routes/mcUserRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();
app.use(cors());
app.use(express.json());

// connecting with the Data_Envotix database in MongoDB Atlas
const mongoUrl = "mongodb+srv://sadithma20242193_db_user:himandiIIT20242193@cluster0.cjexidk.mongodb.net/Data_Envotix?appName=cluster0";

mongoose.connect(mongoUrl)
.then(() => console.log("ENVOtix Database Connected"))
    .catch(err => console.error("Connection Error:", err));

app.use('/api/bins', binRoutes); 
app.use('/api/shops',shopRoutes);
app.use('/api/auth',mcUsers);
app.use('/api',loginRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));