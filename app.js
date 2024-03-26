require("dotenv").config() // load .env variables
const {log} = require("mercedlogger") // import mercedlogger's log function
const cors = require("cors") // import cors
const bcrypt = require("bcryptjs");
const Models = require("./models/Models");
const jwt = require("jsonwebtoken");
const sequelize = require("./db/connection")
const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();

// GLOBAL MIDDLEWARE
app.use(cors()) // add cors headers
app.use(express.json()) // parse json bodies

const PlayerRouter = require("./controllers/PlayerController")
const WagerRouter = require("./controllers/WagerController")
const PeriodRouter = require("./controllers/PeriodController")
const {isLoggedIn} = require("./controllers/middleware");

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

app.listen(PORT, () => {
    log.green("SERVER STATUS", `Listening on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.json("this is the test route to make sure server is working")
})

app.post("/signup", async (req, res) => {
    try {
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
        // create a new user
        let user = await Models.Player.create(req.body);
        // send new user as response
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
});

// Login route to verify a user and get a token
app.post("/login", async (req, res) => {
    try {
        // check if the user exists
        let user = await Models.Player.findOne({username: req.body.username});
        if (user) {
            //check if password matches
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                // sign token and send it in response
                const token = await jwt.sign({username: user.username}, SECRET);
                res.status(200).json({token});
            } else {
                res.status(400).json({error: "password doesn't match"});
            }
        } else {
            res.status(404).json({error: "User doesn't exist"});
        }
    } catch (error) {
        res.status(400).json({error});
    }
});

app.use("/player", PlayerRouter);
app.use("/wager", WagerRouter);
app.use("/period", PeriodRouter);

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.status(200).json(status);
});

app.get("/dbsync", (req, res) => {
    let force = req.query.force;
    console.log("Force: " + force);
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
        if (force) {
            console.log("Used force.");
            sequelize.sync({force: true}).then(() => {
                res.status(200).json('Database synced successfully.');
            }).catch((error) => {
                res.status(400).json('Unable to sync database: ' + error);
            });
        } else {
            console.log("Didn't use force.");
            sequelize.sync().then(() => {
                res.status(200).json('Database synced successfully.');
            }).catch((error) => {
                res.status(400).json('Unable to sync database: ' + error);
            });
        }
    }).catch((error) => {
        res.status(400).json('Unable to sync database: ' + error);
    });
});