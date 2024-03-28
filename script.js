const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

const cardDescriptionElement = document.querySelector('.card-desc');
const cardInputElement = document.querySelector('#card-input');
const errorTextElement = document.querySelector('.error-text');
const searchButtonElement = document.querySelector('.search-button');
const cardImageElement = document.querySelector('.card-img');
const cardNameElement = document.querySelector('.card-name');
const select = document.querySelector('select');

searchButtonElement.addEventListener('click', handleSearch);
cardInputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') handleSearch();
});
select.addEventListener('keydown', event => {
    if (event.key === 'Enter') handleSearch();
})
select.addEventListener('change', () => {
    cardInputElement.value = select.options[select.selectedIndex].text;
})

select.addEventListener('click', () => {
    cardInputElement.value = select.options[select.selectedIndex].text;
})

async function fn() {
    select.innerHTML = "";
    select.style.visibility = "hidden";

    if (isInputEmpty(cardInputElement)) {
        return;
    }

    const response = await fetch(`${API_URL}?fname=${cardInputElement.value.trim()}&language=pt`);

    if (!response.ok) {
        throw new Error("Carta não encontrada.");
    }
    
    const cards = await response.json();
    
    for (const card of cards.data) {
        const opt = document.createElement('option');
        opt.innerText = card.name;        
        select.appendChild(opt);
    }

    select.size = Math.min(cards.data.length, 7);
    select.style.visibility = select.size === 1 ? "hidden" : "visible";
    select.size = select.size === 1 ? 2 : select.size; 
}

async function handleSearch() {
    displayError('');

    try {
        if (isInputEmpty(cardInputElement)) {
            select.style.visibility = "hidden";
            throw new Error('Campo vazio.');
        }
        
        await fn();

        const inputValue = cardInputElement.value.trim();
        
        if (localStorage.getItem(inputValue)) {
            displayCardInfo(inputValue);
        } else {
            const { name, desc, card_images } = await fetchCardInfo(inputValue);
            cacheData(name, card_images[0].image_url_cropped, desc);
            displayCardInfo(name);
        }

    } catch (error) {
        console.error(error);
        displayError(error.message);
    }

}

async function fetchCardInfo(cardName) {
    const response = await fetch(`${API_URL}?name=${cardName}&language=pt`);

    if (!response.ok) {
        select.style.visibility = "visible";
        throw new Error('Tente por:');
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
    cardNameElement.innerText = name;
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