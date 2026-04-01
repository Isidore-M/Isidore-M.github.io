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
    'assets/images/a-lion.png', 'assets/images/a-cheeta.png', 'assets/images/a-fox.png',
    'assets/images/a-girafe.png', 'assets/images/a-toucan.png', 'assets/images/a-porcupine.png'
  ];

  let farmAnimals = [
    'assets/images/a-cow.png', 'assets/images/a-pig.png', 'assets/images/a-sheep.png',
    'assets/images/a-duck.png', 'assets/images/a-rooster.png', 'assets/images/a-goat.png'
  ];

  let selectedJungle = getRandomItems([...jungleAnimals], 3);
  let selectedFarm = getRandomItems([...farmAnimals], 3);
  let newAnimals = [...selectedJungle, ...selectedFarm];
  newAnimals.sort(() => 0.5 - Math.random());

  const imagesContainer = document.querySelector(".images");
  imagesContainer.innerHTML = '';

  newAnimals.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('draggable');
    img.setAttribute('draggable', 'true');
    img.dataset.zone = selectedJungle.includes(src) ? 'wild' : 'farm';

    // --- MOBILE TOUCH EVENTS ---
    img.addEventListener("touchstart", (e) => {
      img.classList.add("dragging");
    }, { passive: true });

    img.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      img.style.position = "fixed";
      img.style.zIndex = "10000";
      img.style.left = `${touch.clientX - 60}px`; 
      img.style.top = `${touch.clientY - 60}px`;
      img.style.pointerEvents = "none"; 
      e.preventDefault(); 
    }, { passive: false });

    img.addEventListener("touchend", (e) => {
      img.classList.remove("dragging");
      const touch = e.changedTouches[0];

      img.style.visibility = "hidden"; 
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      img.style.visibility = "visible";

      const zone = target ? target.closest('.drop-zone') : null;
      checkDrop(img, zone);
    });

    // --- DESKTOP DRAG EVENTS ---
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", img.dataset.zone);
      e.dataTransfer.setData("id", img.src);
      img.classList.add("dragging");
    });

    img.addEventListener("dragend", () => img.classList.remove("dragging"));

    imagesContainer.appendChild(img);
  });

  let zones = document.querySelectorAll(".drop-zone");
  let gameContainer = document.querySelector(".zones");
  let count = 0;

  // --- LOGIC HANDLER (Now hides instructions too) ---
  function checkDrop(img, zone) {
    if (zone && img.dataset.zone === zone.dataset.zone) {
      
      // NEW: Hide the instruction text in this zone
      const instruction = zone.querySelector('.zone-instruction');
      if (instruction) instruction.style.display = 'none';

      zone.appendChild(img);
      img.style.position = "static";
      img.style.pointerEvents = "auto";
      img.setAttribute('draggable', 'false');
      
      count++;
      if(clickSound) clickSound.play();
      
      zone.style.borderColor = "#7ed321";
      setTimeout(() => zone.style.borderColor = "", 1000);

      if (count % 2 === 0) addStars();
      
      if (count === 6) {
        setTimeout(() => {
          gameContainer.innerHTML = '';
          gameOver();
        }, 500);
      }
    } else {
      if (zone) {
        zone.classList.add("shake-error");
        setTimeout(() => zone.classList.remove("shake-error"), 500);
      }
      // Return to dock
      img.style.position = "static";
      img.style.pointerEvents = "auto";
      imagesContainer.appendChild(img);
    }
  }

  // --- DESKTOP ZONE LISTENERS ---
  zones.forEach(zone => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      let expectedZone = e.dataTransfer.getData("text/plain");
      let imgSrc = e.dataTransfer.getData("id");
      let img = Array.from(document.querySelectorAll('.draggable')).find(i => i.src === imgSrc);
      
      if (img) {
        checkDrop(img, zone);
      }
    });
  });
}

// ============ ADD STARS ============
function addStars() {
  let starsContainer = document.querySelector('#score');
  if (!starsContainer) return;

  // Make sure the container is visible
  starsContainer.style.visibility = 'visible';
  starsContainer.style.display = 'flex'; 

  let star = document.createElement('img');
  star.setAttribute('src', 'assets/images/UI_elements/star.png');
  star.setAttribute('class', 'star'); // This matches our new CSS
  
  starsContainer.appendChild(star);
  console.log('Star added');
  starsContainer.appendChild(star);
} // addStars()




// ============ POP THE BUBBLE GAME ============
 function popTheBubble() {
  const scoreContainer = document.querySelector('#score');
  if (scoreContainer) {
    scoreContainer.style.visibility = 'visible';
    scoreContainer.style.display = 'flex'; // Ensures stars align in a row
  }

  let bubbleArea = document.querySelector('#bubbleArea');
  let letterDisplay = document.querySelector('#letterToFind');
  if (!bubbleArea) return;

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const targetLetters = getRandomItems([...alphabet], 3);
  
  let roundIndex = 0;
  let poppedCount = 0;
  let bubbleInterval;

  const popSound = new Audio('assets/audio/click.mp3'); 

  function setInstruction(letter) {
    letterDisplay.textContent = `Pop 5 bubbles: ${letter}`;
// "Pop" effect for the text so it grabs attention
    letterDisplay.style.transform = "scale(1.2)";
    letterDisplay.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    
    setTimeout(() => {
        letterDisplay.style.transform = "scale(1)";
    }, 300);

  }

  function createBubble(letter) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = letter;
    
    const startX = Math.random() * 80; 
    bubble.style.left = `${startX}%`;
    bubble.style.bottom = "-100px";

    // --- SHARED POP LOGIC ---
    const handlePop = (e) => {
      // Prevent the "Ghost Click" (prevents the function from running twice)
      if (e) e.preventDefault(); 

      if (letter === targetLetters[roundIndex]) {
        popSound.currentTime = 0;
        popSound.play().catch(() => {});
        
        bubble.classList.add('popped'); 
        
        setTimeout(() => {
          bubble.remove();
          poppedCount++;
          if (poppedCount === 5) nextRound();
        }, 150);
      } else {
        bubble.classList.add('shake-error');
        setTimeout(() => bubble.classList.remove('shake-error'), 500);
      }
    };

    // --- MOBILE TOUCH ---
    // 'touchstart' is instant, unlike 'click' which waits 300ms
    bubble.addEventListener('touchstart', handlePop, { passive: false });

    // --- DESKTOP CLICK ---
    bubble.addEventListener('mousedown', handlePop);

    bubbleArea.appendChild(bubble);

    // Smooth floating animation
    requestAnimationFrame(() => {
      const duration = 8000 + Math.random() * 4000; 
      bubble.style.transition = `bottom ${duration}ms linear`;
      bubble.style.bottom = "110%";
    });

    setTimeout(() => {
      if (bubble.parentElement) bubble.remove();
    }, 13000); 
  }
/* Check here */
  function nextRound() {
    clearInterval(bubbleInterval);
    addStars(); // This calls your existing addStars function
    roundIndex++;
    poppedCount = 0;

    // 3. Clear ALL remaining bubbles from the screen so they don't distract
    const remainingBubbles = document.querySelectorAll('.bubble');
    remainingBubbles.forEach(b => {
        b.style.opacity = '0';
        b.style.transition = 'opacity 0.5s ease';
        setTimeout(() => b.remove(), 500);
    });

    if (roundIndex < targetLetters.length) {
      document.querySelectorAll('.bubble').forEach(b => b.remove());
      setTimeout(startRound, 900);
    } else {
      setTimeout(() => {
        bubbleArea.style.display = 'none';
        gameOver();
      }, 1500);
    }
  }

  function startRound() {
    setInstruction(targetLetters[roundIndex]);
    bubbleInterval = setInterval(() => {
      const isTarget = Math.random() < 0.6;
      const letter = isTarget ? targetLetters[roundIndex] : alphabet[Math.floor(Math.random() * alphabet.length)];
      createBubble(letter);
    }, 600); // Slower spawn rate
  }

  startRound();
}

// popTheBubble()



// ============ GAME OVER ============

function gameOver() {
  // 1. Play Victory Sound
  let winSound = new Audio('assets/audio/win.mp3');
  winSound.play().catch(err => console.warn('Play failed:', err));

  // 2. Data Pools
  let winImages = [
    'assets/images/well-done.png',
    'assets/images/well-done-1.png',
    'assets/images/well-done-2.png'
  ];
  let winTexts = [
    'Well done! You have completed the game.',
    'Congratulations! You are a star player.',
    'Fantastic! You did an amazing job.'
  ];

  // 3. Hide UI Elements (Clean up the screen)
  const topMusic = document.querySelector('#topMusic');
  const topContact = document.querySelector('#topContact');
  const scoreBoard = document.querySelector('#score');
  
  if (topMusic) topMusic.style.display = 'none';
  if (topContact) topContact.style.display = 'none';
  if (scoreBoard) scoreBoard.style.display = 'none';

  // 4. Setup Lightbox
  let winLightBox = document.querySelector('#winLightBox');
  if (!winLightBox) return;

  // Use Flex display so our CSS centering kicks in
  winLightBox.style.display = 'flex';
  winLightBox.style.visibility = 'visible';
  
  // Clear any previous content to avoid stacking cards if gameOver is called twice
  winLightBox.innerHTML = '';

  // 5. Random Selection
  let randomImg = winImages[Math.floor(Math.random() * winImages.length)];
  let randomText = winTexts[Math.floor(Math.random() * winTexts.length)];

  // 6. Inject the "Win Card" Structure
  // This matches the .win-card CSS we wrote earlier
  winLightBox.innerHTML = `
    <div class="win-card">
        <div id="restartGame" onclick="location.reload()" title="Play Again"></div>
        
        <img src="${randomImg}" id="winImg" alt="Victory">
        
        <div id="winText">${randomText}</div>
        
        <div class="win-buttons">
            <button class="home-btn" onclick="window.location.href='index.html'">
                Back to Menu
            </button>
        </div>
    </div>
  `;
}



// gameOver()

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