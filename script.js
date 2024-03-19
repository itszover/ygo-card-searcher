const span = document.querySelector('span');
const input = document.querySelector('#card_input');
const button = document.querySelector('button');

button.addEventListener('click', () => {
    if (isInputEmpty(input)) {
        return console.log('vazio')
    } 

    fetchCard(input);
});

async function fetchCard(input) {
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

function isInputEmpty(input) {
    if (input.value.trim() === '') return true;
    else return false;
}
