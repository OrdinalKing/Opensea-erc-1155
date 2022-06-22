const { privateKey } = require("../config");

class Service {

    constructor() {
        this.web3 = null;
        this.account = null;
        this.tokenContract = null;
        this.pinata = null;
    }

    async mint(tokenUri) {

        let tx = this.tokenContract.methods.mint(this.account.address, tokenUri, 1);

        try {
            await this.sendTransaction(tx, this.tokenContract.options.address);
            console.log("new nft is minted");
            return true;

        }catch (e) {
            console.log(e, "------------------------");
            return false;
        }
    }

  

    async sendTransaction(tx, contractAddress) {
        this.web3.eth.accounts.wallet.add(privateKey);
        const gas = await tx.estimateGas({from: this.account.address});
        const gasPrice = await this.web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await this.web3.eth.getTransactionCount(this.account.address);

        const txData = {
            from: this.account.address,
            to: contractAddress,
            data: data,
            gas,
            gasPrice,
            nonce, 
        };
        return await this.web3.eth.sendTransaction(txData);
    }
}

module.exports = new Service();
