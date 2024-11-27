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
// const recipient = Account.generate();
console.log(recipient.accountAddress.toString());

const createMultiSigTransferTransaction = async () => {
    console.log("Creating a multisig transaction to transfer coins...");

    const transactionPayload = await generateTransactionPayload({
        multisigAddress,
        function: "0x1::aptos_account::transfer",
        functionArguments: [recipient.accountAddress, 50_004],
        aptosConfig: config,
    });

    // optional: simulate the transaction
    // const transactionToSimulate = await generateRawTransaction({
    //     aptosConfig: config,
    //     sender: owner2.accountAddress,
    //     payload: transactionPayload,
    // });

    // const simulateMultisigTx = await aptos.transaction.simulate.simple({
    //     signerPublicKey: owner2.publicKey,
    //     transaction: new SimpleTransaction(transactionToSimulate),
    // });

    // console.log("simulateMultisigTx", simulateMultisigTx);

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
    await createMultiSigTransferTransaction();
}

main();