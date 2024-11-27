import {
  Account,
  AccountAddress,
  Aptos, AptosConfig,
  Ed25519PrivateKey,
  generateRawTransaction,
  generateTransactionPayload,
  Network,
  SimpleTransaction
} from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const aptos = new Aptos(config);

const owner1 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x77b3ada172bb0f76309fd5d114f26611c653671aaa05db043fbf6ffc38154e98'),
});
const owner2 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x84ece5a9055e2c2cb7dee3b8a7b7a3cca5512bd26c1616dc66e165b6c3c83494'),
});
const owner3 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0xabed03e97c919465abf5b8b1160c80a2d76d4abf653aab0c40fe71d8dd2e4f2a')
});

let multisigAddress: string = '0x28b9d0c27867d799bb9761c204f327c6ccc72406c9aa3fa96c65b811139f7ea3';

const recipient = {accountAddress: AccountAddress.from('cdcd7ec21e9efc46702c102d8e536bf880b70b2c64f462611086bef9992c4037')};

console.log(recipient.accountAddress.toString());

const executeMultiSigTransferTransaction = async () => {
  // Owner 2 can now execute the transactions as it already has 2 approvals (from owners 2 and 3).
  console.log("Owner 2 can now execute the transfer transaction as it already has 2 approvals (from owners 2 and 3).");
  const transactionPayload = await generateTransactionPayload({
    multisigAddress,
    function: "0x1::aptos_account::transfer",
    functionArguments: [recipient.accountAddress, 50_004],
    aptosConfig: config,
  });

  console.log(transactionPayload.bcsToBytes());
  console.log(transactionPayload.bcsToHex());
  // console.log(transactionPayload.serialize());

  const rawTransaction = await generateRawTransaction({
    aptosConfig: config,
    sender: owner2.accountAddress,
    payload: transactionPayload,
  });

  const transaction = new SimpleTransaction(rawTransaction);

  const owner2Authenticator = aptos.transaction.sign({ signer: owner2, transaction });
  const transferTransactionReponse = await aptos.transaction.submit.simple({
    senderAuthenticator: owner2Authenticator,
    transaction,
  });
  await aptos.waitForTransaction({ transactionHash: transferTransactionReponse.hash });
};

async function main() {
  await executeMultiSigTransferTransaction()
}

main();