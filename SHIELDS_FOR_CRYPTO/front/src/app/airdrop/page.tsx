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
import { abi as AirdropABI } from "../../../../abi/Airdrop.json";
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
    impersonate: [
      "barmstrong.eth",
      "dhadrien.sismo.eth",
      "0x28f93e363770fD59134fD2b72604fd983b5b5266",
    ],
  },
};

/* ********************  Defines the chain to use *************************** */
const CHAIN = polygonMumbai;

export default function Home() {
  const GITCOIN_PASSPORT_GROUP_ID = "0x1cde61966decb8600dfd0749bd371f12";
  const COINBASE_SHIELD_HOLDER = "0x842e4d1671d72526762a77ade9feb49a";
  const POLYGON_SHIELD_HOLDER = "0xa6222ccb03cc6df071f763a9e4c863bf";
  const APECOIN_SHIELD_HOLDER = "0xa38f2195fab86c42c00be0c8cb75a620";

  /* ***********************  Application states *************************** */
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [amountClaimed, setAmountClaimed] = useState<string>("");
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
  const contractCallInputs =
    responseBytes && chain
      ? {
          address: "0x56Ae775e633A1BA6b467FB808F74cBb533125E87",
          abi: [...AirdropABI, ...errorsABI],
          functionName: "claimWithSismo",
          args: [address, responseBytes],
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
    if (!wagmiSimulateError) return;
    if (!isConnected) return;
    return setError(formatError(wagmiSimulateError));
  }, [wagmiSimulateError, isConnected]);

  /* ************  Handle the nft claim button click ******************* */
  async function claimAirdrop() {
    if (!address) return;
    setError("");
    setLoading(true);
    try {
      // Switch to the selected network if not already on it
      if (chain?.id !== CHAIN.id) await switchNetworkAsync?.(CHAIN.id);
      const tx = await writeAsync?.();
      const txReceipt = tx && (await waitForTransaction({ hash: tx.hash }));
      console.log(txReceipt);
      if (txReceipt?.status === "success") {
        const mintEvent = decodeEventLog({
          abi: AirdropABI,
          data: txReceipt.logs[0]?.data,
          topics: txReceipt.logs[0]?.topics,
        });
        const args = mintEvent?.args as {
          value: string;
        };
        const ethAmount = formatEther(BigInt(args.value));
        setAmountClaimed(ethAmount);
      }
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setLoading(false);
    }
  }

  /* *************************  Reset state **************************** */
  function resetApp() {
    disconnect();
    setAmountClaimed("");
    setResponseBytes("");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.delete("sismoConnectResponseCompressed");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>
      <main className="relative">
        <div className="text-center pt-[5rem] w-[35rem] mx-auto mb-72 min-h-screen">
          <h3 className="font-bold text-5xl mb-4 text-white pb-6"> Claim Your Airdrop</h3>
          <p className="text-center text-xl">
            To claim your airdrop, follow the on-screen instructions accordingly. Upon successful
            claiming, you will receive 100 SHIELD tokens per task. These tokens represent our
            collective fight for truly fair markets and the future of crypto finance, placing the
            power to shape destiny in our hands. Using Sismo ZK technology, with the combination of
            cryptography and privacy, we not only claim our right to fair markets but also to our
            right to privacy. This is the true embodiment of power - power that is now yours to
            wield
          </p>
          <div className="w-full text-center">
            {!isConnected && (
              <div className="mb-2">
                {connectors.map((connector) => (
                  <button
                    className="bg-white mt-4 text-black w-[95%] p-4 font-bold text-2xl rounded-2xl"
                    disabled={!connector.ready || isLoading}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                  >
                    {isLoading && pendingConnector?.id === connector.id
                      ? "Connecting..."
                      : "Connect wallet"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isConnected && !responseBytes && (
            <div className="text-center mt-8">
              <p>
                <b>Chain: {chain?.name}</b>
                <br />
                <b>Your airdrop destination address is: {address}</b>
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
                      groupId: GITCOIN_PASSPORT_GROUP_ID,
                      value: 15,
                      claimType: ClaimType.GTE,
                    },
                    { groupId: COINBASE_SHIELD_HOLDER, isOptional: true },
                    { groupId: POLYGON_SHIELD_HOLDER, isOptional: true },
                    { groupId: APECOIN_SHIELD_HOLDER, isOptional: true },
                  ]}
                  // Some text to display on the button
                  text={"Claim with Sismo"}
                />
              </div>
            </div>
          )}
          {isConnected && responseBytes && !amountClaimed && (
            <div className="text-center pt-8 text-xl flex flex-col gap-4 items-center">
              <p>Chain: {chain?.name}</p>
              <p>Your Airdrop destination address is: {address}</p>
              <button
                className="bg-white text-black w-[95%] p-4 font-bold text-2xl rounded-2xl"
                disabled={loading || Boolean(error)}
                onClick={() => claimAirdrop()}
              >
                {!loading ? "Claim" : "Claiming..."}
              </button>
            </div>
          )}
          {isConnected && responseBytes && amountClaimed && (
            <div className="text-center pt-8 text-2xl font-bold flex flex-col gap-4 items-center">
              <p>Congratulations!</p>
              <p>
                You have claimed {amountClaimed} tokens on {address}.
              </p>
            </div>
          )}
        </div>
        <div className="bg-slate-900 h-[17rem] w-[21.5rem] absolute right-8 top-20 rounded-md flex flex-col gap-3 justify-center items-center border">
          <div className="h-[90%] w-[90%] rounded-md relative">
            <Image className="rounded-md" src="/gnosis.png" fill={true} alt="gnosis" />
          </div>
        </div>
        <div className="bg-slate-900 h-[17rem] w-[21.5rem] absolute right-8 bottom-20 rounded-md flex flex-col gap-3 justify-center items-center border">
          <div className="h-[90%] w-[90%] rounded-md relative">
            <Image className="rounded-md" src="/polygon.png" fill={true} alt="polygon" />
          </div>
        </div>
        <div className="bg-slate-900 h-[17rem] w-[21.5rem] absolute left-0 bottom-20 rounded-md flex flex-col gap-3 justify-center items-center border">
          <div className="h-[90%] w-[90%] rounded-md relative">
            <Image className="rounded-md" src="/apedao.png" fill={true} alt="ape" />
          </div>
        </div>
        <div className="bg-slate-900 h-[17rem] w-[21.5rem] absolute left-0 top-20 rounded-md flex flex-col gap-3 justify-center items-center border">
          <div className="h-[90%] w-[90%] rounded-md relative">
            <Image className="rounded-md" src="/shieldeth.png" fill={true} alt="shield" />
          </div>
        </div>
        {isConnected && !amountClaimed && error && (
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
