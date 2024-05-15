import './Footer.scss'
import { useEffect } from 'react';

export default function Footer() {

  return (
    <div className='footer'>
      <p>Copyright &copy; 2024</p>
      <p className='template-credit'>
        <span>Template provided by <a href='https://github.com/WickyPlays' target='_blank' rel='noreferrer'>Wicky</a> - Free to use, redistribute, modify under MIT license</span>
      </p>
    </div>
  )
}