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

/**** Functions ****/
// Deck Functions
function shuffleDeck() {

    shuffledCards = shuffleCards(CARDS);

    shuffledCards.forEach(shuffledCard => {
        DECK.insertAdjacentHTML('beforeend', `
            <li class="card" data-name="${shuffledCard}">
                <i class="fa fa-${shuffledCard}">
            </li>`);
    });

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
    }
}

// Moves Functions
function addMove() { // increase moves and update on the DOM
    movesCount++;
    MOVES.innerHTML = movesCount === 1 ? `${movesCount} Move` : `${movesCount} Moves`;
}

/**** logic Start ****/
shuffleDeck();

DECK.addEventListener('click', e => {
    selectCard(e.target);
});