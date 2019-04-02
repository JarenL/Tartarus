// import ipfs from '../../../../../services/ipfs/ipfs';

const debug = require('debug')('services:ipfs:write');
const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

const {
  typedArrayToIpfsBuffer,
  objectToIpfsBuffer,
  noProvider,
  fileToIpfsBuffer,
  stringToIpfsBuffer
} = require('./util');

const uploadIpfsBuffer = async (ipfsBuffer, progressCb = () => {}) => {
  const res = await ipfs.add(ipfsBuffer);
  const ipfsHash = res[0].hash;
  console.log(ipfsHash);
  return ipfsHash;
};

const uploadObject = async object => {
  // if (!state.ipfs) noProvider()
  const buffer = objectToIpfsBuffer(object);
  return uploadIpfsBuffer(buffer);
};

const uploadString = async string => {
  debug('uploadString', string);
  // if (!state.ipfs) noProvider()

  const buffer = stringToIpfsBuffer(string);
  return uploadIpfsBuffer(buffer);
};

const uploadTypedArray = async (typedArray, progressCb) => {
  // if (!state.ipfs) noProvider()
  const buffer = typedArrayToIpfsBuffer(typedArray);
  return uploadIpfsBuffer(buffer, progressCb);
};

const uploadFilePath = path => {
  // if (!state.ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path);
  return uploadIpfsBuffer(buffer);
};

const uploadIpfsBufferWrappedWithDirectory = async (fileName, buffer) => {
  // if (!state.ipfs) noProvider()

  const data = [
    {
      path: fileName,
      content: buffer
    }
  ];

  return ipfs.add(data, { wrapWithDirectory: true });
};

const uploadFilePathWrappedWithDirectory = (fileName, path) => {
  // if (!state.ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path);

  const files = [
    {
      path: fileName,
      content: buffer
    }
  ];

  return ipfs.add(files, { wrapWithDirectory: true });
};

export {
  uploadObject,
  uploadString,
  uploadTypedArray,
  uploadIpfsBuffer,
  uploadFilePath,
  uploadIpfsBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory
};
