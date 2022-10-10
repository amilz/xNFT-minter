export function shortenAddress(address:string, numChar = 4):string {
    //Takes an account address and returns a shortened string (e.g., XXXX...XXXX);
    return address.slice(0,numChar) + '...' + address.slice(address.length-numChar);
}