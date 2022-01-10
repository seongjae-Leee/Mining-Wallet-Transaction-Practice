// 모든 코드를 담아둘 곳
const SHA256 = require('crypto-js/sha256');

// 거래내역
class Trasaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

}

// 우리가 이번 블록체인에 담을 블록의 모습을 정해보자
class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = this.previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  // 위 요소들을 가져와서 블록마다 고유성을 부여 -> crypto-js 모듈 사용
  calculateHash() {
    return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
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
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(0, "01/02/2022", "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  // addBlock(newBlock) {
  //   // 새로운 블록의 previousHash 값이 바로 전 블록의 해쉬값과 같은지 확인하고
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   // // 같다면 새로운 해쉬값을 계산해서 해쉬로 넣어주고
  //   // newBlock.hash = newBlock.calculateHash();

  //   newBlock.mineBlock(this.difficulty);
  //   // chain에 새로운 블록을 넣어준다.
  //   this.chain.push(newBlock);
  // }

  // ● addBlock 함수 대체
  minePendingTrasactions(miningRewardAddress) {
    // 새로운 블록의 previousHash 값이 바로 전 블록의 해쉬값과 같은지 확인하고
    newBlock.previousHash = this.getLatestBlock().hash;
    // 같다면 새로운 해쉬값을 계산해서 해쉬로 넣어주고
    newBlock.hash = newBlock.calculateHash();
    // 새 블록을 만들어서
    let block = new Block(777, Date.now(), this.pendingTransactions);
    // 정해진 난이도에 따라 채굴하고
    block.mineBlock(this.difficulty);

    console.log("Block successfuly mined!!");
    // 블록을 원장에 추가해준다.
    this.chain.push(block);

    // pendingTransactions의 배열에는 주소와 리워드코인이 담긴 새로운 거래가 들어가게 된다.
    this.pendingTransactions = [
      new Trasaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  // ● 생성된 거래를 pendingTransactions 배열에 넣어주기
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  // ● 내 지갑에서 코인 정보를 가져오기. 그 방법으로 내 노드 주소가 한 거래내역 확인
  getBalanceOfAddress(address) {
    let balance = 0;
    // part3의 07:40 참고
    // 모든 블록을 다 도는 for문
    for (const block of this.chain) {
      // 그 블록의 모든 거래내역을 도는 for문
      for (const trans of block.transactions) {
        // fromAddress가 내 주소면 나의 잔고에서 나간 것이므로 차감해주고
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        // toAddress가 내 주소면 나의 잔고로 들어온 것이므로 더해주고
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    // for문(거래내역)을 돌아 잔고를 반환한다.
    return balance;
  }

  // ● 체인의 유효성 검사
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

mimiCoin.createTransaction(new Trasaction("address111", "address222", 100));
mimiCoin.createTransaction(new Trasaction("address222", "address111", 30));

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


