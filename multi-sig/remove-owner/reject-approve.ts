import {
  Account, Aptos, AptosConfig,
  Ed25519PrivateKey,
  Network
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

const rejectAndApprove = async (aprroveOwners: Account[], rejectOwners: Account[], transactionId: number): Promise<void> => {
  // console.log("Owner 1 rejects but owner 3 approves.");
  for (const rejectOwner of rejectOwners) {
    const rejectTx = await aptos.transaction.build.simple({
      sender: rejectOwner.accountAddress,
      data: {
        function: "0x1::multisig_account::reject_transaction",
        functionArguments: [multisigAddress, transactionId],
      },
    });

    const rejectSenderAuthenticator = aptos.transaction.sign({ signer: rejectOwner, transaction: rejectTx });
    const rejectTxResponse = await aptos.transaction.submit.simple({
      senderAuthenticator: rejectSenderAuthenticator,
      transaction: rejectTx,
    });

    await aptos.waitForTransaction({ transactionHash: rejectTxResponse.hash });
  }

  for (const aprroveOwner of aprroveOwners) {
    const approveTx = await aptos.transaction.build.simple({
      sender: aprroveOwner.accountAddress,
      data: {
        function: "0x1::multisig_account::approve_transaction",
        functionArguments: [multisigAddress, transactionId],
      },
    });

    const approveSenderAuthenticator = aptos.transaction.sign({ signer: aprroveOwner, transaction: approveTx });
    const approveTxResponse = await aptos.transaction.submit.simple({
      senderAuthenticator: approveSenderAuthenticator,
      transaction: approveTx,
    });

    await aptos.waitForTransaction({ transactionHash: approveTxResponse.hash });
  }
};


async function main() {
  const sequenceNumber = 1 //달라질 수 있다
  const approves = [owner3]; // 달라질 수 있다.
  const rejects = [owner1]; // 달라질 수 있다.

  await rejectAndApprove(
    approves,
    rejects,
    sequenceNumber
  );
}

main();