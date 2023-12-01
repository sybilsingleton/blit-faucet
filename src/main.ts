// Extend the Window interface
declare global {
  interface Window {
    experimentalHelpers: any; // Replace 'any' with a more specific type if possible
    blitjs: any;
    msgClient: any;
    jsClient: any;
    queryClient: any;
    address: string;
    jsAddress: string;
    makeKeplrClient: any;
    makeJsClient: any;
    runFunction: any;
    queryFunction: any;
  }
}
// @ts-ignore
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};
import { default as blitjs, experimentalHelpers } from "@blitchain/blitjs";

let { makeKeplrClient, makeJsClient, runFunction, queryFunction } =
  experimentalHelpers;

let rpcEndpoint = "http://localhost:26657";
let restEndpoint = "http://localhost:1317";

let queryClient = await blitjs.blit.ClientFactory.createLCDClient({
  restEndpoint,
});

let msgClient = await makeKeplrClient({ rpcEndpoint, restEndpoint });

// @ts-ignore
let address = (await msgClient.signer.getAccounts())[0].address;
let balanceResponse = await queryClient.cosmos.bank.v1beta1.allBalances({
  address,
  resolve_denom: true,
});
console.log("keplr address", address);
console.log("keplr balance:", balanceResponse.balances[0]);

const mnemonic =
  "rhythm snake innocent moon husband gossip man toe industry senior essence summer traffic since parent thing limit void add perfect vague undo lecture flame";
let jsClient = await makeJsClient({ rpcEndpoint, restEndpoint, mnemonic });
// @ts-ignore
jsClient.gasPrice = "0ublit";
// @ts-ignore
let jsAddress = (await jsClient.signer.getAccounts())[0].address;
console.log("js address", jsAddress);
let jsBalanceResponse = await queryClient.cosmos.bank.v1beta1.allBalances({
  address: jsAddress,
  resolve_denom: true,
});
console.log("js balance:", jsBalanceResponse.balances[0]);

// Optional: If you want console access for debugging
//window.blitjs = blitjs;
window.msgClient = msgClient;
window.jsClient = jsClient;
window.queryClient = queryClient;
window.address = address;
window.jsAddress = jsAddress;
window.makeKeplrClient = makeKeplrClient;
window.makeJsClient = makeJsClient;
window.runFunction = runFunction;
window.queryFunction = queryFunction;
