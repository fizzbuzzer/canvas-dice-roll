(function() {
  let dice;
  let rotateX = 0;
  let rotateY = 0;
  let rotateXDev = 0;
  let rotateYDev = 0;
  let rotateZDev = 0;
  let face;
  let ctx;
  const dots = {
    center: [50, 50],
    rightTop: [75, 25],
    leftTop: [25, 25],
    leftBottom: [25, 75],
    rightBottom: [75, 75],
    centerTop: [50, 25],
    centerBottom: [50, 75],
  };
  const config = [
    {
      transform: '',
      dots: [dots.center],
    },
    {
      transform: 'rotateY(90deg)',
      dots: [dots.rightTop, dots.leftBottom],
    },
    {
      transform: 'rotateX(90deg)',
      dots: [dots.center, dots.rightTop, dots.leftBottom],
    },
    {
      transform: 'rotateX(-90deg)',
      dots: [dots.rightTop, dots.leftBottom, dots.leftTop, dots.rightBottom],
    },
    {
      transform: 'rotateY(-90deg)',
      dots: [dots.center, dots.rightTop, dots.leftBottom, dots.leftTop, dots.rightBottom],
    },
    {
      transform: 'rotateX(-180deg)',
      dots: [dots.rightTop, dots.leftBottom, dots.leftTop, dots.rightBottom, dots.centerTop, dots.centerBottom],
    },
  ];
  const shadowDom = `
  <style>
    :hover {
      cursor: pointer;
    }
  </style>
  <slot></slot>
  `;

  function initDice() {
    dice = document.querySelector("[data-widget='dice']");
    dice.style['transformOrigin'] = '50px 50px';
    dice.style['transformStyle'] = 'preserve-3d';
    dice.style.width = '100px';
    dice.style.height = '100px';
    dice.style.transform = `rotateX(${getRandomAngle()}deg) rotateY(${getRandomAngle()}deg) rotateZ(${getRandomAngle()}deg)`;
    dice.style.transition = 'transform 4s ease 0s';
    dice.attachShadow({
      mode: 'open',
    });
    dice.shadowRoot.innerHTML = shadowDom;
    dice.addEventListener('click', onDiceClick);
    buildDots();
  }

  function onDiceClick() {
    rotateX += getRandomAngle(10, 20, 90);
    rotateY += getRandomAngle(10, 20, 90);
    rotateXDev = getRandomAngle();
    rotateYDev = getRandomAngle();
    rotateZDev = getRandomAngle();
    dice.style.transform = `rotateX(${rotateX + rotateXDev}deg) rotateY(${rotateY + rotateYDev}deg) rotateZ(${rotateZDev}deg)`;
  }

  function getRandomAngle(min = 0, max = 5, multiply = 1) {
    return multiply * (Math.floor(Math.random() * (max - min + 1)) + min); 
  }

  function buildDots() {
    config.forEach((item) => {  
      face = document.createElement('canvas');
      face.style.position = 'absolute';
      face.style['backgroundColor'] = '#ebede5';
      face.style['borderRadius'] = '4px';
      face.style.border = '1px solid #878075'
      face.style.background = '#fffaf0';
  
      if(Object.prototype.hasOwnProperty.call(item, 'transform')) {
        face.style.transform = item.transform;
      }
      face.style.transform += ' translateZ(50px)';
      face.width = 100;
      face.height = 100;
      ctx = face.getContext('2d');
      dice.appendChild(face);
    
      item.dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(...dot, 10, 0, Math.PI * 2); 
        ctx.fill();
        ctx.closePath();
      });
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDice();
  });
})()