const SHA256 = require('crypto-js/sha256'); // 해쉬
const EC = require('elliptic').ec; // 개인/공용 키 생성 및 서명인증을 위한 모듈
const ec = new EC('secp256k1'); // 지갑 알고리즘

// 거래내역
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }
  signTransaction(singingKey) {
    if (singingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!!!');
    }

    const hashTx = this.calculateHash();
    const sig = singingKey.sign(hashTx, 'base64');
    this.signiture = sig.toDER('hex');
  }
  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signiture || this.signiture.length === 0) {
      throw new Error("There is no signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signiture);

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
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid) {
        return false;
      }
    }
    return true;
  }
};

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(0, Date.parse("2022-01-08"), "Genesis Block", "0");
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
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // 새 블록을 만들어서
    let block = new Block(777, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    // 정해진 난이도에 따라 채굴하고
    block.mineBlock(this.difficulty);

    console.log("Block successfuly mined!!");
    // 블록을 원장에 추가해준다.
    this.chain.push(block);

    // pendingTransactions의 배열에는 주소와 리워드코인이 담긴 새로운 거래가 들어가게 된다.
    this.pendingTransactions = [
      // new Trasaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  // // ● 생성된 거래를 pendingTransactions 배열에 넣어주기
  // createTransaction(transaction) {
  //   this.pendingTransactions.push(transaction);
  // }

  // ● 유효성검사를 하고 새로운 거래를 추가해주기
  addTransaction(transaction) {
    // 주소가 빠져있진 않은지
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }
    // 거래 자체가 유효성 검사는 마쳤는지
    if (!transaction.isValid()) {
      throw new Error('You cannot add invalid transaction to chain');
    }

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

      // transaction의 유효성을 따져야함
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

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

module.exports = { Blockchain, Transaction };