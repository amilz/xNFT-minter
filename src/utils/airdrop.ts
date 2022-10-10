import { Cluster, clusterApiUrl, Connection, LAMPORTS_PER_SOL, ParsedTransactionWithMeta, PublicKey, SignatureResult, VersionedTransactionResponse } from "@solana/web3.js";
import { generateExplorerUrl } from "./solana";

interface AirDropResult {
    success: boolean,
    txId?: string,
    err?: SignatureResult
}

export async function airdrop1Sol(wallet: PublicKey, network: Cluster):Promise<AirDropResult> {
    console.log('requesting an airdrop of 1 sol to:',wallet.toString());
    const SOLANA_CONNECTION = new Connection (clusterApiUrl(network));
    if (!wallet) return;
    const airdropSignature = await SOLANA_CONNECTION.requestAirdrop(
        wallet,
        LAMPORTS_PER_SOL
    );
    const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash();
    const confirmation = await SOLANA_CONNECTION.confirmTransaction({
        signature: airdropSignature,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
    });
    if (confirmation.value.err) {
        console.log(`ERROR:`, confirmation.value.err); 
        return {
            success: false,
            err: confirmation.value
        }
    }
    else {
        console.log('🎉 SUCCESS!', generateExplorerUrl(airdropSignature,network)); 
        return {
            success: true,
            txId: airdropSignature
        }; 
    }     
}

export async function fetchTransaction(txId: string, network: Cluster):Promise<ParsedTransactionWithMeta> {
    const SOLANA_CONNECTION = new Connection (clusterApiUrl(network));
    const txDetail = await SOLANA_CONNECTION.getParsedTransaction(txId,{maxSupportedTransactionVersion: 0});

    return txDetail;
}


