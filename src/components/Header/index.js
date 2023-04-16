import React from 'react'
import './header.css'
import {NavLink} from 'react-router-dom'

const Header = ({accounts, setAccount}) => {

    // connect button
    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts);
        }
    }

    async function disconnectAccount() {
        console.log(accounts)
        setAccount([]);
    }

  return (
    <div className='nav-wrapper'>
        <a href='/' className='logo'>WEB3TEMP</a>
        <nav>
            <ul>
                {/* <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/mint'>Mint</NavLink>
                </li> */}
            </ul>
        </nav>
        {
            typeof accounts[0] !== 'undefined'
            ?<button onClick={disconnectAccount} className='connect-btn'>Disconnect Wallet</button>
            :<button onClick={connectAccount} className='connect-btn'>Connect Wallet</button>

        }
    </div>
  )
}

export default Header