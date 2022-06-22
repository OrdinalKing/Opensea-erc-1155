const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require('web3')
const Token = require("./src/blockchain/abis/Token.json");
const service = require("./src/service");
const balanceRouter = require("./src/routes/balance.router");
const transactionRouter = require("./src/routes/transaction.router");
// const path = require("path");
const { tokenAddress, privateKey } = require("./src/config");

require('dotenv').config(/*{
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
}*/); 

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET_KEY);

pinata.testAuthentication().then((result) => {
  service.pinata = pinata;
  console.log({...result, sucess: true});
}).catch((err) => {
  //handle error here
  console.log({...err, sucess: false});
});

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
  try{
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
    // const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/21e6bcc402cc4195aaffb188e72f758a`));
    // const web3 = new Web3(new Web3.providers.HttpProvider(`https://rpc-mumbai.matic.today`));
    // const web3 = new Web3(new Web3.providers.HttpProvider(`https://rpc-mainnet.matic.network`));
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)

    service.web3 = web3;
    service.account = account;
    service.tokenContract = new web3.eth.Contract(Token.abi, tokenAddress);

    service.pinata = pinata;
    console.log(service.account.address)

  } catch (evt) {
    console.log(evt);
  }
})();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
      res.status(200).end()
      return;
  }
  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {
  return res.send("Welcome!");
});

app.get("/api/check", (req, res) => {
  return res.send("Server is started!");
});

balanceRouter(app);
transactionRouter(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
