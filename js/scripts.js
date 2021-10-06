let pokemonList = [
    {name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison']},
    {name: 'Charmander', height: 0.6, types: ['fire']},
    {name: 'Squirtle', height: 0.5, types: ['water']}
];

for (let i = 0; i < pokemonList.length; i++) {
    let name = pokemonList[i].name;
    let height = pokemonList[i].height;
    if (height > 0.6) {
        document.write(`<p>${name} (height: ${height}m) - Wow that's big</p>`)
    }
    else {
        document.write(`<p>${name} (height: ${height}m)</p>`)
    }
}


/*  Playing around - seeing if i could do it with array.filter() or without a for loop.

const largePokemon = pokemonList.filter(pokemon => pokemon.height > 0.6);

console.table(largePokemon);

pokemonList.forEach(writePokemon);

function writePokemon(pokemon) {
    const { name, height } = pokemon;
    if (height > 0.6) {
        document.write(`<p>${name} (height: ${height}m) - Wow that's big</p>`)
    }
    else {
        document.write(`<p>${name} (height: ${height}m)</p>`)
    }
};

*/