const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

const cardDescriptionElement = document.querySelector('.card-desc');
const cardInputElement = document.querySelector('#card-input');
const errorTextElement = document.querySelector('.error-text');
const searchButtonElement = document.querySelector('.search-button');
const cardImageElement = document.querySelector('.card-img');

searchButtonElement.addEventListener('click', handleSearch);
cardInputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') handleSearch();
});


async function handleSearch() {
    displayError('');

    try {
        if (isInputEmpty(cardInputElement)) {
            throw new Error('Campo vazio.');
        }

        if (localStorage.getItem(cardInputElement.value)) {
            displayCardInfo(cardInputElement.value);
        } else {
            const { name, desc, card_images } = await fetchCardInfo(`${API_URL}?name=${cardInputElement.value}&language=pt`);
            cacheData(name, card_images[0].image_url_cropped, desc);
            displayCardInfo(name);
        }

    } catch (error) {
        console.error(error);
        displayError(error.message);
    }

}

async function fetchCardInfo(cardURL) {
    const response = await fetch(cardURL);

    if (!response.ok) {
        throw new Error('Carta não encontrada.');
    }

    const cardData = await response.json();

    return cardData.data[0];
}

function isInputEmpty(input) {
    return input.value.trim() === '';
}

function displayError(message) {
    errorTextElement.innerText = message;
}

function displayCardInfo(name) {
    const info = JSON.parse(localStorage.getItem((name)));
    cardImageElement.src = info.imageUrl;
    cardImageElement.alt = name;
    cardImageElement.title = name;
    cardDescriptionElement.innerText = info.desc;
}

function cacheData(name, imageUrl, desc) {
    if (!localStorage.getItem(name)) {
        localStorage.setItem(name, JSON.stringify({ imageUrl, desc }));
    }
}