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
  privateKey: new Ed25519PrivateKey('0xa5e97783634c1aa5670f92b2bc22fb52b51d3ec91f1eb8e1945ff8be19187bcc'),
});
const owner2 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x08931629b310430e8e355e8143e521ca9574bd74ef07dd579f4c9c94fc54ee21'),
});
const owner3 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x51b72d373b3934cd1b54b4732200f9c7ddfbee648c2086cde9fda8a7db0e650e')
});

let multisigAddress: string = '0xbb642c365e9f22671feeacb92f1adfa79ee6fc68bda00b4a0adc93b6bc4ceb0f';

const recipient = {accountAddress: AccountAddress.from('cdcd7ec21e9efc46702c102d8e536bf880b70b2c64f462611086bef9992c4037')};

console.log(recipient.accountAddress.toString());

const executeMultiSigChangeThreshold = async () => {
  const transactionPayload = await generateTransactionPayload({
    multisigAddress,
    function: "0x1::multisig_account::update_signatures_required",
    functionArguments: [3],
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
  const changeThresholdReponse = await aptos.transaction.submit.simple({
    senderAuthenticator: owner2Authenticator,
    transaction,
  });
  await aptos.waitForTransaction({ transactionHash: changeThresholdReponse.hash });
};

async function main() {
  await executeMultiSigChangeThreshold()
}

main();