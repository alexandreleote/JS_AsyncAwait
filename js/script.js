// fonction  qui fait le fetch(), qui contacte l'API
async function callAPI(uri) {

    console.log("-- callAPI - start --");
    console.log("uri = ",uri);

    // fetch(), appel à l'API et réception de la réponse
    const response = await fetch(uri);
    console.log("response = ", response);

    //  récupération des données JSON reçues de l'API
    const data = await response.json();
    console.log("data = ",data);
    
    console.log("-- callAPI - end --");

    // renvoi des données
    return data;
}

// constante globale : l'URI du endpoint de demande de nouveau deck
const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/";

// fonction de demande de nouveau deck
async function getNewDeck() {
    console.log(">> getNewDeck");

    return await callAPI(API_ENDPOINT_NEW_DECK);
}

// variable globale : l'id du deck utilisé, dans lequel on pioche
let idDeck = null;

//  fonctions (syntaxe de fonction fléchée) qui renvoient des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointShuffleDeck = () => `https://deckofcardsapi.com/api/deck/${idDeck}/shuffle/`;

//  fonction de demande de mélange du deck
async function shuffleDeck() {
    console.log(">> shuffleDeck");

    return await callAPI(getApiEndpointShuffleDeck());
}

// fonctions (syntaxe de fonction fléchée) qui renvoient des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointDrawCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`;

//  fonction de demande de pioche dans le deck
async function drawCard() {
    console.log(">> drawCard");

    return await callAPI(getApiEndpointDrawCard());
}

// supprime les cartes de l'ancien deck du DOM
const cleanDomCardsFromPreviousDeck = () => 
    //  récupération des cartes (classe CSS "card")
    document.querySelectorAll(".card")
    //  et pour chacune de ces cartes
    .forEach((card) => 
        //  suppression du DOM
        card.remove()
    )
;

//  fonction de réinitialisation (demande de nouveau deck + demande de mélange de ce nouveau deck)
async function actionReset() {
    // vider dans le DOM les cartes de l'ancien deck
    cleanDomCardsFromPreviousDeck();

    // récupération d'un nouveau deck
    const newDeckResponse = await getNewDeck();

    // récupération de l'id de ce nouveaudeck dans les données reçues et mise à jour de la varibale globale
    idDeck = newDeckResponse.deck_id;

    // mélange du deck
    await shuffleDeck();
}

// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const cardsContainer = document.getElementById("cards-container");

// ajoute une carte dans le DOM (dans la zone des cartes piochées) d'après l'URI de son image
function addCardToDomByImgUri(imgUri) {
    // création de l'élément HTML "img", de classe CSS "card" et avec pour attribut HTML "src" l'URI en argument
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    // ajout de cette image dans la zone des cartes priochées (en dernière position, dernier enfant de cardsContainer)
    cardsContainer.appendChild(imgCardHtmlElement);
}

// fonciton qui demande à piocher une catre, puis qui fait l'appel pour l'intégrer dans le DOM
async function actionDraw() {
    // appel à l'API pour demander au croupier de piocher une cate et de nous la renvoyer
    const drawCardResponse = await drawCard();

    console.log("drawCardResponse = ", drawCardResponse);

    // récupération de l'URI de l'image de cette carte dans les données reçues
    const imgCardUri = drawCardResponse.cards[0].image;

    // ajout de la carte piochée dans la zone des cartes piochées
    addCardToDomByImgUri(imgCardUri);
}

// appel d'initialisation au lancement de l'application
actionReset();

// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const actionResetButton = document.getElementById("action-reset");
const actionDrawButton = document.getElementById("action-draw");

// écoutes d'évènements sur les boutons d'action
actionResetButton.addEventListener("click", actionReset);
actionDrawButton.addEventListener("click", actionDraw);