const service = require('../service');
const axios = require("axios");
const fs = require('fs');
const path = require("path");
const FormData = require('form-data');

const { ipfsLink } = require('../config');

const MetaData = {
  "name": "Hero of Ukraine, President Zelensky #",
  "description": "Heroes aren't born, they're made. President Zelensky wasn't born to be a politician but became one to help his country fight systemic corruption. Then on February 24th, 2022 when Russia invaded Ukraine, President Zelensky has become the world’s greatest heroes in a real-life struggle between good and evil.",
  "external_url": "https://twitter.com/ArtGala_eth",
  "Discord_url": "https://discord.gg/R5WmFT2Y",
  "image": "ipfs://newuri/1.png",
  "dna": "43c4fb5bb11f02746643b2e25a263198a82d3fab",
  "edition": 1448,
  "date": 1650980896909,
  "attributes": [
    {
      "trait_type": "Background",
      "value": "gradient with ukraine flag"
    },
    {
      "trait_type": "Accessories",
      "value": "rpg"
    },
    {
      "trait_type": "Skin",
      "value": "skin"
    },
    {
      "trait_type": "Body wear",
      "value": "military uniform"
    },
    {
      "trait_type": "Face accessories",
      "value": "none"
    },
    {
      "trait_type": "Eye",
      "value": "original"
    },
    {
      "trait_type": "Head wear",
      "value": "helmet with ukrainian flag"
    },
    {
      "trait_type": "Mouth",
      "value": "original"
    }
  ]
};

exports.mint = async (req, res) => {

  await uploadFileToIpfs(req.params.dir)
  res.send({ success: true });
}


const uploadToIpfs = async data => {

  try {
    let res = await service.pinata.pinJSONToIPFS(data);

    return res.IpfsHash;
  }catch (e) {
    console.log(e)
    return null;
  }
}

const uploadFileToIpfs = async () => {

  let dirPath = "../input";
  dirPath = path.join(__dirname, dirPath);

  global.ids = await service.tokenContract.methods.totalSupply().call();

  try {
    let files = await fs.readdirSync(dirPath);
    //handling error
    

    global.CIDs = require("../output/cids.json");

    //listing all files using forEach
    for(let i=0 ; i<files.length ; i++){

      const readableStreamForFile = fs.createReadStream(`./src/input/${files[i]}`);
    
      try {
        let res = await service.pinata.pinFileToIPFS(readableStreamForFile);

        let content = MetaData;
        content.name = `${content.name}${++ global.ids}`;
        content.image = `${ipfsLink}${res.IpfsHash}`;
        content.date = new Date().getMilliseconds();

        let cid = await uploadToIpfs(content);
        console.log(cid, "cid");

        if(!cid) return null;

        let result = await service.mint(cid);
        if(!result) return;

        global.CIDs.cids.push(cid);
        console.log(global.CIDs)

      }catch (e) {
        console.log(e)
      }
    };

    return await fs.writeFileSync(`./src/output/cids.json`, JSON.stringify(global.CIDs));

  }catch (err) {
      return console.log('Unable to scan directory: ' + err);
  }
}
