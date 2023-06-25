"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { polygonMumbai } from "viem/chains";
import { waitForTransaction } from "@wagmi/core";
import { decodeEventLog, formatEther } from "viem";
import { abi as ApeCoinNFTABI } from "../../../../abi/ApeCoinNFT.json";
import { abi as ApeCoinABI } from "../../../../abi/ApeCoin.json";
import { errorsABI, formatError, fundMyAccountOnLocalFork, signMessage } from "@/utils/misc";
// import { mumbaiFork } from "@/utils/wagmi";
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectConfig, // the Sismo Connect config with your appId
  AuthType, // the authType enum, we will choose 'VAULT' in this tutorial
  ClaimType, // the claimType enum, we will choose 'GTE' in this tutorial, to check that the user has a value greater than a given threshold
} from "@sismo-core/sismo-connect-react";
import { transactions } from "../../../broadcast/Airdrop.s.sol/5151111/run-latest.json";
import Image from "next/image";
import Link from "next/link";

/* ***********************  Sismo Connect Config *************************** */

// you can create a new Sismo Connect app at https://factory.sismo.io
// The SismoConnectConfig is a configuration needed to connect to Sismo Connect and requests data from your users.

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0x20b63fa47a248243eb4a4b3b6e893d67",
  vault: {
    // For development purposes
    // insert any account that you want to impersonate  here
    // Never use this in production
    impersonate: ["barmstrong.eth"],
  },
};

/* ********************  Defines the chain to use *************************** */
const CHAIN = polygonMumbai;

export default function Home() {
  const COINBASE_SHIELD_HOLDER = "0x842e4d1671d72526762a77ade9feb49a";

  /* ***********************  Application states *************************** */
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [minted, setMinted] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [responseBytes, setResponseBytes] = useState<string>("");

  /* ***************  Wagmi hooks for wallet connection ******************** */
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  /* *************  Wagmi hooks for contract interaction ******************* */
  // Define the contract call inputs for approve function
  const approveCallInputs =
    responseBytes && chain
      ? {
          address: "0x0F988cf15c0B090653E8E97ef404a6f758822BC7",
          abi: ApeCoinABI,
          functionName: "approve",
          args: ["0x0eDF48310aDb2a17D25C27de4049873604b4eA7A", 1000000000000000000n],
          chain,
        }
      : {};

  // Use the useContractWrite hook to get the writeAsync function for the approve call
  const { config: configApprove, error: wagmiSimulateErrorApprove } =
    usePrepareContractWrite(approveCallInputs);
  const { writeAsync: approveAsync } = useContractWrite(configApprove);

  const contractCallInputs =
    responseBytes && chain
      ? {
          address: "0x0eDF48310aDb2a17D25C27de4049873604b4eA7A",
          abi: [...ApeCoinNFTABI, ...errorsABI],
          functionName: "claimWithSismo",
          args: [responseBytes],
          chain,
        }
      : {};

  const { config, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
  const { writeAsync } = useContractWrite(config);

  /* *************  Handle simulateContract call & chain errors ************ */
  useEffect(() => {
    if (chain?.id !== CHAIN.id) return setError(`Please switch to ${CHAIN.name} network`);
    setError("");
  }, [chain]);

  useEffect(() => {
    if (!wagmiSimulateErrorApprove) return;
    if (!isConnected) return;
    return setError(formatError(wagmiSimulateErrorApprove));
  }, [wagmiSimulateError, isConnected]);

  useEffect(() => {
    if (!wagmiSimulateError) return;
    if (!isConnected) return;
    return setError(formatError(wagmiSimulateError));
  }, [wagmiSimulateError, isConnected, approved]);

  /* ************  Handle the nft claim button click ******************* */
  async function mintNft() {
    if (!address) return;
    setError("");
    setLoading(true);
    try {
      // Switch to the selected network if not already on it
      if (chain?.id !== CHAIN.id) await switchNetworkAsync?.(CHAIN.id);

      // Call the approve function
      const approveTx = await approveAsync?.();
      const txReceipt = approveTx && (await waitForTransaction({ hash: approveTx.hash }));
      console.log(txReceipt);
      setApproved(true);
      callMint();
    } catch (e: any) {
      setError(formatError(e));
    }
  }

  async function callMint() {
    try {
      const tx = await writeAsync?.();
      const txReceipt = tx && (await waitForTransaction({ hash: tx.hash }));
      if (txReceipt?.status === "success") {
        setMinted(true);
      }
    } catch (error) {
      setError(formatError(e));
    } finally {
      setLoading(false);
    }
  }

  /* *************************  Reset state **************************** */
  function resetApp() {
    disconnect();
    setMinted(false);
    setResponseBytes("");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.delete("sismoConnectResponseCompressed");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>
      <main className="relative">
        <div className="h-[21.5rem] opacity-50 w-screen absolute -left-12">
          <Image src="/apecointop.png" fill={true} alt="ape" />
        </div>
        <div className="pl-[10rem] pt-[25rem] w-[48rem] mb-72">
          <h3 className="font-bold text-5xl mb-4 text-sky-600 pb-6"> ApeCoin Stands With Crypto</h3>
          <p className="text-center text-2xl">
            The ApeCoin Shield, minted with ApeCoin, is an NFT emblem of resilience, highlighting
            your proactive involvement and commitment in our shared fight for digital liberty. By
            acquiring this, you not only secure a bigger piece of the airdrop pie, but also amplify
            your voice in this key struggle. Let's remember, 'Apes together, strong' - as we are
            collectively carving our digital future
          </p>
          <div className="bg-slate-900 h-[30rem] w-[38rem] absolute right-4 top-64 rounded-md flex flex-col gap-3 justify-center items-center border">
            <div className="h-[90%] w-[90%] rounded-md relative">
              <Image className="rounded-md" src="/apedao.png" fill={true} alt="ApeCoin" />
            </div>
            <span className="font-bold text-xl">1 APE</span>
            <div className="w-full text-center">
              {!isConnected && (
                <div className="mb-2">
                  {connectors.map((connector) => (
                    <button
                      className="bg-violet-500 text-white w-[95%] p-4 font-bold text-2xl rounded-2xl"
                      disabled={!connector.ready || isLoading}
                      key={connector.id}
                      onClick={() => connect({ connector })}
                    >
                      {isLoading && pendingConnector?.id === connector.id
                        ? "Connecting..."
                        : "Mint"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {isConnected && !responseBytes && (
            <div className="text-center mt-8">
              <p>
                <b>Chain: {chain?.name}</b>
                <br />
                <b>Your NFT destination address is: {address}</b>
              </p>
              <div className="w-full flex items-center justify-center">
                <SismoConnectButton
                  // the client config created
                  config={sismoConnectConfig}
                  // the auth request we want to make
                  // here we want the proof of a Sismo Vault ownership from our users
                  auths={[{ authType: AuthType.VAULT }]}
                  // we ask the user to sign a message
                  // it will be used onchain to prevent frontrunning
                  signature={{ message: signMessage(address) }}
                  // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
                  onResponseBytes={(responseBytes: string) => {
                    setResponseBytes(responseBytes);
                  }}
                  claims={[
                    {
                      groupId: COINBASE_SHIELD_HOLDER,
                      claimType: ClaimType.GTE,
                    },
                  ]}
                  // Some text to display on the button
                  text={"Mint with Sismo"}
                />
              </div>
            </div>
          )}
          {isConnected && responseBytes && !minted && (
            <div className="text-center pt-8 text-xl flex flex-col gap-4 items-center">
              <p>Chain: {chain?.name}</p>
              <p>Your NFT destination address is: {address}</p>
              <button
                className="bg-sky-600 text-white w-[95%] p-4 font-bold text-2xl rounded-2xl"
                disabled={loading || Boolean(error)}
                onClick={() => mintNft()}
              >
                {!loading ? "Mint" : "Minting..."}
              </button>
            </div>
          )}
          {isConnected && responseBytes && minted && (
            <div className="text-center pt-8 text-xl flex flex-col gap-4 items-center">
              <p>Congratulations!</p>
              <p>
                You've not just minted the NFT to {address}, you've taken a stand for digital
                freedom. Your support is helping reshape our financial future
              </p>
              <p>
                Don't stop here, though! Further fortify your resistance by also minting the Polygon
                and Gnosis Shields if you haven't already. In doing so, you'll not only increase our
                collective strength, but also qualify for a larger airdrop
              </p>
              <p>Together, let's continue forging our digital destiny</p>
              <div className="flex items-center justify-between">
                <Link
                  href="/polygon"
                  className="bg-violet-500 text-white w-[30%] p-4 font-bold  rounded-2xl"
                >
                  Mint Polygon Shield
                </Link>
                <Link
                  href="/gnosis"
                  className="bg-green-500 text-white w-[30%] p-4 font-bold  rounded-2xl"
                >
                  Mint Gnosis Shield
                </Link>
                <Link
                  href="/airdrop"
                  className="bg-white text-black w-[30%] p-4 pt-[30px] pb-[30px] font-bold  rounded-2xl"
                >
                  Claim Airdrop
                </Link>
              </div>
            </div>
          )}
        </div>
        {isConnected && !minted && error && (
          <>
            <p className={styles.error}>{error}</p>
            {error.slice(0, 16) === "Please switch to" && (
              <button onClick={() => switchNetwork?.(CHAIN.id)}>Switch chain</button>
            )}
          </>
        )}
      </main>

      {isConnected && (
        <button className={styles.disconnect} onClick={() => resetApp()}>
          Reset
        </button>
      )}
    </>
  );
}
