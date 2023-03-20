import React from 'react'
import './home.css'
import logo from '../../images/logo.png'
import SocialLinks from '../../components/SocialLinks'
import Speaker from '../../components/Speaker'
import Header from '../../components/Header'


const Home = ({accounts, setAccounts}) => {
  return (
    <>
    <Header accounts={accounts} setAccount={setAccounts}/>
    <div className='home'>
      <SocialLinks/>
      <Speaker/>
      <img src={logo} className="mainImg" />
      <div className='main'>
        <h1>WeB3 TEMplate</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <a className='c-mint' href='/mint'>Mint</a>

        <div className='faq-wrap'>
          <h2>FAQ</h2>
          <h3>Lorem ipsum dolor sit amet?</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home