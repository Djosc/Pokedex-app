/**
 * @typedef {{name: string, detailsUrl: string}} Pokemon
 */

let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    /**
     * Takes a pokemon object and checks if it contains the correct keys,
     * then adds it to the {@link pokemonList} array.
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    function add(pokemon) {
        if ((typeof pokemon === 'object') && 'name' in pokemon && 'detailsUrl' in pokemon) {
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
        loadDetails(pokemon)
            .then(() => console.log(pokemon)); 
    }

    function showLoadingMessage() {
        let loadingDiv = document.querySelector('.loading-message');
        let loadingText = document.createElement('h1');
        loadingText.classList.add('loading-text');
        loadingText.innerText = 'Loading...';
        loadingDiv.appendChild(loadingText);
    }

    function hideLoadingMessage() {
        let loadingDiv = document.querySelector('.loading-message');
        let loadingText = document.querySelector('.loading-text');
        // setTimeout here so you can actually see the loading message
        // * will probably remove later
        setTimeout(() => loadingDiv.removeChild(loadingText), 300);          
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
        });
    }

    /**
     * Creates a list item containing a button that displays the pokemon's name and adds
     * it to the DOM.
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

    /**
     * Fetches the full list of Pokemon from the pokeAPI, then creates a {@link Pokemon} object
     *  for each one and calls {@link add} on it.
     */
    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl)
            .then((response) => { return response.json() })
            .then((json) => {
                json.results.forEach((item) => {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
                hideLoadingMessage();
            })
            .catch((e) => { 
                console.error(e);
                hideLoadingMessage();
            });
    }
    
    /**
     * Fetches further details about a pokemon and adds the new keys (and info) to the 
     * Pokemon object.
     * 
     * @see {@link showDetails} - function is called here
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    function loadDetails(pokemon) {
        showLoadingMessage();
        let url = pokemon.detailsUrl;
        return fetch(url)
            .then((response) => { return response.json() })
            .then((details) => {
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types;
                hideLoadingMessage();
            })
            .catch((e) => { 
                console.error(e);
                hideLoadingMessage();
            });
    }

    return {
        add: add,
        getAll: getAll,
        find: find,
        showDetails: showDetails,
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage,
        addEventListener: addEventListener,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

function writePokemon(pokemon) {
    pokemonRepository.addListItem(pokemon);
}

console.log(pokemonRepository.find('Bulbasaur'));

pokemonRepository.loadList()
    .then(() => {
        pokemonRepository.getAll().forEach((pokemon) => pokemonRepository.addListItem(pokemon));
    })
    .catch((e) => console.log(`this broken`));

// pokemonRepository.getAll().forEach(writePokemon);