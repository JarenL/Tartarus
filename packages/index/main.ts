// import { TartarusContract, TartarusProxie } from 'tartarus-contract';
import * as ipfsearch from "./ipfsearch-indexlib"

const tartarusContract = require('tartarus-contract/build/contracts/Tartarus.json');
const tartarusProxie = require('tartarus-contract/./.openzeppelin/ropsten.json');

const fs = require('fs');
const web3 = require('web3');
const bs58 = require('bs58');
const IPFS = require('ipfs-http-client');
const IPFSMini = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const ipfsMini = new IPFSMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const getTartarusAddress = () => {
  return tartarusProxie.proxies['tartarus-contract/Tartarus'][
    tartarusProxie.proxies['tartarus-contract/Tartarus'].length - 1
  ].address;
};

let provider = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/bdeb06c1bd2e4458aedfd3ada2fa4366"));
var instance = new provider.eth.Contract(tartarusContract.abi, getTartarusAddress());
let indexer = new ipfsearch.Indexer();


let getPosts = async props => {
  await appendPostsToIndex(props);
};

let appendPostsToIndex = async props => {
  await Promise.all(props.map(post => appendPostToIndex(post)));
}

let appendPostToIndex = async props => {
  let postData = await instance.methods.getPost(props.returnValues.forum, props.returnValues.postId).call();
  const postHex = '1220' + postData[0].slice(2);
  const postBytes32 = Buffer.from(postHex, 'hex');
  const postIpfsHash = bs58.encode(postBytes32); 
  let postIpfsData = await ipfsMini.catJSON(postIpfsHash);
  if (postIpfsData !== null) {
    let postTitle = postIpfsData.title;
    let postPost = postIpfsData.post;
    console.log(postTitle + " " + postPost)
    indexer.addToIndex(new ipfsearch.Document(props.returnValues.postId, postTitle + " " + postPost))
  }  
}

let main = async () => {
  const posts = await instance.getPastEvents("PostCreated", {
    fromBlock: 0,
    toBlock: "latest"
  });

  await getPosts(posts); 

  indexer.persist("assets/inv/", "assets/inx/","Jaren Lynch","Tartarus Index", "", 1000)
  ipfs.addFromFs('./assets', { recursive: true }, (err, assetsResult) => {
    console.log(assetsResult)
    let metaFile = require('./assets/inx/.meta.json')
    metaFile.inxURLBase = '/ipfs/' + assetsResult[4].hash + '/inx/';
    metaFile.invURLBase = '/ipfs/' + assetsResult[4].hash + '/inv/';
    if (err) { throw err }
    ipfsMini.addJSON(metaFile, (err, ipfsAddress) => {
      // console.log(ipfsAddress)
      // const addr = '/ipfs/' + ipfsAddress;
      // ipfs.name.publish(addr, (err, ipnsAddress) => {
      //   console.log(ipnsAddress);
      //   // console.log(`https://gateway.ipfs.io/ipns/${result.name}`)
      // });

      let indexAddress = JSON.stringify({ "index-address" : ipfsAddress });
      fs.writeFile('index-address.json', indexAddress, function(err) {
        // Deal with possible error here.
        console.log(err, ipfsAddress);
      });

    });  
    // https://ipfs.infura.io/ipfs/QmcMkXkR2EqUrAXQqpb9HE8e4UKgU4aa13fW7L8JDgsPuR
  })
};

main();