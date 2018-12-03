/**** Variables ****/
// Deck Variables
const DECK = document.getElementById('deck');

// Cards Variables
const CARDS = [
    'flag-o',
    'flag-o',
    'futbol-o',
    'futbol-o',
    'thumbs-o-up',
    'thumbs-o-up',
    'trash-o',
    'trash-o',
    'key',
    'key',
    'rocket',
    'rocket',
    'magnet',
    'magnet',
    'gavel',
    'gavel'
];
let shuffledCards = []
let flippedCards = [];
let pairsMatched = 0;

// Stars Variables
const THIRD_STAR = document.getElementById('third-star');
const SECOND_STAR = document.getElementById('second-star');
let starsCount = 3;

// Moves Variables
const MOVES = document.querySelector('.moves');
let movesCount = 0;

// Timer Variables
const TIMER = document.querySelector('.timer');
let timerOn = false;
let time = 0;
let timerId;

// Hint Variables
const HINT = document.querySelector('.hint');
const HINT_NOTIFICATION = document.querySelector('.hint div');
let hintedCard = '';
let hintCount = 0;

// Restart Variables
const RESTART = document.querySelector('.restart');

/**** Functions ****/
// Deck Functions
function shuffleDeck() {

    DECK.innerHTML = '';

    shuffledCards = shuffleCards(CARDS);

    shuffledCards.forEach(shuffledCard => {
        DECK.insertAdjacentHTML('beforeend', `
            <li class="card" data-name="${shuffledCard}">
                <i class="fa fa-${shuffledCard}">
            </li>`);
    });

    setTimeout(() => { // wait for 1/2 second then show cards
        for (card of DECK.children) {
            flipCard(card);
        }
    }, 500);
    setTimeout(() => { // hide cards after showing them for 2 seconds
        for (card of DECK.children) {
            flipCard(card);
        }
        startTimer();
    }, 2500);

}

// Card Functions
function shuffleCards(array) { // Shuffle function from http://stackoverflow.com/a/2450976
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function flipCard(card){ // make card white and rotate it (simulate flip)
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function matchCard(card) { // make card blue
    card.classList.toggle('match');
}

function noMatchCard(card) { // make card red
    card.classList.toggle('no-match');
}

function addFlippedCard(card) { // add card to flipped cards list
    flippedCards.push(card);
}

function selectCard(card) {
    if (card.classList.value === 'card' && flippedCards.length < 2) { // checks if the card is not selected nor is it matched and how many cards are selected
        flipCard(card); // flip selected card

        addFlippedCard(card); // adds flipped card to the list of already flipped cards

        if (flippedCards.length === 2) { // when 2 cards are flipped
            addMove(); // increase moves counter
            checkMatch(); // check for a match between the two selected cards
            removeStars('moves'); // check to see if removing a star is due
        }
    }
}

function checkMatch() { // compare the two selected cards
    if (flippedCards[0].dataset.name === flippedCards[1].dataset.name) { // if match then keep cards flipped and increase pairsMatched count
        setTimeout(() => { // wait for 200ms then make selected cards blue
            matchCard(flippedCards[0]);
            matchCard(flippedCards[1]);
            flippedCards = [];
            pairsMatched++;
            if (pairsMatched === 8) { // if all cards are matched then it is game over
                gameWon();
            }
        }, 300)
    } else { // if no match then notify the player of the mismatch and flip the cards back
        setTimeout(() => { // wait for 200ms then make selected cards red
            noMatchCard(flippedCards[0]);
            noMatchCard(flippedCards[1]);
        }, 300);
        setTimeout(() => { // wait for 1 second then remove red color from cards and flip them back
            flipCard(flippedCards[0]);
            flipCard(flippedCards[1]);
            noMatchCard(flippedCards[0]);
            noMatchCard(flippedCards[1]);
            flippedCards = [];
        }, 1000);
    }
}

// Stars Functions
function removeStars(reason) {
    let thirdStarStatus = THIRD_STAR.firstElementChild.classList.value; // register classList of the thirdStar to a variable
    let secondStarStatus = SECOND_STAR.firstElementChild.classList.value; // register classList of the secondStar to a variable

    if (reason === 'moves') { // reduce stars based on the moves count
        /* minimum moves to win is 8, so:
            * tolerate 3 mismatches and punish the fourth mismatch
            * tolerate 9 mismatches and punish the tenth mismatch
        */
        if (movesCount === 12 && thirdStarStatus === 'fa fa-star') { // remove thirdStar if it's full and 12 moves have been made
            THIRD_STAR.innerHTML = `<i class="fa fa-star-o"></i>`;
            starsCount--;
        } else if (movesCount === 18 && thirdStarStatus === 'fa fa-star-o' && secondStarStatus === 'fa fa-star') { // remove SecondStar if it's full and if thirdStar is empty and if 18 moves have been made
            SECOND_STAR.innerHTML = `<i class="fa fa-star-o"></i>`;
            starsCount--;
        }

    } else if (reason === 'time') { // reduce stars based on the time count
        if (time === 30 && thirdStarStatus === 'fa fa-star') { // remove third star if time reaches 30 seconds and if it's full
            THIRD_STAR.innerHTML = `<i class="fa fa-star-o"></i>`;
            starsCount--;
        } else if (time === 60 && thirdStarStatus === 'fa fa-star-o' && secondStarStatus === 'fa fa-star') { // remove second star if time reaches 1 minute and if it's full and if thirdStar is empty
            SECOND_STAR.innerHTML = `<i class="fa fa-star-o"></i>`;
            starsCount--;
        }
    }

}

function resetStars() { // reset stars and update on The DOM
    starsCount = 3;
    THIRD_STAR.innerHTML = `<i class="fa fa-star"></i>`;
    SECOND_STAR.innerHTML = `<i class="fa fa-star"></i>`;
}

// Moves Functions
function addMove() { // increase moves and update on the DOM
    movesCount++;
    MOVES.innerHTML = movesCount === 1 ? `${movesCount} Move` : `${movesCount} Moves`;
}

function resetMoves() { // reset moves and update the DOM
    movesCount = 0;
    MOVES.innerHTML = '0 Moves';
}

// Timer Functions
function startTimer() {
    timerOn = true;
    timerId = setInterval(() => { // start timer using setInterval every 1 second
        time++;
        removeStars('time'); // check to see if removing a star is due
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        TIMER.innerHTML = seconds < 10 ? `0${minutes}:0${seconds}` : `0${minutes}:${seconds}`; // update time on the DOM
    }, 1000);
}

function stopTimer() { // stop timer
    clearInterval(timerId);
    timerOn = false;
}

function resetTimer() { // stop timer and then reset it
    stopTimer();
    time = 0;
    TIMER.innerHTML = '00:00';
}


// Hint Functions
function hintCard(card) { // shake the card to be hinted at
    card.classList.toggle('hint');
    setTimeout(()=> { // remove hint class from card after 1/2 second
        card.classList.toggle('hint');
    }, 500)
}

function oneCardHint() { // hint at the pair of a selected card
    hintedCard = flippedCards[0]; // set the selected card as the hintedCard
    for (card of DECK.children) { // loop through the existing cards on the deck
        if (card.classList.value === 'card' && hintedCard.dataset.name === card.dataset.name) { // if we reach a card that is not selected or matched and if that card is the same as the card we have selected
            hintCard(card); // hint at the card we reached
            hintCount++;
            hintedCard = '';
            return;
        }
    }
}

function twoCardsHint() { // hint at a pair of cards
    for (card of DECK.children) { // loop through the existing cards on the deck
        if (card.classList.value === 'card' && hintedCard.length === 0) { // if we reach a card that is not matched and if no cards are selected set that card as the hinted card
            hintedCard = card;
        } else if (card.classList.value === 'card' && hintedCard.dataset.name === card.dataset.name) { // if we reach a card that is not matched and if that card is the pair of the hinted card then hint at both cards
            hintCard(hintedCard);
            hintCard(card);
            hintCount++;
            hintedCard = '';
            return;
        }
    }
}

function hintsNotify() { // update remaining hints
    HINT_NOTIFICATION.innerHTML = 3 - hintCount;
    HINT_NOTIFICATION.classList.toggle('flash'); // flash notification
    setTimeout(() => {
        HINT_NOTIFICATION.classList.toggle('flash');
    }, 500);
}

function useHint() {
    if (flippedCards.length === 1 && hintCount < 3) { // if a card is selected and hints are left then hint at its pair
        oneCardHint();
        hintsNotify(); // update remaining hints
    } else if (flippedCards.length === 0 && hintCount < 3) { // if no cards are selected and there are hints left then hint at a pair of cards
        twoCardsHint();
        hintsNotify(); // update remaining hints
    }
}

function resetHintsNotify() { // resets number of hints to 3
    HINT_NOTIFICATION.innerHTML = 3;
}

// Game Over Functions
function gameWon() { // stop the timer ==> TODO: show modal
    stopTimer();
}

// Restart Game Functions
function restartGame() {
    resetStars();
    resetMoves();
    resetTimer();
    resetHintsNotify();
    hintCount = 0;
    pairsMatched = 0;
    flippedCards = [];
    shuffleDeck();
    setTimeout(() => { // wait for cards to show and hide then start timer
        startTimer();
    }, 2500);
}

function rotateRestart() { // rotate the icon of restart button
    RESTART.classList.toggle('rotate');
    setTimeout(() => {
        RESTART.classList.toggle('rotate');
    }, 500);
}

/**** logic Start ****/
shuffleDeck();

DECK.addEventListener('click', e => {
    selectCard(e.target);
});

RESTART.addEventListener('click', () => { // clicking the restart button restarts the game and spins the icon
    restartGame();
    rotateRestart();
});

HINT.addEventListener('click', () => {
    useHint();
});