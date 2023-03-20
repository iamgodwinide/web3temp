import React from 'react'
import './style.css'

function SocialLinks() {
  return (
    <div className='s-links-wrap'>
        <ul>
            <li>
                <a href='/'>
                    <i className='fab fa-facebook'/>
                </a>
            </li>
            <li>
                <a href='/'>
                    <i className='fab fa-twitter'/>
                </a>
            </li>
            <li>
                <a href='/'>
                    <i class="fab fa-github"></i>
                </a>
            </li>
        </ul>
    </div>
  )
}

export default SocialLinks