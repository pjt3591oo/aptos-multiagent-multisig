import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, AccountAddress, U64 } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

const moduleAddress = AccountAddress.fromString('f426df8beaf304b32e92b05899dc43a6526a344c525e4824497ec058fd8a3c47');

const user0 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x560803273387c8a875f7d30a888c3c0bfe5cd1bf320bc03e4d9c5c5f62db2756'),
});
const user1 = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x9c9e0bc8d145ae093b036da6bc9685e7dd38a4f2c52c1d635613da16e7722e6b'),
});

async function main() {

  const transaction = await client.transaction.build.multiAgent({
    sender: user0.accountAddress,
    secondarySignerAddresses: [
      user1.accountAddress
    ],
    data: {
      function: `${moduleAddress}::multi_agent_module::create_dual_ownership`,
      typeArguments: [],
      functionArguments: [
        new U64(1),
      ],
    },
  });

  // optional: simulate the transaction
  const [userTransactionResponse] = await client.transaction.simulate.multiAgent(
    {
      signerPublicKey: user0.publicKey,
      secondarySignersPublicKeys: [user1.publicKey],
      transaction,
    },
  );
  console.log(userTransactionResponse); 

  const aliceSenderAuthenticator = client.transaction.sign({
    signer: user0,
    transaction,
  });
  const bobSenderAuthenticator = client.transaction.sign({
    signer: user1,
    transaction,
  });

  const committedTransaction = await client.transaction.submit.multiAgent({
    transaction,
    senderAuthenticator: aliceSenderAuthenticator,
    additionalSignersAuthenticators: [bobSenderAuthenticator],
  });

  const executedTransaction = await client.waitForTransaction({
    transactionHash: committedTransaction.hash,
  });

  console.log(executedTransaction)
}

main();