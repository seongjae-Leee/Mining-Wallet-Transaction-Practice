const { BlockChain, Transaction } = require('./blockchain');




// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
let mimiCoin = new BlockChain();

mimiCoin.createTransaction(new Transaction("address111", "address222", 100));
mimiCoin.createTransaction(new Transaction("address222", "address111", 30));

console.log('\n Starting the Miner1....');
mimiCoin.minePendingTrasactions("seongjaes home");;

console.log('\n Balance of seongjae is', mimiCoin.getBalanceOfAddress("seongjaes home"));

console.log('\n Starting the Miner2....');
mimiCoin.minePendingTrasactions("seongjaes home");;

console.log('\n Balance of seongjae is', mimiCoin.getBalanceOfAddress("seongjaes home")); // 다음 블록이 채굴되어야


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


