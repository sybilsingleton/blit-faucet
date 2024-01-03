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
    rpcEndpoint: string;
    restEndpoint: string;
    scriptAddress: string;

  }
}

// @ts-ignore
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};
import { default as blitjs, experimentalHelpers } from "@blitchain/blitjs";

let { makeKeplrClient, makeJsClient, runFunction, queryFunction } =
  experimentalHelpers;

let rpcEndpoint = window.rpcEndpoint || "https://testnet-rpc.blitchain.net";
let restEndpoint = window.restEndpoint || "https://testnet-api.blitchain.net";



let queryClient = await blitjs.blit.ClientFactory.createLCDClient({
  restEndpoint,
});

/*
 * var msgClient
try {
  msgClient = await makeKeplrClient({ rpcEndpoint, restEndpoint });
} catch (e) {
  console.log("Keplr not found");
  let el = document.getElementById("app")
  if (el) el.innerHTML = "Keplr not found. Please enable Keplr and try again.";
  throw e;
}


// @ts-ignore
 * let address = (await msgClient.signer.getAccounts())[0].address;
let balanceResponse = await queryClient.cosmos.bank.v1beta1.allBalances({
  address,
  resolve_denom: true,
});
console.log("keplr address", address);
console.log("keplr balance:", balanceResponse.balances);
*/

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
console.log("js balance:", jsBalanceResponse.balances);

// Optional: If you want console access for debugging
window.blitjs = blitjs;
//window.msgClient = msgClient;
window.jsClient = jsClient;
window.queryClient = queryClient;
//window.address = address;
window.jsAddress = jsAddress;
window.makeKeplrClient = makeKeplrClient;
window.makeJsClient = makeJsClient;
window.runFunction = runFunction;
window.queryFunction = queryFunction;

// JavaScript function to handle form submission
function handleSubmit() {
  var inputElement = document.getElementById(
    "inputField",
  ) as HTMLInputElement | null;
  var address = "";
  if (inputElement) {
    address = inputElement.value;
    // Continue with your logic using 'address'
  } else {
    console.error("Input field not found");
  }
  console.log("Address: ", address);
  // Additional handling of inputData can be done here
  clearResult();
  runFunction({
    msgClient: jsClient,
    script_address: window.scriptAddress || "blit1yyey4v836rssq29ny7n0yyxtj3tkhm6ehq6t5wmnt3n7gf2chydstqygew",
    caller_address: jsAddress,
    function_name: "faucet",
    kwargs: { address },
    grantee: jsAddress,
    extra_code: "",
  })
    .then(handleResult)
    .catch(handleError);
}

function clearResult() {
  const resultElement = document.getElementById("result");
  if (resultElement) {
    resultElement.innerHTML = "";
  }

  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.innerHTML = "";
  }
}

function handleResult({result} : {result: any}) {
  console.log("handleResult: ", result);

  const resultElement = document.getElementById("result");
  if (resultElement) {
    resultElement.innerHTML = JSON.stringify(result, null, 2);
  }
}
function handleError(error: any) {
  console.log("handleError: ", error);
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.innerHTML = error.toString(); // Convert error to string if it's not already
  }
}

function initializeFaucetUI() {
  const app = document.getElementById("app");

  if (app) {
    // Create input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "inputField";
    inputField.placeholder = "Enter Address";

    // Create button
    const requestButton = document.createElement("button");
    requestButton.textContent = "Request Testnet Coins";
    requestButton.onclick = handleSubmit;

    // Create result display areas
    const resultDisplay = document.createElement("pre");
    resultDisplay.id = "result";

    const errorDisplay = document.createElement("pre");
    errorDisplay.id = "error";

    // Append elements to the app
    app.appendChild(inputField);
    app.appendChild(requestButton);
    app.appendChild(resultDisplay);
    app.appendChild(errorDisplay);
  } else {
    console.error("Element with ID 'app' was not found in the document.");
  }
}

initializeFaucetUI();
