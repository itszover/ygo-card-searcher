const cardDescriptionElement = document.querySelector('.card-desc');
const cardInputElement = document.querySelector('#card-input');
const errorTextElement = document.querySelector('.error-text');
const searchButtonElement = document.querySelector('.search-button');
const cardImageElement = document.querySelector('.card-img');

searchButtonElement.addEventListener('click', () => {
    if (isInputEmpty(cardInputElement)) {
        displayError('Campo vazio.');
    } else {
        displayError('');
        fetchCardInfo(cardInputElement.value);
    }
});

async function fetchCardInfo(cardName) {
    try {
        const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${cardName}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            displayError('Carta não encontrada.');
            throw new Error('Carta não encontrada');
        }

        const cardData = await response.json();
        const { name, desc, card_images } = cardData.data[0];

        cacheImage(name, card_images[0].image_url_cropped);

        displayCardInfo(name, desc);

    } catch (error) {
        console.error(`Erro: ${error}`);
    }
}

function isInputEmpty(inputElement) {
    return inputElement.value.trim() === '';
}

function displayError(message) {
    errorTextElement.innerText = message;
}

function displayCardInfo(name, description) {
    cardImageElement.src = localStorage.getItem(name);
    cardImageElement.alt = name;
    cardImageElement.title = name;
    cardDescriptionElement.innerText = description;
}

function cacheImage(name, imageUrl) {
    if (!localStorage.getItem(name)) {
        localStorage.setItem(name, imageUrl);
    }
}
