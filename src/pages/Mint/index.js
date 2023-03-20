import React from 'react'
import './style.css'
import MintButton from '../../components/MintButton'
import Header from '../../components/Header';
import logo from '../../images/logo.png'


function Mint({accounts, setAccounts}) {
  return (
    <>
    <Header accounts={accounts} setAccount={setAccounts}/>
    <div className="mint-wrap">
        <h1>WEB3TEMP</h1>
        <img src={logo}/>
        <MintButton accounts={accounts} setAccounts={setAccounts}/>
    </div>
    </>
  )
}

export default Mint