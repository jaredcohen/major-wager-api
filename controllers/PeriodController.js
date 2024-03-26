const { Router } = require("express"); // import router from express
const Models = require("../models/Models"); // import user model
const {isLoggedIn} = require("./middleware");
const events = require("events");

const router = Router(); // create router to create route bundle

router.get("/", isLoggedIn, async (req, res) => {
    try {
        let { username } = req.user; // get username from req.user property created by isLoggedIn middleware
        //send all todos with that user
        let periodList = await Models.Period.findAll();
        res.status(200).json(periodList);
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post("/", isLoggedIn, async (req, res) => {
    console.log("POST New Period.");
    const period = await Models.Period.create(req.body,{
        include: [{
            association: Models.Period.Events,
            include: [ Models.Event.EventTeams ]
        }]
    });
    //let period = await Models.Period.create(req.body);
    res.status(201).json(period);
});

router.get("/:id", isLoggedIn, async (req, res) => {
    console.log("GET Period By ID.");
    try {
        // check if the user exists
        let period = await Models.Period.findByPk(req.params.id,
            { include: [{
                association: Models.Period.Events,
                include: [ Models.Event.EventTeams ]
                }]
            });
        if (period) {
            res.status(200).json({ period });
        } else {
            res.status(404).json({ error: "Period doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/:id/events", isLoggedIn, async (req, res) => {
    console.log("GET Events By Period ID.");
    try {
        // check if the user exists
        const period = await Models.Period.findByPk(req.params.id, {include: events});
        console.log(period.toJSON());
        let events = period.events
        console.log(events.toJSON());
        if (events) {
            res.status(200).json({ events });
        } else {
            res.status(404).json({ error: "Events do not exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/:id/activate", isLoggedIn, async (req, res) => {
    console.log("GET Activate period By ID.");
    try {
        // check if the user exists
        let period = await Models.Period.findByPk(req.params.id);
        if (period) {
            period.is_active = true;
            res.status(200).json({ period });
        } else {
            res.status(404).json({ error: "Period doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router