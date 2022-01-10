// 모든 코드를 담아둘 곳
const SHA256 = require('crypto-js/sha256');

// 우리가 이번 블록체인에 담을 블록의 모습을 정해보자
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = this.previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  // 위 요소들을 가져와서 블록마다 고유성을 부여 -> crypto-js 모듈 사용
  calculateHash() {
    return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
  }
  // Pow 채굴
  mineBlock(difficulty) {
    // 원하는 조건의 해시값을 찾을 때까지 while문 돌리기
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      // while문을 몇번 돌았는지 nonce로 확인할 수 있게 될 것
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined", this.hash);
  }
};

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }
  createGenesisBlock() {
    return new Block(0, "01/02/2022", "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    // 새로운 블록의 previousHash 값이 바로 전 블록의 해쉬값과 같은지 확인하고
    newBlock.previousHash = this.getLatestBlock().hash;
    // // 같다면 새로운 해쉬값을 계산해서 해쉬로 넣어주고
    // newBlock.hash = newBlock.calculateHash();

    newBlock.mineBlock(this.difficulty);
    // chain에 새로운 블록을 넣어준다.
    this.chain.push(newBlock);
  }
  isChainValid() {
    // genesisBlock 빼고 for 문 돌리기 위해 1부터 시작
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 현재 블록이 calculateHash로 만들어진 값이 아니면 false
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      // 현재 블록의 previousHash값이 이전 블록의 해쉬값과 같지 않으면 false
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}




// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
let mimiCoin = new BlockChain();
console.log("Data Mining block 1....");
mimiCoin.addBlock(new Block(1, "01/02/2022", { amount: 4 }));
console.log("Data Mining block 2....");
mimiCoin.addBlock(new Block(2, "03/02/2022", { amount: 10 }));


// // 2) 데이터 변조 시도
// mimiCoin.chain[1].data = { amount: 77 }; // 데이터 변조 시도(1) .. 거래에서 실제보다 더 많이 받은 것처럼
// mimiCoin.chain[1].hash = mimiCoin.chain[1].calculateHash(); // 데이터 변조 시도(2) .. 해쉬값도 계산해서 넣어주려 했으나~
// console.log("Is blockchain valid?", mimiCoin.isChainValid()); // 위에서 임의로 데이터를 바꾸려고 했기 때문에 false 나옴
// // 1) 코인들 잘 보이는지 확인
// console.log(JSON.stringify(mimiCoin, null, 4));


