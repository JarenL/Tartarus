const ipfsearch = require('./ipfsearch-indexlib');

const web3 = require('web3');
const bs58 = require('bs58');
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
let indexer;

let provider = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/bdeb06c1bd2e4458aedfd3ada2fa4366"));

let TartarusContract = require('../src/contracts/Tartarus.json');
let tartarusAddress = '0x3ca7832b2edd307b075903e2aac2ff04308ad001';
var instance = new provider.eth.Contract(TartarusContract.abi, tartarusAddress);


let getPosts = async props => {
  let posts = await Promise.all(props.map(post => getPost(post)));
  return posts;
  // console.log(results[0]);
};

let getPost = props => {
  // console.log(props)
  return instance.methods.getPost(props.returnValues.forum, props.returnValues.postId).call();

};

let test = () => {
  var instance = new provider.eth.Contract(TartarusContract.abi, tartarusAddress);
  indexer = new ipfsearch.Indexer();

  instance.getPastEvents('PostCreated', {
    filter: {}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
  }, async (error, events) => { 
    let posts = await getPosts(events); 
    for (let post of posts) {
      console.log(post)
      const postHex = '1220' + post[0].slice(2);
      const postBytes32 = Buffer.from(postHex, 'hex');
      const postIpfsHash = bs58.encode(postBytes32);
      ipfs.catJSON(postIpfsHash).then(postData => {
        if (postData !== null) {
          // console.log(postData)
          let postTitle = postData.title;
          let postType = postData.type;
          let postPost = postData.post;
          let postCreator = provider.utils.hexToAscii(post[1]);
          indexer.addToIndex(new ipfsearch.Document(postIpfsHash,"ttest"))        
        } 
      })  
    }  
  })
  console.log(indexer)
};

test();
indexer.persist("assets/sortedindex.inx", "assets/index.inx","Jaren Lynch","Tartarus Posts Index","URL")


