const cardDescriptionElement = document.querySelector('.card-desc');
const cardInputElement = document.querySelector('#card-input');
const errorTextElement = document.querySelector('.error-text');
const searchButtonElement = document.querySelector('.search-button');
const cardImageElement = document.querySelector('.card-img');

searchButtonElement.addEventListener('click', async () => {
    if (isInputEmpty(cardInputElement)) {
        displayError('Campo vazio.');
    } else {
        displayError('');
        const { name, desc, card_images } = await fetchCardInfo(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${cardInputElement.value}`);
        cacheImage(name, card_images[0].image_url_cropped);
        displayCardInfo(name, desc);
    }
});

async function fetchCardInfo(cardURL) {
    try {
        const response = await fetch(cardURL);

        if (!response.ok) {
            displayError('Carta não encontrada.');
            throw new Error('Carta não encontrada');
        }

        const cardData = await response.json();

        return cardData.data[0];

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
