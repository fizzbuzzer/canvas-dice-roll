(function() {
  class Dice {
    static #DOTS = Object.freeze({
      center: [50, 50],
      rightTop: [75, 25],
      leftTop: [25, 25],
      leftBottom: [25, 75],
      rightBottom: [75, 75],
      centerTop: [50, 25],
      centerBottom: [50, 75],
    });

    static #FACES_SET = Object.freeze([
      {
        transform: '',
        dots: [Dice.#DOTS.center],
      },
      {
        transform: 'rotateY(90deg)',
        dots: [Dice.#DOTS.rightTop, Dice.#DOTS.leftBottom],
      },
      {
        transform: 'rotateX(90deg)',
        dots: [Dice.#DOTS.center, Dice.#DOTS.rightTop, Dice.#DOTS.leftBottom],
      },
      {
        transform: 'rotateX(-90deg)',
        dots: [Dice.#DOTS.rightTop, Dice.#DOTS.leftBottom, Dice.#DOTS.leftTop, Dice.#DOTS.rightBottom],
      },
      {
        transform: 'rotateY(-90deg)',
        dots: [Dice.#DOTS.center, Dice.#DOTS.rightTop, Dice.#DOTS.leftBottom, Dice.#DOTS.leftTop, Dice.#DOTS.rightBottom],
      },
      {
        transform: 'rotateX(-180deg)',
        dots: [Dice.#DOTS.rightTop, Dice.#DOTS.leftBottom, Dice.#DOTS.leftTop, Dice.#DOTS.rightBottom, Dice.#DOTS.centerTop, Dice.#DOTS.centerBottom],
      },
    ]); 

    #colors = Dice.#colorService({
      face: '#fffaf0',
      border: '#878075',
      dot: '#000000',
    });

    #node;
    #rotateX = 0;
    #rotateY = 0;

    constructor(node) {
      this.#node = node;
      this.#colors.face = node.dataset.faceColor;
      this.#colors.border = node.dataset.borderColor;
      this.#colors.dot = node.dataset.dotColor;
    }

    render() {
      const dice = this.#node;
      dice.style['transformOrigin'] = '50px 50px';
      dice.style['transformStyle'] = 'preserve-3d';
      dice.style.width = '100px';
      dice.style.height = '100px';
      dice.style.margin = '20px';
      dice.style.transform = `rotateX(${Dice.#getRandomAngle()}deg) rotateY(${Dice.#getRandomAngle()}deg) rotateZ(${Dice.#getRandomAngle()}deg)`;
      dice.style.transition = 'transform 4s ease 0s';
      dice.attachShadow({
        mode: 'open',
      });
      dice.shadowRoot.innerHTML = `
        <style>
          :hover {
            cursor: pointer;
          }
        </style>
        <slot></slot>
      `;

      this.#buildDots();
      dice.addEventListener('click', this.#onDiceClick.bind(this));
    }

    #buildDots() {
      Dice.#FACES_SET.forEach((item) => {  
        const face = document.createElement('canvas');
        face.style.position = 'absolute';
        face.style['backgroundColor'] = this.#colors.face;
        face.style['borderRadius'] = '4px';
        face.style.border = `1px solid ${this.#colors.border}`
    
        if(Object.prototype.hasOwnProperty.call(item, 'transform')) {
          face.style.transform = item.transform;
        }

        face.style.transform += ' translateZ(50px)';
        face.width = 100;
        face.height = 100;
        const ctx = face.getContext('2d');
        this.#node.appendChild(face);
        ctx.fillStyle = this.#colors.dot;
      
        item.dots.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(...dot, 10, 0, Math.PI * 2); 
          ctx.fill();
          ctx.closePath();
        });
      })
    }

    #onDiceClick() {
      this.#rotateX += Dice.#getRandomAngle(12, 23, 90);
      this.#rotateY += Dice.#getRandomAngle(12, 23, 90);
      let xDeviation = Dice.#getRandomAngle();
      let yDeviation = Dice.#getRandomAngle();
      let zDeviation = Dice.#getRandomAngle();
      this.#node.style.transform = `rotateX(${this.#rotateX + xDeviation}deg) rotateY(${this.#rotateY + yDeviation}deg) rotateZ(${zDeviation}deg)`;
    }

    static #getRandomAngle(min = 0, max = 5, multiply = 1) {
      return multiply * (Math.floor(Math.random() * (max - min + 1)) + min); 
    }

    static #colorService(target) {
      return new Proxy(target, {
        set(target, key, value) {
          if (value !== undefined && isColor(value)) {
            target[key] = value;
          }
          return true;
        }
      }); 
  
      function isColor(strColor){
        var style = new Option().style;
        style.color = strColor;
        return style.color !== '';
      }
    } 
  }

  function init() {
    const nodes = document.querySelectorAll("[data-widget='dice']");
    if (nodes.length === 0) {
      return;
    }
    
    nodes.forEach(node => {
      (new Dice(node)).render();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
})()