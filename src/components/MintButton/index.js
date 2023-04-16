import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import newcontract from './Newcontract.json';
import './style.css'
import { useAlert } from 'react-alert';
import { Progress } from 'reactstrap'
import { keccak256 } from 'ethers/lib/utils';
import MerkleTree from 'merkletreejs'
import addresses from '../../constants/addresses.json';

// CONTRACT ADDRESS
const newcontractAddress = "0x038a70439Cc330D4A077525C2F7d51f3F0dbD66C";

const MintButton = ({ accounts, setAccounts }) => {
    const [mintAmount, setMintAmount] = useState(1);
    const [freemintAmount] = useState(1);
    const [totalSupply, settotalSupply] = useState("0");
    const [maxSupply, setMaxSupply] = useState("0");
    const [loading, setLoading] = useState(true);
    const [price, setPrice] = useState(0);

    const alert = useAlert();

    const buff2Hex = x => "0x" + x.toString('hex');

    const hanldeMerkleProof = () => {
        const leaves = addresses.map(addr => keccak256(addr));
        const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
        const leaf =  keccak256(accounts[0]);
        const proof = tree.getProof(leaf).map(el => buff2Hex(el.data));
        return proof;
    }

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                newcontractAddress,
                newcontract,
                signer
            );
            const cost = await contract.PRICE_ALLOWLIST();
            try {
                // const response = await contract.AllowlistMint(BigNumber.from(mintAmount), hanldeMerkleProof(), {
                //     value: ethers.utils.parseEther( mintAmount > 1 ? (price * mintAmount).toFixed(3) : 0 )
                // });
                const response = await contract.PublicMint(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther( mintAmount > 1 ? (price * mintAmount).toFixed(3) : 0 )
                });
                alert.success("minted successfully");
            } catch (err) {
                alert.error(err?.reason);
                console.log("error: ", err)
            };
        };
    };


    async function handlefreeMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                newcontractAddress,
                newcontract,
                signer
            );
            try {
                const value = ethers.utils.parseEther((0).toString())
                // const response = await contract.PublicMint(BigNumber.from(freemintAmount), {
                //     value
                // });
                const response = await contract.AllowlistMint(BigNumber.from(freemintAmount), hanldeMerkleProof(), {
                    value
                });
                alert.success("minted successfully");
            } catch (err) {
                alert.error(err?.reason);
                console.log("error: ", err)
            };
        };
    };


    // for getting price
    const getPrice = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            newcontractAddress,
            newcontract,
            signer
        );
        const cost = await contract.PRICE_ALLOWLIST();
        const truncatedPrice = (cost / 1000000000000000000)
        setPrice(truncatedPrice)
    }

    //for getting the total supply
    async function gettotalsupply() {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // We connect to the Contract using a Provider, so we will only
            // have read-only access to the Contract
            const contract = new ethers.Contract(
                newcontractAddress,
                newcontract,
                signer
            );
            // call the tokenIds from the contract
            const _totalsupply = await contract.totalSupply();
            const _maxsupply = await contract.MAX_SUPPLY();
            //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
            settotalSupply(_totalsupply.toString());
            setMaxSupply(_maxsupply.toString());
            setLoading(false);
            setTimeout(gettotalsupply, 5000)
        } catch (err) {
            setTimeout(gettotalsupply, 5000);
            console.error(err);
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    };
    const handleIncrement = () => {
        if (mintAmount >= 10) return;
        setMintAmount(mintAmount + 1);
    };

    const handleClick = () => {
        // handleMint();
        if (mintAmount > 2) {
            handleMint();
        } else {
            handlefreeMint();
        }
    }

    // connect button
    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts);
        }
    }

    async function disconnectAccount() {
        setAccounts([]);
    }

    useEffect(() => {
        if (accounts[0]) gettotalsupply();
        getPrice()
    }, [accounts])

    return (
        <div className='mint-root'>
            {
                typeof accounts[0] !== 'undefined'
                    ? <div className='mint-container'>
                        {
                            loading === false
                                &&
                                totalSupply == maxSupply
                                ? <h1 className="sold-out-text">SOLD OUT</h1>
                                :
                                <>
                                    <Progress
                                        animated
                                        className="my-3"
                                        color='danger'
                                        value={100}
                                    >
                                    </Progress>
                                    <div className='prog-info'>
                                        <h3>Total supply: {totalSupply}</h3>
                                        <h3>Max supply: {maxSupply}</h3>
                                    </div>
                                    <div className='prog-info'>
                                        <h3>Price: {mintAmount === 1? 0 : (price * mintAmount).toFixed(3)}</h3>
                                    </div>
                                </>

                        }
                        <div className="mintwrap">
                            <button className='btn crementors' onClick={handleDecrement}>-</button>
                            <input className="form-control" type='number' value={mintAmount} />
                            <button className='btn crementors' onClick={handleIncrement}>+</button>
                        </div>

                        {/* for free mint uncomment the next line */}
                        <button className='btn mint' onClick={handleClick}>{mintAmount === 1 ? "Mint Free Now" : "Mint Now"}</button>
                        
                        {/* comment the next line for no free mint */}
                        {/* <button className='btn mint' onClick={handleClick}>{"Mint Now"}</button> */}

                        <div className='small-btns'>
                            <button color="btn" onClick={disconnectAccount}>
                                <i className="fas fa-unlink"></i></button>
                            <a
                                onClick={() => {}}
                                className='btn tweet'>
                                <i className='fab fa-twitter' />
                                {" "}Tweet</a>
                        </div>
                    </div>
                    : <div className="connect-btn-wrap">
                        <button color="btn btn-primary" onClick={connectAccount}>
                            <i className="fas fa-link"></i>
                            <span></span>
                            {" "}Connect {" "}Wallet
                        </button>
                    </div>
                }
        </div>
    )
};

export default MintButton;