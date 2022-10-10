import React from "react";
import ReactXnft, { Tab, View, Text, Button, usePublicKey } from "react-xnft";
import { shortenAddress } from "../utils/wallet";
import { AirDrop, AirDropButton } from "./components/airdrop";
import { airdrop1Sol } from "./utils/airdrop";
//import { mint } from "./utils/mintNft";

//
// On connection to the host environment, warm the cache.
//
ReactXnft.events.on("connect", () => {
  //
});

export const App = () => {
  const USER_WALLET = usePublicKey();


  return (
    <View
    style={{
      marginTop: "150px",
      textAlign: "center",
      color: "white",
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "150%",
    }}
    >
      <Text>Hello, </Text>
        <Text>{shortenAddress(USER_WALLET.toString())}</Text>
      <AirDrop wallet={USER_WALLET}/>
    </View>



  );
}
