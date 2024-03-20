const span = document.querySelector('.card-desc');
const input = document.querySelector('#card-input');
const small = document.querySelector('.error-text');
const button = document.querySelector('.search-button');
const img = document.querySelector('.card-img');

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
        const { name, desc, card_images } = data.data[0];
        
        if (!localStorage.getItem(name)) {
            localStorage.setItem(name, card_images[0].image_url_cropped);
        }

        img.src = localStorage.getItem(name);
        img.alt = `${name}`;
        img.title = `${name}`;
        writeInnerText(span, desc);

    } catch (error) {
        console.error(`Erro: ${error}`);
    }
}

function isInputEmpty(input) {
    return input.value.trim() === '';
}

function writeInnerText(element, message) {
    element.innerText = message;
}
