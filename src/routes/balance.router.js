const controller = require("../controllers/balance.controller");

module.exports =  (app) => {

    app.get("/api/balance/pack/:account", controller.getPacks)
    app.get("/api/balance/gotchi/:account", controller.getGotchis)
    app.get("/api/balance/items/pack/:account", controller.getPackItems);
    app.get("/api/balance/items/gotchi/:account", controller.getGotchiItems);
    app.get("/api/balance/check", (req, res) => {
        res.send("Welcome balance api")
    });

}