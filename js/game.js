const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const levelDisplay = document.querySelector('.level'); // adicione um <span class="level">Fase 1</span> no HTML

// === FASES DO JOGO ===
const levels = [
  {
    name: "Palavras B",
    characters: [
      'balao', 'balde', 'bebe', 'bico', 'boca',
      'bola', 'bolo', 'bota', 'bule', 'buque'
    ]
  },
  {
    name: "Palavras C",
    characters: [
      'calca', 'calor', 'cama', 'canhao', 'canoa',
      'casa', 'cerca', 'cesta', 'circo', 'cubo'
    ]
  },
  {
    name: "Palavras D",
    characters: [
      'dado', 'dente', 'dedo', 'dinheiro', 'disco',
      'doce', 'dado', 'dama', 'danca', 'dino'
    ]
  },
  {
    name: "Palavras F",
    characters: [
      'fada', 'feno', 'dedo', 'dinheiro', 'disco',
      'doce', 'dado', 'dama', 'danca', 'dino'
    ]
  }
  // Adicione mais fases aqui!
];

let currentLevel = 0;
let characters = levels[currentLevel].characters;

let firstCard = '';
let secondCard = '';
let loop;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === characters.length * 2) {
    clearInterval(loop);
    
    // Mensagem de vitória com opção de próxima fase
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        if (confirm(`Parabéns, ${spanPlayer.innerHTML}!\nVocê completou a fase "${levels[currentLevel].name}" em ${timer.innerHTML} segundos!\n\nDeseja ir para a próxima fase?`)) {
          nextLevel();
        }
      } else {
        alert(`🎉 PARABÉNS!!! Você completou TODAS as fases em ${timer.innerHTML} segundos! 🎉`);
      }
    }, 500);
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
}

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes('reveal-card')) return;

  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;
    checkCards();
  }
}

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.jpg')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
}

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  grid.innerHTML = '';
  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });

  // Atualiza o nome da fase
  document.querySelector('.level').innerHTML = levels[currentLevel].name;
}

const startTimer = () => {
  timer.innerHTML = 0;
  loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
}

const nextLevel = () => {
  currentLevel++;
  characters = levels[currentLevel].characters;
  startTimer();
  loadGame();
}

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player') || "Jogador";
  loadGame();
  startTimer();
}
