const { Router } = require("express"); // import router from express
const Models = require("../models/Models"); // import user model
const {isLoggedIn} = require("./middleware"); // import jwt to sign tokens

const router = Router(); // create router to create route bundle

router.get("/", isLoggedIn, async (req, res) => {
    try {
        let { username } = req.user; // get username from req.user property created by isLoggedIn middleware
        //send all todos with that user
        let playerList = await Models.Player.findAll();
        res.json(playerList);
    } catch (error) {
        res.status(400).json({error})
    }
});

router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        // check if the user exists
        let player = await Models.Player.findByPk(req.params.id,
            { include: [{association: Models.Player.Wagers}]});
        if (player) {
            res.json({ player });
        } else {
            res.status(404).json({ error: "Player doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router