import { useEffect, useState } from "react";
import OptionCard from "./OptionCard";
import mintTokenAbi from "../mintTokenAbi.json";
import contractAddress from "../contractAddress.json";

import { FaRegCopy, FaCheck, FaTrash } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";

const TokenCard = ({ owner, account, web3, address, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("TOKEN");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState("0");
  const [inputAccount, setInputAccount] = useState("");

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();

      setName(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      setBalance(Number(web3.utils.fromWei(response, "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const onClickTrue = () => {
    setIsClicked(true);
  };
  const onClickFalse = () => {
    setIsClicked(false);
  };

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({
          from: account,
        });

      getBalanceOf();

      setInputValue(0);
      setInputAccount("");
      setIsClicked(false);
      alert("성공적으로 토큰을 전송하였습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!contract || !account) return;

    getName();
    getSymbol();
    getBalanceOf();
  }, [contract, account, balance]);

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  return (
    <>
      <div className="max-w-screen-2xl px-20 flex flex-row justify-between items-center border-b-[1px] border-neutral-800 font-extralight hover:text-orange-600">
        <div className="flex w-44">
          {owner}님
          <button onClick={onClickClipBoard}>
            <FaRegCopy className="ml-1 scale-75 fill-orange-700 active:fill-orange-200" />
          </button>
        </div>
        <div className=" mx-auto w-full h-10 flex flex-row gap-3 items-center justify-between">
          <span className="w-[100px] mr-10">{name}</span>
          <span className="w-[100px]">{symbol}</span>
          <span className="w-[300px] mr-10">{balance}</span>
          <span className="w-[200px] self-center">
            <FiSend
              className={`ml-1 fill-orange-700 active:fill-orange-200 ${
                isClicked && "hidden"
              }`}
              onClick={onClickTrue}
            />
            <div
              className={`text-sm w-fit flex flex-row gap-2 ${
                isClicked ? "visible" : "hidden"
              }`}
            >
              {/* <input
                type="text"
                placeholder="보낼 지갑주소"
                value={inputAccount}
                onChange={(e) => setInputAccount(e.target.value)}
                className="text-ellipsis w-[150px] rounded-sm active:bg-orange-300"
              /> */}
              <select
                value={inputAccount}
                onChange={(e) => setInputAccount(e.target.value)}
              >
                <option value="받는 사람"></option>
                {contractAddress.map((v, i) => (
                  <OptionCard
                    key={i}
                    owner={v.owner}
                    walletAccount={v.walletAccount}
                  />
                ))}
              </select>
              <input
                type="text"
                placeholder="보낼 금액"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-ellipsis w-[80px] rounded-sm active:bg-orange-300"
              />
              <FaCheck onClick={onSubmitSend} />
              <FaTrash onClick={onClickFalse} />
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default TokenCard;
