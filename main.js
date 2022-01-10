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
  }
  // 위 요소들을 가져와서 블록마다 고유성을 부여 -> crypto-js 모듈 사용
  calculateHash() {
    return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
  }
};

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
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
    // 같다면 새로운 해쉬값을 계산해서 해쉬로 넣어주고
    newBlock.hash = newBlock.calculateHash();
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

// 테스트
let mimiCoin = new BlockChain();
mimiCoin.addBlock(new Block(1, "01/02/2022", { amount: 4 }));
mimiCoin.addBlock(new Block(2, "03/02/2022", { amount: 10 }));

mimiCoin.chain[1].data = { amount: 77 }; // 데이터 변조 시도(1)
mimiCoin.chain[1].hash = mimiCoin.chain[1].calculateHash(); // 데이터 변조 시도(2) .. 해쉬값도 계산해서 넣어주려 했으나~
console.log("Is blockchain valid?", mimiCoin.isChainValid()); // 위에서 임의로 데이터를 바꾸려고 했기 때문에 false 나옴
// console.log(JSON.stringify(mimiCoin, null, 4));


