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
const owner4 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x3004c83ed3b21b8e5efbbb07679db9bd9d92acb59a2295eab8afbf2d30c3a289')
});
const multisigAddress = '0xbb642c365e9f22671feeacb92f1adfa79ee6fc68bda00b4a0adc93b6bc4ceb0f'

const recipient = { accountAddress: AccountAddress.from('cdcd7ec21e9efc46702c102d8e536bf880b70b2c64f462611086bef9992c4037') };
// const recipient = Account.generate();
console.log(recipient.accountAddress.toString());


const createMultiSigAddOwner = async () => {
  console.log("Creating a multisig transaction to transfer coins...");

  const transactionPayload = await generateTransactionPayload({
    multisigAddress,
    function: "0x1::multisig_account::add_owner",
    functionArguments: [owner4.accountAddress],
    aptosConfig: config,
  });

  const transactionToSimulate = await generateRawTransaction({
    aptosConfig: config,
    sender: owner2.accountAddress,
    payload: transactionPayload,
  });

  const simulateMultisigTx = await aptos.transaction.simulate.simple({
    signerPublicKey: owner2.publicKey,
    transaction: new SimpleTransaction(transactionToSimulate),
  });

  console.log("simulateMultisigTx", simulateMultisigTx);

  const createMultisigTx = await aptos.transaction.build.simple({
    sender: owner2.accountAddress,
    data: {
      function: "0x1::multisig_account::create_transaction",
      functionArguments: [multisigAddress, transactionPayload.multiSig.transaction_payload?.bcsToBytes()],
    },
  });

  // Owner 2 signs the transaction
  const createMultisigTxAuthenticator = aptos.transaction.sign({ signer: owner2, transaction: createMultisigTx });

  // Submit the transaction to chain
  const createMultisigTxResponse = await aptos.transaction.submit.simple({
    senderAuthenticator: createMultisigTxAuthenticator,
    transaction: createMultisigTx,
  });
  await aptos.waitForTransaction({ transactionHash: createMultisigTxResponse.hash });
}


async function main() {
  await createMultiSigAddOwner();
}

main();