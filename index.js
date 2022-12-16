const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const accountsRoute = require('./routes/accounts');
const userRoute = require("./routes/users")

// configure dotenv
require('dotenv'). config(); 

const app = express();
app.use(cors())

//middlewares
app.use(express.json());

const PORT = process.env.PORT || 5500;


mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}))
  .catch((err) => console.log(err));




app.use("/api/user/accounts", accountsRoute);
app.use("/api/user", userRoute)