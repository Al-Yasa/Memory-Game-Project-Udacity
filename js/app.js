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

/**** logic Start ****/
shuffleDeck();