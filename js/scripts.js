
let pokemonRepository = (function () {
    let pokemonList = [
        { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
        { name: 'Charmander', height: 0.6, types: ['fire'] },
        { name: 'Squirtle', height: 0.5, types: ['water'] }
    ];

    /**
     * Takes a pokemon object and checks if it contains the correct properties,
     * then adds it to the {@link pokemonList} array
     * 
     * @param {Object} pokemon - pokemon object
     * @param {string} pokemon.name - pokemon name
     * @param {number} pokemon.height - the pokemon's height
     * @param {string[]} pokemon.types - array of pokemon types
     */
    function add(pokemon) {
        if ((typeof pokemon === 'object') &&
            'name' in pokemon && 'height' in pokemon && 'types' in pokemon) {
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

/**
 * Takes a pokemon object and writes it to the DOM while marking larger pokemon
 * 
 * @param {object} pokemon - pokemon object
 */
function writePokemon(pokemon) {
    const { name, height } = pokemon;
    if (height > 0.6) {
        document.write(`<p>${name} (height: ${height}m) - Wow that's big</p>`)
    }
    else {
        document.write(`<p>${name} (height: ${height}m)</p>`)
    }
};

console.log(Object.keys(pokemonRepository));

pokemonRepository.add({ name: 'Pikachu', height: 0.2, types: ['electric'] });

console.log(pokemonRepository.getAll());

console.log(pokemonRepository.find('Bulbasaur'));

// Calls the writePokemon function on all objects in pokemonRepository.pokemonList
pokemonRepository.getAll().forEach(writePokemon);