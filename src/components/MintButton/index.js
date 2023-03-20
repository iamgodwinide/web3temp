import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import newcontract from './Newcontract.json';
import './style.css'
import { useAlert } from 'react-alert';
import { Progress } from 'reactstrap'

const newcontractAddress = "0x17cC48c7e5C2D76b371cC4FbB96C2F91470fEe41";

const MintButton = ({ accounts, setAccounts }) => {
    const [mintAmount, setMintAmount] = useState(1);
    const [freemintAmount] = useState(1);
    const [totalSupply, settotalSupply] = useState("0");
    const [maxSupply, setMaxSupply] = useState("0");
    const [loading, setLoading] = useState(true);

    const alert = useAlert();

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                newcontractAddress,
                newcontract,
                signer
            );
            try {
                const response = await contract.mint(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.005 * (mintAmount - 1)).toString())
                });
                alert.success("minted successfully");
                console.log(response);
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
                const response = await contract.mint(BigNumber.from(freemintAmount), {
                    value
                });
                alert.success("minted successfully");
                console.log(response)
            } catch (err) {
                alert.error(err?.reason);
                console.log("error: ", err)
            };
        };
    };

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
            const _maxsupply = await contract.maxSupply();
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
        if (mintAmount > 1) {
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
                                        <h3>Total supply: 0</h3>
                                        <h3>Max supply: 5555</h3>
                                    </div>
                                </>

                        }
                        <div className="mintwrap">
                            <button className='btn crementors' onClick={handleDecrement}>-</button>
                            <input className="form-control" type='number' value={mintAmount} />
                            <button className='btn crementors' onClick={handleIncrement}>+</button>
                        </div>
                        <button className='btn mint' onClick={handleClick}>{mintAmount === 1 ? "Mint Free Now" : "Mint Now"}</button>
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