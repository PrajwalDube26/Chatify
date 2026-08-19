const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const user_auth_router = require("./router/UserRoute");
const friend_router = require("./router/FriendsRoute");


const app = express();
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose.connect(mongoURI)
    .then(() => { console.log("connection succesful to database") })
    .catch((err) => { console.log(err) });

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());              //for JSON data
app.use(express.urlencoded({ extended: true }));  //for form-data / x-www-form-urlencoded
app.use(cookieParser());


app.use("/api/auth", user_auth_router);
app.use("/api/friend", friend_router);

app.listen(port, () => {
    console.log(`connected to port ${port}`)
})