const transaction =  require("../controllers/transaction.controller");
const axios = require("axios");

module.exports = (app) => {

    app.get("/api/transaction/mint", transaction.mint);
    app.post("/api/transaction/check", async (req, res) => {
        let res1 = await axios.get("https://gotchiheroes.com/server/generator.php?count=7&starterPack=true");
        res.send(res1.data);
    })

}