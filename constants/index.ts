import abi from "./abi.json";
import contractAddresses from "./contractAddresses.json";

interface ContractAddressInfo {
    [chainId: string]: string[];
}

export const ABI = abi;
export const CONTRACT_ADDRESSES: ContractAddressInfo = contractAddresses;
