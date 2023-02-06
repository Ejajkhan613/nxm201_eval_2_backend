const express = require("express");
require('dotenv').config()

// Custom Modules
const { connection } = require("./configs/db");
const { userRoute } = require("./routes/userRoute");
const { goldRoute } = require("./routes/goldRates");
const { userStatsRoute } = require("./routes/statsRoute");


const app = express();
const port = process.env.port_num;


// Routes and segregation

app.get("/", (req, res) => {
    res.send("Welcome to NXM201 Evaluation 2 Backend Server");
})


// Users Route
app.use("/users", userRoute);


// Goldrates Route
app.use("/goldrate", goldRoute);


// Stats Route
app.use("/userstats", userStatsRoute)


app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error while connecting to DB")
    }
    console.log(`Listening to the port ${port}`)
})