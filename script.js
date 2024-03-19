const span = document.querySelector('span');
const input = document.querySelector('#card_input');
const small = document.querySelector('small');
const button = document.querySelector('button');

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
        const cardName = data.data[0].name;
        writeInnerText(span, cardName);
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