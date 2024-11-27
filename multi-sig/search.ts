import {
    Aptos, AptosConfig, Network, AccountAddress, InputViewFunctionData,
    Account,
    Ed25519PrivateKey,
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

async function main() {
    const metadataPayload: InputViewFunctionData = {
        function: "0x1::multisig_account::metadata",
        functionArguments: [multisigAddress],
    }
    const [metadata] = await aptos.view<[number]>({ payload: metadataPayload });
    console.log('metadata', metadata);

    const ownersPayload: InputViewFunctionData = {
        function: "0x1::multisig_account::owners",
        functionArguments: [multisigAddress],
    }
    const [owners] = await aptos.view<[number]>({ payload: ownersPayload });
    console.log('owners', owners);

    const thresholdPayload: InputViewFunctionData = {
        function: "0x1::multisig_account::num_signatures_required",
        functionArguments: [multisigAddress],
    }
    const [threshold] = await aptos.view<[number]>({ payload: thresholdPayload });
    console.log('threshold', threshold);

    const lastResolvedSequenceNumberPayload: InputViewFunctionData = {
        function: "0x1::multisig_account::last_resolved_sequence_number",
        functionArguments: [multisigAddress],
    };
    const [lastResolvedSequenceNumber] = await aptos.view<[number]>({ payload: lastResolvedSequenceNumberPayload });
    console.log('lastResolvedSequenceNumber', lastResolvedSequenceNumber)

    const nextSequencerNumberPayloer: InputViewFunctionData = {
        function: "0x1::multisig_account::next_sequence_number",
        functionArguments: [multisigAddress],
    };
    const [nextSequencerNumber] = await aptos.view<[number]>({ payload: nextSequencerNumberPayloer });
    console.log('nextSequencerNumber', nextSequencerNumber)
    
    const payload1: InputViewFunctionData = {
        function: "0x1::multisig_account::get_pending_transactions",
        functionArguments: [multisigAddress],
    };
    const [pendingTransactions] = await aptos.view<[any[]]>({ payload: payload1 });
    console.log('get_pending_transactions')
    console.log(pendingTransactions);
    // console.log(a1[0])
    (pendingTransactions ).forEach((a: any, i: number) => {
        console.log('=====================', i + 1)
        console.log((a as any).votes);
        console.log((a as any).payload);
        console.log((a as any).payload_hash);
    })
    console.log(pendingTransactions.length)
    console.log()
    console.log()
    console.log()


    console.log('get transaction')
    console.log
    for (
        let i = Number(lastResolvedSequenceNumber) + 1 ; 
        i < Number(nextSequencerNumber); 
        i++
    ) {
        console.log('********************', i)
        // console.log(0x${Number(i).toString(16)})
        const payload3: InputViewFunctionData = {
            function: "0x1::multisig_account::get_transaction",
            functionArguments: [multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [res0] = await aptos.view<[any]>({ payload: payload3 });
        console.log(res0)
        console.log(res0.votes)
        
        const canBeExecutePayload: InputViewFunctionData = {
            function: "0x1::multisig_account::can_be_executed",
            functionArguments: [multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [res1] = await aptos.view<[any]>({ payload: canBeExecutePayload });
        console.log('can_be_executed', res1)

        const canBeRejectPayload: InputViewFunctionData = {
            function: "0x1::multisig_account::can_be_rejected",
            functionArguments: [multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [res2] = await aptos.view<[any]>({ payload: canBeRejectPayload });
        console.log('can_be_rejected', res2);

        const canExecutePayload0: InputViewFunctionData = {
            function: "0x1::multisig_account::can_execute",
            functionArguments: [owner1.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canExecuteRes0] = await aptos.view<[any]>({ payload: canExecutePayload0 });
        
        const canExecutePayload1: InputViewFunctionData = {
            function: "0x1::multisig_account::can_execute",
            functionArguments: [owner2.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canExecuteRes1] = await aptos.view<[any]>({ payload: canExecutePayload1 });
        
        const canExecutePayload2: InputViewFunctionData = {
            function: "0x1::multisig_account::can_execute",
            functionArguments: [owner3.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canExecuteRes2] = await aptos.view<[any]>({ payload: canExecutePayload2 });

        console.log('can_execute', canExecuteRes0, canExecuteRes1, canExecuteRes2)

        const canRejectPayload0: InputViewFunctionData = {
            function: "0x1::multisig_account::can_reject",
            functionArguments: [owner1.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canRejectRes0] = await aptos.view<[any]>({ payload: canRejectPayload0 });
        
        const canRejectPayload1: InputViewFunctionData = {
            function: "0x1::multisig_account::can_reject",
            functionArguments: [owner2.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canRejectRes1] = await aptos.view<[any]>({ payload: canRejectPayload1 });
        
        const canRejectPayload2: InputViewFunctionData = {
            function: "0x1::multisig_account::can_reject",
            functionArguments: [owner3.accountAddress.toString(), multisigAddress, `0x${Number(i).toString(16)}`],
        };
        const [canRejectRes2] = await aptos.view<[any]>({ payload: canRejectPayload2 });

        console.log('can_reject', canRejectRes0, canRejectRes1, canRejectRes2)

    }

}

main();