import {
  Account, Aptos, AptosConfig,
  Ed25519PrivateKey,
  Network
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