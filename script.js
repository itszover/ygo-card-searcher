const span = document.querySelector('span');
const input = document.querySelector('#card_input');
const button = document.querySelector('button');

button.addEventListener('click', () => checkInput(input.value));

async function fetchCard() {
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${input.value}`);

        if (!response.ok) {
            throw new Error('Carta não encontrada');
        }

        const data = await response.json();
        const cardName = data.data[0].name;
        span.innerText = cardName;
    } catch (error) {
        console.error(`Erro: ${error}`);
    }
}

function checkInput(inputValue) {
    console.log("input v:" + inputValue);
    if (!input.value.trim()) {
        alert('teste')
    }
}
