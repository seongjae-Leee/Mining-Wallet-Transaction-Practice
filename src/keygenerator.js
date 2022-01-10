const EC = require('elliptic').ec; // 개인/공용 키 생성 및 서명인증을 위한 모듈
const ec = new EC('secp256k1'); // 지갑 알고리즘

const key = ec.genKeyPair();
const privateKey = key.getPrivate('hex');
const publicKey = key.getPublic('hex');

console.log("Private Key : ", privateKey);
console.log("Public Key : ", publicKey);


