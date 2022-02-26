import Web3Modal from "web3modal-coinbase";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Portis from "@portis/web3";
import WalletLink from "walletlink";

const providerOptions = { 
    walletlink: {
        package: WalletLink,           // required
        options: {
            appName: "Token as Gas",   // required
            darkMode: TextTrackCueList,             // optional - false if unspecified
            jsonRpcUrl: "INFURA_API",  // required
            chainId: 1                 // optional - 1 is used if unspecified
        }
    }
};
let web3Modal;
if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
        // network: "goerli", // optional
        cacheProvider: false, // optional
        providerOptions // required
    });
}



export { web3Modal };