/**
 * @typedef {{name: string, height: number, types: string[]}} Pokemon
 */

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
     * @param {Pokemon} pokemon - {@link Pokemon} object
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

    function showDetails(pokemon) {
        console.log(pokemon.name);
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
        });
    }

    /**
     * Creates a list item containing a button that displays the pokemon's name and adds
     * it to the DOM
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    function addListItem(pokemon) {
        let list = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemon-button');
        listItem.appendChild(button);
        list.appendChild(listItem);
        addEventListener(button, pokemon);
    }

    return {
        add: add,
        getAll: getAll,
        find: find,
        showDetails: showDetails,
        addEventListener: addEventListener,
        addListItem: addListItem
    };
})();

/**
 * Takes a pokemon object and calls {@link pokemonRepository.addListItem} on it
 * 
 * @param {Pokemon} pokemon - {@link Pokemon} object
 */
function writePokemon(pokemon) {
    pokemonRepository.addListItem(pokemon);
};

// let writePokemon = (pokemon) => pokemonRepository.addListItem(pokemon);

pokemonRepository.add({ name: 'Pikachu', height: 0.2, types: ['electric'] });

console.log(pokemonRepository.find('Bulbasaur'));

pokemonRepository.getAll().forEach(writePokemon);