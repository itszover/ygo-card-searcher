const span = document.querySelector('span');
const input = document.querySelector('#card_input');
const small = document.querySelector('small');
const button = document.querySelector('button');
const img = document.querySelector('img');

button.addEventListener('click', () => {
    if (isInputEmpty(input)) {
        writeInnerText(small, 'Campo vazio.');
    } else {
        writeInnerText(small, '');
        fetchCard(input);
    }
});

async function fetchCard(input) {
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${input.value}`);

        if (!response.ok) {
            writeInnerText(small, 'Carta não encontrada.');
            throw new Error('Carta não encontrada');
        }

        const data = await response.json();
        const cardID = data.data[0].id;
        const cardName = data.data[0].name;
        const cardDescription = data.data[0].desc;
        const cardImageURL = `https://images.ygoprodeck.com/images/cards/${cardID}.jpg`;

        if (!localStorage.getItem(cardName)) {
            localStorage.setItem(cardName, cardImageURL);
        }

        img.src = localStorage.getItem(cardName);
        writeInnerText(span, cardDescription);

    } catch (error) {
        console.error(`Erro: ${error}`);
    }
}

function isInputEmpty(input) {
    if (input.value.trim() === '') {
        return true
    }

    return false;  
}

function writeInnerText(element, message) {
    element.innerText = message;
}

function isImageStored(cardName, imageUrl) {
    if (localStorage.getItem(cardName, imageUrl)) {
        return true;
    }

    return false;
}