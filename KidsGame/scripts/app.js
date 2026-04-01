window.addEventListener("orientationchange", function() {
    // Force a quick layout refresh when the phone rotates
    window.location.reload();
});
function initNameDisplay() {
  let userName = localStorage.getItem("playerName");

  // Show welcome message if #name_text exists
  let nameText = document.querySelector("#name_text");
  if (userName && nameText) {
    nameText.textContent = 'Hey ' + userName + '!';
  }

  // Show or hide the opening overlay if #opening exists
  let opening = document.querySelector("#opening");
  if (opening) {
    if (userName) {
      opening.style.display = "none";
    } else {
      opening.style.display = "block";
    }
  }
} // initNameDisplay()

document.addEventListener("DOMContentLoaded", () => {
  let clickSound = new Audio('assets/audio/click.mp3');
  document.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });

  let audio = document.querySelector('#backgroundAudio');

  let path = window.location.pathname;
  initNameDisplay();
   // Play background audio only on index.html
   if (path.endsWith("index.html") || path === "/" || path === "/index") {
    audio.play().catch(err => console.warn('Play failed:', err));
  }
  // Initialize name display
  

  if (path.includes("cardFlip.html")) {    
    cardFlip();
  } else if (path.includes("Drag_and_Drop.html")) {
    dragAndDrop(clickSound);
  } else if (path.includes("popTheBubble.html")) {
    popTheBubble();
  }
}); // DOMContentLoaded

//============= Username ==============
function takeName(){
  let leafSound = new Audio('assets/audio/leaves.mp3');
  leafSound.volume = 1.0;
  leafSound.play().catch(err => console.warn('Play failed:', err));

  let audio = document.querySelector('#backgroundAudio');
  let name_input = document.querySelector('#nameInput');
  let welcome = document.querySelector('#welcome_div');
  let nameDisplay = document.querySelector('#name_text');
  let leaves = document.querySelector('#leaves');

  if (name_input.value.trim() === '') {
    alert('Please enter a name');
    return;
  }
  localStorage.setItem("playerName", name_input.value.trim());

  welcome.style.visibility = 'hidden';
  nameDisplay.innerText = 'Hey  ' + name_input.value.trim() + '!';

  let leaf_left = document.querySelector('#leaves1');
  let leaf_right = document.querySelector('#leaves2');
  leaf_left.style.marginLeft = "-860px";
  leaf_right.style.marginRight = "-860px";

  setTimeout(function() {
    leaves.style.zIndex = "-1";
  }, 2000);

  audio.volume = 0.5;
  audio.play().catch(err => console.warn('Play failed:', err));
} // takeName()

// ============ CARD FLIP GAME ============
function cardFlip() {
  score.setAttribute('style', 'visibility: visible;');
  class Card {
    constructor(imgSrc) {
      this.imgSrc = imgSrc;
    }
    getImgSrc() {
      return this.imgSrc;
    }
  }

  let allImages = [
    'assets/images/apple.png',
    'assets/images/banana.png',
    'assets/images/strawberry.png',
    'assets/images/kiwi.png',
    'assets/images/pineapple.png',
    'assets/images/orange.png',
    'assets/images/lemon.png',
    'assets/images/grapes.png',
    'assets/images/waterMelon.png',
  ];

  let newImages = getRandomItems([...allImages], 3);
  let imagesForCards = [...newImages, ...newImages];
  let flipGame = document.querySelector('#flipGame');
  let flippedCards = [];

  imagesForCards.sort(() => 0.5 - Math.random());

  for (let i = 0; i < 6; i++) {
    let imgSrc = imagesForCards[i];
    let card = new Card(imgSrc);
    let cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'card');
    cardDiv.cardData = card;
    cardDiv.addEventListener('click', () => flipped(cardDiv));
    flipGame.appendChild(cardDiv);
  } // for
  let matchedPairs = 0;

  function flipped(card) {
    if (card.classList.contains('flipped') || flippedCards.length >= 2) return;
  
    let imgSrc = card.cardData.getImgSrc();
    card.style.backgroundImage = `url(${imgSrc})`;
    card.style.backgroundSize = 'cover';
    card.classList.add('flipped');
    flippedCards.push(card);
  
    if (flippedCards.length === 2) {
      let [card1, card2] = flippedCards;
      if (card1.cardData.getImgSrc() === card2.cardData.getImgSrc()) {
        card1.removeEventListener('click', flipped);
        card2.removeEventListener('click', flipped);
        flippedCards = [];
        matchedPairs++;        
        addStars();          
        if (matchedPairs === 3) {
          flipGame.innerHTML = '';
          gameOver();
        }
      } else {
        setTimeout(() => {
          card1.style.backgroundImage = '';
          card2.style.backgroundImage = '';
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
        }, 1000);
      }
    }
  }
} // cardFlip()

// ============ GET RANDOM ITEMS ============
function getRandomItems(array, count) {
  let newArray = [];
  for (let i = 0; i < count; i++) {
    let randomIndex = Math.floor(Math.random() * array.length);
    newArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return newArray;
} // getRandomItems()

// ============ DRAG AND DROP GAME ============
function dragAndDrop(clickSound) {
  score.setAttribute('style', 'visibility: visible;');
  let jungleAnimals = [
    'assets/images/a-lion.png',
    'assets/images/a-cheeta.png',
    'assets/images/a-fox.png',
    'assets/images/a-girafe.png',
    'assets/images/a-toucan.png',
    'assets/images/a-porcupine.png'
  ];

  let farmAnimals = [
    'assets/images/a-cow.png',
    'assets/images/a-pig.png',
    'assets/images/a-sheep.png',
    'assets/images/a-duck.png',
    'assets/images/a-rooster.png',
    'assets/images/a-goat.png'
  ];

  // Select 3 from each
  let selectedJungle = getRandomItems([...jungleAnimals], 3);
  let selectedFarm = getRandomItems([...farmAnimals], 3);
  let newAnimals = [...selectedJungle, ...selectedFarm];

  // Shuffle the combined animals
  newAnimals.sort(() => 0.5 - Math.random());

  // Reference to the image container
  const imagesContainer = document.querySelector(".images");

  // Add draggable images dynamically
  newAnimals.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('draggable');
    img.setAttribute('draggable', 'true');

    // Set data-zone based on the source path
    if (selectedJungle.includes(src)) {
      img.setAttribute('data-zone', 'wild');
    } else {
      img.setAttribute('data-zone', 'farm');
    }

    imagesContainer.appendChild(img);
  });

  // Select updated draggables
  let draggables = document.querySelectorAll(".draggable");
  let zones = document.querySelectorAll(".drop-zone");
  let gameContainer = document.querySelector(".zones");
  let count = 0;

  draggables.forEach(img => {
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", img.dataset.zone);
      e.dataTransfer.setData("id", img.src);
      img.classList.add("dragging");
    });

    img.addEventListener("dragend", () => {
      img.classList.remove("dragging");
    });
  });

  zones.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      let expectedZone = e.dataTransfer.getData("text/plain");
      let imgSrc = e.dataTransfer.getData("id");
      let correctZone = zone.dataset.zone;
      let img = Array.from(draggables).find(i => i.src === imgSrc);

      if (expectedZone === correctZone) {
        zone.appendChild(img);
        count++;
        clickSound.play();

        if (count % 2 === 0) addStars();
        if (count === 6) {
          gameContainer.innerHTML = '';
          gameOver();
        }
      } else {
        imagesContainer.appendChild(img);
      }
    });
  });
}

// ============ ADD STARS ============
function addStars() {
  let stars = document.querySelector('#score');
  let star = document.createElement('img');
  star.setAttribute('src', 'assets/images/UI_elements/star.png');
  star.setAttribute('class', 'star');
  stars.appendChild(star);
  console.log('Star added');
} // addStars()

// ============ POP THE BUBBLE GAME ============
function popTheBubble() {
  score.setAttribute('style', 'visibility: visible;');
  let bubbleArea = document.querySelector('#bubbleArea');
  let letterDisplay = document.querySelector('#letterToFind');

  let alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  let targetLetters = getRandomItems([...alphabet], 3);

  let index = 0;
  let poppedCount = 0;
  let bubbleInterval;

  function setInstruction(letter) {
    letterDisplay.textContent = `Find 5 bubbles with the letter: ${letter}`;
  } // setInstruction()

  function getRandomDecoyLetter(exclude) {
    let decoy;
    do {
      decoy = alphabet[Math.floor(Math.random() * alphabet.length)];
    } while (decoy === exclude);
    return decoy;
  } // getRandomDecoyLetter()

  function createBubble(letter) {
    let bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = letter;
    bubble.style.left = Math.random() * 80 + '%';

    bubble.addEventListener('click', () => {
      if (letter === targetLetters[index]) {
        bubble.remove();
        poppedCount++;

        if (poppedCount === 5) {
          clearInterval(bubbleInterval);
          index++;
          poppedCount = 0;

          addStars();

          if (index < targetLetters.length) {
            setTimeout(() => {
              clearBubbles();
              setInstruction(targetLetters[index]);
              startLetterRound();
            }, 1000);
          } else {
            bubbleArea.remove();
            gameOver();
          }
        }
      }
    });

    bubbleArea.appendChild(bubble);

    // Animate upward and remove after 4 seconds
    setTimeout(() => {
      bubble.style.bottom = '100%';
      setTimeout(() => bubble.remove(), 4000);
    }, 50);
  } // createBubble()

  function clearBubbles() {
    document.querySelectorAll('.bubble').forEach(b => b.remove());
  } // clearBubbles()

  function startLetterRound() {
    let currentLetter = targetLetters[index];
    setInstruction(currentLetter);

    bubbleInterval = setInterval(() => {
      let isTarget = Math.random() < 0.33;
      let letter = isTarget ? currentLetter : getRandomDecoyLetter(currentLetter);
      createBubble(letter);
    }, 600);
  } // startLetterRound()

  // Start the game
  startLetterRound();
} // popTheBubble()

// ============ GAME OVER ============
function gameOver() {

  let winSound = new Audio('assets/audio/win.mp3');
  winSound.play().catch(err => console.warn('Play failed:', err));
  let winImages = [
                    'assets/images/well-done.png',
                    'assets/images/well-done-1.png',
                    'assets/images/well-done-2.png'
                  ];
  let winText = [
                  'Well done! You have completed the game.',
                  'Congratulations! You are a star player.',
                  'Fantastic! You did an amazing job.'
                ];

  document.querySelector('#topMusic').style.display = 'none';
  document.querySelector('#topContact').style.display = 'none';
  document.querySelector('#score').style.display = 'none';

  let winLightBox = document.querySelector('#winLightBox');
  winLightBox.setAttribute('style', 'visibility: visible;');
  let winImg = getRandomItems([...winImages], 1)[0];

  let restartGame = document.createElement('div');
  restartGame.setAttribute('id', 'restartGame');
  restartGame.setAttribute('onclick', 'location.reload()');
  restartGame.setAttribute('style', 'z-index: 7;');
  winLightBox.appendChild(restartGame);

  let winImage = document.createElement('img');
  winImage.setAttribute('src', winImg);
  winImage.setAttribute('id', 'winImg');
  winImage.setAttribute('style', 'z-index: 7;');
  winLightBox.appendChild(winImage);

  let winTextDiv = document.createElement('div');
  winTextDiv.setAttribute('id', 'winText');
  winTextDiv.setAttribute('style', 'z-index: 7;');
  winTextDiv.textContent = getRandomItems([...winText], 1)[0];
  winLightBox.appendChild(winTextDiv);
} // gameOver()

// ============ OPEN CONTACT LIGHTBOX ============
function openContact() {
  let contactLightBox = document.querySelector('#contactLightBox');
  let close = document.querySelector('#close');
  contactLightBox.setAttribute('style', 'visibility: visible;');
  close.addEventListener('click', 'closeContact();');
} // openContact()

// ============ CLOSE CONTACT LIGHTBOX ============
function closeContact() {
  let contactLightBox = document.querySelector('#contactLightBox');
  contactLightBox.setAttribute('style', 'visibility: hidden;');
} // closeContact()

// ============ TOGGLE MUSIC ============
function toggleMusic() {
  let audio = document.querySelector('#backgroundAudio');
  let topMusic = document.querySelector('#topMusic');
  if (topMusic.classList.contains('music-on')) {
    audio.pause();
    topMusic.classList.remove('music-on');
    topMusic.classList.add('music-off');
  } else {
    audio.play().catch(err => console.warn('Play failed:', err));
    topMusic.classList.remove('music-off');
    topMusic.classList.add('music-on');
  }
} // toggleMusic()