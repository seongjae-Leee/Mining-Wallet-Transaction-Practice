const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec; // 개인/공용 키 생성 및 서명인증을 위한 모듈
const ec = new EC('secp256k1'); // 지갑 알고리즘


const myKey = ec.keyFromPrivate('c9c5bd86b8e67cf5c1fdbc5beb0784113df80bf9371ec4cd7aeb5ec065ca221c');
const myWalletAddress = myKey.getPublic('hex');


// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
let mimiCoin = new Blockchain();

// 거래 생성하고 사인해서 더해주기
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 15);
tx1.signTransaction(myKey);
mimiCoin.addTransaction(tx1);

// // 새로운 거래를 만들어서 확인하는 것 (서명없는 거래)
// mimiCoin.addTransaction(new Transaction("address111", "address222", 100));
// mimiCoin.addTransaction(new Transaction("address222", "address111", 30));

console.log('\n Starting the Miner1....');
// mimiCoin.minePendingTrasactions("seongjaes home");
mimiCoin.minePendingTrasactions(myWalletAddress);
console.log('\n Balance of seongjae is', mimiCoin.getBalanceOfAddress(myWalletAddress));
// // 거래 조작 시도(15개 안 보내고 7개 보냈다 라는 식으로)
// mimiCoin.chain[1].transactions[0].amount = 1; // isChainValid에서 false 뜸. 왜냐하면 서명이 더이상 일치하지 않기 때문이다.

// 거래를 넣은 체인이 유효한지 확인
console.log('Is Chain Valid?', mimiCoin.isChainValid()); // true

// console.log('\n Starting the Miner2....');
// mimiCoin.minePendingTrasactions("seongjaes home");;
// console.log('\n Balance of seongjae is', mimiCoin.getBalanceOfAddress("seongjaes home")); // 다음 블록이 채굴되어야


// --------------------------- 블록 연결 ---------------------------------
// mimiCoin.addBlock(new Block(1, "01/02/2022", { amount: 4 }));
// mimiCoin.addBlock(new Block(2, "03/02/2022", { amount: 10 }));

// // 3) difficulty 값에 따라 채굴시간이 길어지고 짧아지는거 확인
// console.log("Data Mining block 1....");
// console.log("Data Mining block 2....");
// // 2) 데이터 변조 시도
// mimiCoin.chain[1].transactions = { amount: 77 }; // 데이터 변조 시도(1) .. 거래에서 실제보다 더 많이 받은 것처럼
// mimiCoin.chain[1].hash = mimiCoin.chain[1].calculateHash(); // 데이터 변조 시도(2) .. 해쉬값도 계산해서 넣어주려 했으나~
// console.log("Is blockchain valid?", mimiCoin.isChainValid()); // 위에서 임의로 데이터를 바꾸려고 했기 때문에 false 나옴
// // 1) 코인들 잘 보이는지 확인
// console.log(JSON.stringify(mimiCoin, null, 4));


