import birdsData from './birds.js';

// variables
let count = 0;
let random = 0;
let score = 0;
let listBirds = birdsData[count];
let buttonContainer = document.querySelector('.birds__list-group');
let birdContentContainer = document.querySelector('.bird__content');
let rightAnswer = false;
let imgSrc = undefined;
let birdName = undefined;


window.onload = function() {

  getRndInteger();
  //getAnknownTrack();
  fillListOfBirds();
  addButonClickHandler();

  console.log('Cross-check: 230');
  console.log(`
  Вёрстка, дизайн, UI всех трёх страниц приложения +60
  Аудиоплеер +10
  Верхняя панель страницы викторины +20
  Блок с вопросом +20
  Блок с вариантами ответов (названия птиц) +60
  Блок с описанием птицы: +30
  Кнопка перехода к следующему вопросу +30`);
}

class BirdContents {
  constructor(buttonId) {
    this.image = listBirds[buttonId].image;
    this.name = listBirds[buttonId].name;
    this.species = listBirds[buttonId].species;
    this.description =  listBirds[buttonId].description;
    this.audio = listBirds[buttonId].audio;
  } 
}

const getRndInteger = () => {
  let min = 0;
  let max = 5;
  random = Math.floor(Math.random() * (max - min + 1)) + min;
}

const getAnknownTrack = () => {
  const audio = listBirds[random].audio;
  const audioSrc = document.querySelector('.audio-src');
  audioSrc.src = audio;
}

const fillListOfBirds = () => {

  listBirds.forEach(element => {
    createBirdsItem(element.name, element.id);
  } );

  getAnknownTrack();
}

const createBirdsItem = (name, id) => {

  let li = document.createElement('li');
  li.classList.add('birds__list-item');
  li.dataset.type = 'button';
  let span = document.createElement('span');
  span.classList.add('li-btn');
  span.dataset.type = 'button';
  li.appendChild(span);
  let spanText = document.createElement('span');
  spanText.dataset.type = 'button';
  li.appendChild(spanText);
  spanText.textContent = name;
  li.id = id;
  buttonContainer.appendChild(li);
}

const clickNextButton = document.querySelector('.next');
clickNextButton.addEventListener('click', () => {
  if(rightAnswer) {

    if(count < 5) {

      count += 1;
      listBirds = birdsData[count];
      buttonContainer.innerHTML = '';
      getRndInteger();
      clearContentContainer();
      fillListOfBirds();
      changeGroupTagActive(count);
      rightAnswer = false;
      defaultBird();
      document.querySelector('.next').style.backgroundColor = '#424242';
    } else showResultPage();
  }
}, false);

const changeGroupTagActive = (count) => {
  const groupBirds = document.querySelectorAll('.group-birds__list .group-birds__item');
  groupBirds.forEach(groupBird => {
    groupBird.classList.remove('active');
    groupBirds[count].classList.add('active');
  })
}

const addButonClickHandler = () => {
  document.querySelector('.birds__list-group').addEventListener('click', (e) => {
    const type = e.target.dataset.type;
    if(type === 'button') {

      const buttonId =
      e.target.tagName.toLowerCase() === 'li'
      ? e.target.id
      : e.target.parentNode.id;
      createBirdContent(buttonId - 1);
      if(random === (buttonId - 1)) {

        if(!rightAnswer) {
          score += 5;
          audioClick(true);
        }

        rightAnswer = true;
        showRightAnswer();
        changeColorAnswer((buttonId - 1), true);
        document.querySelector('.next').style.backgroundColor = '#00b147';
        document.querySelector('.audio-src').pause();
      } else {

        if(!rightAnswer) {
          audioClick(false);
          changeColorAnswer((buttonId - 1), false);
          score -= 1;
        }
      }
      if(score > 0) {

      document.querySelector('.score').textContent = score;
      document.querySelector('.score1').textContent = score;
      } else {

        document.querySelector('.score').textContent = '0';
      document.querySelector('.score1').textContent = '0';
      }
    }
  })
}

const showResultPage = () => {

  const mainGame = document.querySelector('.main-game');
  const result = document.querySelector('.result');
  const resultText = document.querySelector('.result__batton-text');
  mainGame.style.display = 'none';
  result.style.display = 'block';
  if(score === 30) {
    resultText.textContent = 'Игра окончена!';
  }
}

const clickNewGame = document.querySelector('.result__batton');
clickNewGame.addEventListener('click', () => {
  window.location.replace("./game.html");
}, false);

const clearContentContainer = () => {
  birdContentContainer.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = 'Послушайте плеер. Выберите птицу из списка';
  birdContentContainer.appendChild(span);
}

const createBirdContent = (id) => {

  birdContentContainer.innerHTML = '';
  
  const birdContent = new BirdContents(id);
  imgSrc = birdContent.image;
  birdName = birdContent.name;
  const species = birdContent.species;
  const description = birdContent.description;
  const urlAudio = birdContent.audio;
  const audio = new Audio(urlAudio);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('contentWrapper');

  const divImg = document.createElement('div');
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = birdName;
  img.classList.add('bird-img');
  divImg.appendChild(img);
  
  const playerContent = document.createElement('div');
  playerContent.classList.add('player__content');
  const playerNameBird = document.createElement('div');
  playerContent.append(playerNameBird);
  const spanName = document.createElement('span');
  spanName.append(birdName);
  playerNameBird.append(spanName);
  const spanSpecies = document.createElement('span');
  spanSpecies.append(species);
  spanSpecies.classList.add('bird-species');
  playerNameBird.append(spanSpecies);
  playerNameBird.classList.add('player__name-bird');
  const divAudioPlayer = document.createElement('div');
  const audioPlayer = document.createElement('audio');
  audioPlayer.classList.add('audio-player');
  audioPlayer.controls = true;
  audioPlayer.src = urlAudio;
  divAudioPlayer.append(audioPlayer);
  
  playerContent.appendChild(divAudioPlayer);
  contentWrapper.appendChild(divImg);
  contentWrapper.appendChild(playerContent);

  const divDescription = document.createElement('div');
  divDescription.append(description);
  divDescription.classList.add('content__description');

  birdContentContainer.appendChild(contentWrapper);
  birdContentContainer.appendChild(divDescription);
}

getAnknownTrack();

const showRightAnswer = () => {
  if(rightAnswer) {
    const birdImage = document.querySelector('.player__bird-pic');
    const nameBird = document.querySelector('.stars');
    birdImage.src = imgSrc;
    birdImage.alt = birdName;
    nameBird.textContent = birdName;
  }
}

const defaultBird = () => {
    const birdImage = document.querySelector('.player__bird-pic');
    const nameBird = document.querySelector('.stars');
    birdImage.src = './assets/img/unknown-bird.jpg';
    birdImage.alt = 'Unknown';
    nameBird.textContent = '******';
  }

const changeColorAnswer = (id, bull) => {
  const colorDot = document.querySelectorAll('.li-btn');
  if(bull) {
    colorDot[id].style.backgroundColor = '#00ff00';
  } else {
    colorDot[id].style.backgroundColor = '#ff0000';
  }
}

function audioClick(bull) {
  const audio = new Audio();
  if(bull) {
    audio.src = './assets/mp3/correct.mp3';
    audio.autoplay = true;
  } else {
    audio.src = './assets/mp3/wrong.mp3';
    audio.autoplay = true;
  }
}