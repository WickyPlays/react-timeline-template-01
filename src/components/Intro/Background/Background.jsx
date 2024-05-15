import './Background.scss'
import { useEffect } from 'react';

export default function Background() {

  const animate = () => {
    const circles = document.querySelectorAll('.circles li');

    circles.forEach(function (circle) {
      circle.style.width = Math.random() * 50 + 5 + 'px';
      circle.style.height = circle.style.width;
      circle.style.left = Math.random() * 100 + '%';
      circle.style.animationDelay = getRandomDelay() + 's';
      circle.style.animationDuration = getRandomDuration() + 's';
    });

    function getRandomDelay() {
      return Math.random() * 5 + 2;
    }

    function getRandomDuration() {
      return Math.random() * 10 + 2;
    }
  }

  useEffect(() => {
    let ul = document.querySelector('.circles');

    for (let i = 0; i < 30; i++) {
      let liClone = ul.children[0].cloneNode(true);
      ul.appendChild(liClone);
    }

    animate()
  }, [])

  return (
    <div className='bg'>
      <div className='logo-container'>
        <div className='logo'></div>
      </div>
      <ul className="circles">
        <li></li>
      </ul>
    </div>
  )
}