import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import {useMoralis} from "react-moralis"
import React, { useEffect,useState } from "react"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance(){
    const {chainId:chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses? contractAddresses[chainId][0]:null
    const[entranceFee,setEntranceFee] = useState("0")
    const [numPlayer,setNumPlayer] = useState("0")
    const [recentWinner,setRecentWinner] = useState("0")
    
    const dispatch = useNotification()

    const {runContractFunction:enterRaffle,isLoading,isFetching}=useWeb3Contract({
        abi:abi,
        contractAddress:raffleAddress,
        functionName:"enterRaffle",
        params:{},
        msgValue:entranceFee
    })

    const {runContractFunction:getRecentWinner}=useWeb3Contract({
        abi:abi,
        contractAddress:raffleAddress,
        functionName:"getRecentWinner",
        params:{},
        
    })

    const {runContractFunction:getNumberOfPlayers}=useWeb3Contract({
        abi:abi,
        contractAddress:raffleAddress,
        functionName:"getNumberOfPlayers",
        params:{},
        
    })

    const {runContractFunction:getEntranceFee}=useWeb3Contract({
        abi:abi,
        contractAddress:raffleAddress,
        functionName:"getEntranceFee",
        params:{},
        
    })

    async function updateUI(){
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayerFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayer(numPlayerFromCall)
        setRecentWinner(recentWinnerFromCall)
        
    }

    useEffect(()=>{
        if (isWeb3Enabled){
            //try to read the entrance fee

            

            updateUI()
        }
    },[isWeb3Enabled])


    const handleSuccess = async function(tx){
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function(){
        dispatch(
            {
                type:"info",
                message:"Transaction Complete!",
                title:"Tx Notification",
                position:"topR",
                icon:"bell",
            }
        )
    }

    //{} allows doing js in html
    return (<div className="p-5">Hi from Lottery Entrance
        {raffleAddress?
        
        (<div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"  
            onClick={async ()=>{
                await enterRaffle({
                    onSuccess:handleSuccess,
                    onError:(error)=>console.log(error)
                }
                )
            }}
            
            disabled={isLoading||isFetching}

            >
            {isLoading || isFetching ?(
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
                "Enter Raffle"
            )} 
            
            </button>
            <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee,"ether")} ETH</div>
            <div>Number Of Players: {numPlayer}</div>
            <div>RecentWinner: {recentWinner}</div>
            <div>Testing....</div>
    </div>):""}
    </div>)
}