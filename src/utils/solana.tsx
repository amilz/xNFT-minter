import { Cluster } from "@solana/web3.js";

export function generateExplorerUrl(txId: string, cluster: Cluster){
    return `https://explorer.solana.com/tx/${txId}/?cluster=${cluster}`;
}