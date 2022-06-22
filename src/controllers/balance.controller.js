let service = require('../service');
let axios = require("axios");
let { packAddress, gotchiAddress } = require('../config');

exports.getPacks = async (req, res) => {

  let uris = [];
  let ids = [];
  try {
    uris = await service.packContract.methods.holderTokenUris(req.params.account).call();
    ids = await service.packContract.methods.holderTokenIds(req.params.account).call();
  }catch (err){
    console.log(err)
  }
  
  res.send({uris, ids});
}


exports.getGotchis = async (req, res) => {
  let uris = [];
  let ids = [];
  try {
    uris = await service.gotchiContract.methods.holderTokenUris(req.params.account).call();
    ids = await service.gotchiContract.methods.holderTokenIds(req.params.account).call();
  }catch (err){
    console.log(err)
  }
  res.send({uris, ids});
}

exports.getPackItems = async (req, res) => {
  let uris = [];
  let ids = [];
  try {
    let result = await service.marketContract.methods.viewItemsByCollectionAndSeller(packAddress, req.params.account).call();
    uris = result.tokenUris;
    ids = result.tokenIds;
  }catch (err){
    console.log(err)
  }
  
  let packs = [];

  for(let i=0 ; i<uris.length ; i++) {
    let res = await axios.get(uris[i])
    packs.push(res.data);
  }

  res.send({packs: packs, ids});
}


exports.getGotchiItems = async (req, res) => {

  let uris = [];
  let ids = [];
  console.log(req.params.account)
  try {
    let result = await service.marketContract.methods.viewItemsByCollectionAndSeller(gotchiAddress, req.params.account).call();
    uris = result.tokenUris;
    ids = result.tokenIds;
  }catch (err){
    console.log(err)
  }
  
  let gotchis = [];

  for(let i=0 ; i<uris.length ; i++) {
    let res = await axios.get(uris[i])
    gotchis.push(res.data);

  }

  res.send({gotchis: gotchis, ids});
}
