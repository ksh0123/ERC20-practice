import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress";

const App = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();

  const { sdk, provider } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-50">
      {account ? (
        <>
          <div className="fixed top-0 right-0 p-5">
            <div className="flex flex-col items-end gap-2">
              <div className="flex font-extralight text-2xl animate-pulse text-neutral-800">
                ✨ Hello, {account.substring(0, 7)}...
                {account.substring(account.length - 5)}
              </div>
              <button
                className="bg-orange-300 rounded-2xl px-4 font-extralight shadow-lg shadow-orange-600 drop-shadow-2xl hover:bg-orange-400 active:bg-orange-100"
                onClick={() => setAccount("")}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="mt-[100px]">
            {contractAddress.map((v, i) => (
              <TokenCard
                key={i}
                owner={v.owner}
                account={account}
                web3={web3}
                address={v.address}
                walletAccount={v.walletAccount}
              />
            ))}
          </div>
        </>
      ) : (
        <button className="flex flex-col justify-center items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
            alt="metamask"
            className="flex w-10 animate-bounce"
          />
          <div
            className="flex bg-orange-300 rounded-2xl px-4 font-extralight shadow-lg shadow-orange-600 drop-shadow-2xl hover:bg-orange-400 active:bg-orange-100"
            onClick={onClickMetaMask}
          >
            Login
          </div>
        </button>
      )}
    </div>
  );
};

export default App;
