import {
  Account,
  Aptos, AptosConfig,
  Ed25519PrivateKey,
  InputViewFunctionData,
  MoveString,
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

let multisigAddress: string;

const showAccounts = async () => {
    console.log(`owner1: ${owner1.accountAddress.toString()}`);
    console.log(`owner2: ${owner2.accountAddress.toString()}`);
    console.log(`owner3: ${owner3.accountAddress.toString()}`);
}

const generateUpMultiSigAccount = async () => {
    const payload: InputViewFunctionData = {
        function: "0x1::multisig_account::get_next_multisig_account_address",
        functionArguments: [owner1.accountAddress.toString()],
    };
    [multisigAddress] = await aptos.view<[string]>({ payload });

    const createMultisig = await aptos.transaction.build.simple({
        sender: owner1.accountAddress,
        data: {
            function: "0x1::multisig_account::create_with_owners",
            functionArguments: [
                [owner2.accountAddress, owner3.accountAddress], // owners
                2, // threshold: number of signatures required
                ["Example"], // metadata keys(optional: [])
                [new MoveString("SDK").bcsToBytes()], // metadata values(optional: [])
            ],
        },
    });

    const owner1Authenticator = aptos.transaction.sign({ signer: owner1, transaction: createMultisig });
    const res = await aptos.transaction.submit.simple({
        senderAuthenticator: owner1Authenticator,
        transaction: createMultisig,
    });
    await aptos.waitForTransaction({ transactionHash: res.hash });
    console.log("Multisig Account Address:", multisigAddress);

    const multisigAccountResource = await aptos.getAccountResource<{ num_signatures_required: number, owners: Array<string> }>({
      accountAddress: multisigAddress,
      resourceType: "0x1::multisig_account::MultisigAccount",
    });

    console.log("Signature Threshold:", multisigAccountResource.num_signatures_required);
    console.log("Number of Owners:", multisigAccountResource.owners.length);
}

const fundMultiSigAccount = async () => {
  console.log("Funding the multisig account...");
  // Fund the multisig account for transfers.
  await aptos.fundAccount({ accountAddress: multisigAddress, amount: 100_000_000 });
};

async function main() {
  await showAccounts();
  await generateUpMultiSigAccount();
  await fundMultiSigAccount();
}

main();