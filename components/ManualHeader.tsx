import * as React from 'react';
import { useState, useEffect } from 'react';
import { useMoralis } from "react-moralis";


function ManualHeader() {
    const { enableWeb3, deactivateWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading } = useMoralis();
    // useState(isWeb3Enabled);

    useEffect(() => {
        if(isWeb3Enabled) return;
        if(typeof window !== "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account: any) => {
            console.log(`Account changed to ${account}`);
            if(account == null){
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("Null account found!");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const executeEnableWeb3 = async() => {
        await enableWeb3();
        if (typeof window !== "undefined"){
            window.localStorage.setItem("connected", "injected");
        }
    }

    const renderConnected = () => {
        return (
            <div>
                Connected! to {account?.slice(0,6)}...{account?.slice(account.length - 4)}
            </div>
        )
    }

    const renderNotConnected = () => {
        return (
            <button onClick={executeEnableWeb3} disabled={isWeb3EnableLoading}>Connect</button>
        )
    }

    return (
        <div>
            {account ? (renderConnected()) : (renderNotConnected())}
        </div>
    );
}

export default ManualHeader;