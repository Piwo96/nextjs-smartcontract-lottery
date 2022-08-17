// have a function to enter the lottery
import { useEffect, useState, ReactElement } from "react";
import {useWeb3Contract, useMoralis } from "react-moralis";
import { ABI, CONTRACT_ADDRESSES } from "../constants";
import { ethers, ContractTransaction, BigNumber } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrace() {
    // Constants
    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis();
    const chainId = parseInt(chainIdHex!);
    const lotteryAddress = chainId in CONTRACT_ADDRESSES ? CONTRACT_ADDRESSES[chainId][0] : null;
    const dispatch = useNotification();

    // useStates
    const [entranceFee, setEntracneFee] = useState<string>("0");
    const [numOfPlayers, setNumbOfPlayers] = useState<number>(0);
    const [recentWinner, setRecentWinner] = useState<string | null>(null);
    const [userEntered, setUserEntered] = useState<boolean>(false);


    // Transactions
    const {runContractFunction: enterLottery, isLoading, isFetching} = useWeb3Contract({
        abi: ABI,
        contractAddress: lotteryAddress!,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee
    });
    
    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: ABI,
        contractAddress: lotteryAddress!,
        functionName: "getEntranceFee",
        params: {},
    });

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: ABI,
        contractAddress: lotteryAddress!,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: ABI,
        contractAddress: lotteryAddress!,
        functionName: "getRecentWinner",
        params: {},
    });

    // Event listeners
    async function listenForWinnerToBePicked(){
        const lottery = new ethers.Contract(lotteryAddress!, ABI, web3);
        console.log("Waiting for a winner ...");
        await new Promise<void>((resolve, reject) => {
            lottery.once("WinnerPicked", async() => {
                console.log("We got a winner!");
                try {
                    await updateUI();
                    resolve();
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    async function listenForLotteryEntrance(){
        const lottery = new ethers.Contract(lotteryAddress!, ABI, web3);
        console.log("Listen vor lottery entrance ...");
        await new Promise<void>((resolve, reject) => {
            lottery.once("LotteryEnter", async() => {
                console.log("Lottery entrance detected!");
                try {
                    updateUI();
                    resolve();
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    // useEffects
    useEffect(() => {
        if(isWeb3Enabled){
            updateUI();
            listenForWinnerToBePicked();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled, numOfPlayers])

    // Mehtods
    async function updateUI(){
        const entranceFeeFromContract: string = ((await getEntranceFee()) as BigNumber).toString();
        const numOfPlayers: number = ((await getNumberOfPlayers()) as BigNumber).toNumber();
        const recentWinner: string = (await getRecentWinner()) as string;
        setEntracneFee(entranceFeeFromContract);
        setNumbOfPlayers(numOfPlayers);
        setRecentWinner(recentWinner);
    }

    const handleEnterLottery = async () => {
        setUserEntered(true);
        await enterLottery({onError: handleMetamaskError});
        await listenForLotteryEntrance()
            .then(() => dispatch({
                type: "info",
                message: "Transaction Complete!",
                title: "Transaction Notification",
                position: "topR",
                icon: "bell",
            }))
            .catch((error) => {
                 console.log(error
            )});
        setUserEntered(false);
    }

    const handleMetamaskError = async() => {
        setUserEntered(false);
    }

    // Render
    const renderValidChainComponent = () => {
        return(
            <div className="py-3">
                <div className="flex justify-start">
                    <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={handleEnterLottery}
                    disabled={isLoading || isFetching}
                    >{isLoading || isFetching 
                        ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> 
                        : <div>Enter Lottery</div>}
                    </button>
                    <div>
                        {userEntered 
                            ? <div className="bg-orange-200 italic py-4 px-4 rounded ml-2">Pending...</div> 
                            : <div></div>}
                    </div>
                </div>
                <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}</div>
                <div>Number Of Players: {numOfPlayers}</div>
                <div>Recent Winner: {recentWinner}</div>
            </div>
        )
    }

    const renderUnvalidChainComponent = () => {
        return(
            <div>
                No Lottery Address Detetched!
            </div>
        )
    }

    return ( 
        <div>
            { lotteryAddress ? renderValidChainComponent() : renderUnvalidChainComponent() }
        </div>
     );
}

export default LotteryEntrace;