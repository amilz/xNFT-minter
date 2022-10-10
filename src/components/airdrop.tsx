import { Cluster, LAMPORTS_PER_SOL, ParsedTransactionWithMeta, PublicKey } from "@solana/web3.js";
import { airdrop1Sol, fetchTransaction } from "../utils/airdrop";
import { View, Text, Button, Stack, Loading } from "react-xnft";
import { useState } from "react";
import { generateExplorerUrl } from "../utils/solana";
import { useEffect } from "react";
import { shortenAddress } from "../../utils/wallet";

interface AirDropButtonProps {
    wallet: PublicKey,
    network: Cluster
}

type AidDropStatus = 'Menu' | 'Requested' | 'Error' | 'Success';

export function AirDropButton({ wallet, network }: AirDropButtonProps): JSX.Element {
    return (
        <View
            style={{
                backgroundRepeat: "no-repeat",
                height: "100%",
            }}
        >
            <Button
                onClick={() => airdrop1Sol(wallet, network)}
            >
                AirDrop 1 SOL ({network})
            </Button>
        </View>
    );
}

export function AirDrop({ wallet }): JSX.Element {
    const [txId, setTxId] = useState<null|string>(null);
    const [txDetail, setTxDetail] = useState<ParsedTransactionWithMeta|null>(null);
    const [walletIndex, setWalletIndex] = useState<number>(1);
    const [cluster, setCluster] = useState<Cluster>('devnet');
    const [status, setStatus] = useState<AidDropStatus>('Menu');
    async function handleClick (cluster: Cluster) {
        setStatus('Requested');
        setCluster(cluster);
        let airDropResult = await airdrop1Sol(wallet, cluster);
        if (!airDropResult.success) {setStatus('Error'); return;}
        setStatus('Success');
        setTxId(airDropResult.txId);
    }
    async function handleReset () {
        setStatus('Menu');
        setCluster('devnet');
        setTxId(null);
        setTxDetail(null);
    }
    useEffect(() => {
        if (!txId) {setTxDetail(null); return;};
        (async () => {
            const txDetail = await fetchTransaction(txId,cluster);
            console.log('detail',txDetail);
            setTxDetail(txDetail);
            //let index = txDetail.transaction.message.accountKeys.findIndex(account => {return (account.pubkey === wallet)});
            //console.log('index',index);
            //setWalletIndex(index);
        })();
      }, [txId]);
    
    return (
        <View
            style={{
                backgroundRepeat: "no-repeat",
                height: "100%",
                marginTop: "20px",

            }}
        >
        {(status === 'Menu') && <>
            <Text>AirDrop 1 SOL</Text>
            <Button style={{margin: "10px"}} onClick={() => handleClick('devnet')}>Devnet</Button>
            <Button style={{margin: "10px"}} onClick={() => handleClick('testnet')}>Testnet</Button>
            </>
        }  
        {(status === 'Requested') && <Loading/>}
        {(status === 'Success') && <Text>🎉  WAO!!! 🔵</Text>}

        {(txDetail && txId) && <View>
            <Text>TxId: {shortenAddress(txId)}</Text>
            <Text>Slot: {txDetail.slot}</Text>
            {walletIndex && <Text>Start Balance: {(txDetail.meta.preBalances[walletIndex]/LAMPORTS_PER_SOL).toFixed(2)}</Text>}
            {walletIndex && <Text>Post Balance: {(txDetail.meta.postBalances[walletIndex]/LAMPORTS_PER_SOL).toFixed(2)}</Text>}
            {/*<Button style={{margin: "10px"}} onClick={handleReset}>View on Explorer</Button> */}
            <Button style={{margin: "10px"}} onClick={handleReset}>Back</Button>
            </View>}
        {(status === 'Error') && <Text>Error!</Text>}

        </View>

    )
}



