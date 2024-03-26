const { Router } = require("express"); // import router from express
const Models = require("../models/Models"); // import user model
const {isLoggedIn} = require("./middleware"); // import jwt to sign tokens

const router = Router(); // create router to create route bundle

router.get("/", isLoggedIn, async (req, res) => {
    console.log("got here");
    try {
        let {username} = req.user; // get username from req.user property created by isLoggedIn middleware
        console.log("User:" + username);
        let player = await Models.Player.findOne({
            where: {username: username},
            include: {association: [ Models.Player.Wagers ]}
        });
        console.log("Player: " + player.wagers);
        res.json(player.wagers);
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post("/", isLoggedIn, async (req, res) => {
    console.log("got here");
    try {
        let {username} = req.user; // get username from req.user property created by isLoggedIn middleware
        console.log("User:" + username);
        let player = await Models.Player.findOne({
            where: {username: username}
        });
        let wager = await Models.Wager.build(req.body);
        wager.PlayerId = player.id;
        wager = await wager.save();
        res.status(201).json(wager);g
    } catch (error) {
        res.status(400).json({error})
    }
});

router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        // check if the user exists
        let wager = await Models.Wagers.findByPk(req.params.id);
        console.log(wager.toJSON());
        if (wager) {
            res.json({ wager });
        } else {
            res.status(400).json({ error: "Wager doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router