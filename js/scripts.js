
let pokemonRepository = (function () {
    let pokemonList = [
        { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
        { name: 'Charmander', height: 0.6, types: ['fire'] },
        { name: 'Squirtle', height: 0.5, types: ['water'] }
    ];

    function add(pokemon) {
        // if ((typeof pokemon === 'object') && Object.keys(pokemon).some(pokemon => 'name')) {
        if ((typeof pokemon === 'object') && 'name', 'height', 'types' in pokemon) {
            pokemonList.push(pokemon);
        }
        else {
            console.log(`Pokemon does not contain expected values`);
        }
    }

    function getAll() {
        return pokemonList;
    }

    function find(pokemonName) {
        return pokemonList.filter(pokemon => pokemon.name === pokemonName);
    }

    return {
        add: add,
        getAll: getAll,
        find: find
    };
})();


// Takes a pokemon object and writes it to the DOM while marking larger pokemon
function writePokemon(pokemon) {
    const { name, height } = pokemon;
    if (height > 0.6) {
        document.write(`<p>${name} (height: ${height}m) - Wow that's big</p>`)
    }
    else {
        document.write(`<p>${name} (height: ${height}m)</p>`)
    }
};

// Calls the writePokemon function on all objects in pokemonRepository.pokemonList
pokemonRepository.getAll().forEach(writePokemon);



console.log(Object.keys(pokemonRepository));

pokemonRepository.add({ name: 'Pikachu', height: 0.2, types: ['electric'] });

console.log(pokemonRepository.getAll());

console.log(pokemonRepository.find('Bulbasaur'));