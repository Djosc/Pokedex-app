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
            .then(() => {
                // console.log(pokemon);
                showModal(pokemon);
            }); 
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
        // loadingDiv.removeChild(loadingText);      
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
        });
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
     * Calls {@link loadSprite} to get the spriteUrl for each sprite.
     * 
     * Then it creates a list item containing a button that displays the pokemon's name and sprite,
     *  then adds it to the DOM.
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
     function addListItem(pokemon) {
        loadSprite(pokemon)
            .then(() => {
                const { name, spriteUrl } = pokemon;
                let nameUpper = name.charAt(0).toUpperCase() + name.slice(1);

                let list = document.querySelector('.pokemon-list');
                let listItem = document.createElement('li');
                let pokemonButton = document.createElement('button');
                // pokemonButton.innerText = pokemon.name;
                pokemonButton.innerHTML = `
                    <img src="${spriteUrl}" alt="${nameUpper}"/>
                    <p>${nameUpper}</p>
                `;

                pokemonButton.classList.add('pokemon-button');
                listItem.appendChild(pokemonButton);
                list.appendChild(listItem);
                addEventListener(pokemonButton, pokemon);
            });
    }

    /**
     * This function uses the detailsUrl from each pokemon to retrieve the spriteUrl for the sprites
     *  so they can be displayed on the main list.
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    async function loadSprite(pokemon) {
        let res = await fetch(pokemon.detailsUrl);
        let resData = await res.json();
        
        pokemon.spriteUrl = resData.sprites.front_default;

        return resData;
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
                // pokemon.artUrl = details.sprites.other.dream_world.front_default;
                pokemon.artUrl = details.sprites.other['official-artwork'].front_default;
                pokemon.height = details.height;
                pokemon.weight = details.weight;
                pokemon.types = details.types;
                hideLoadingMessage();
            })
            .catch((e) => { 
                console.error(e);
                hideLoadingMessage();
            });
    }

    /**
     * A small helper function to get the actual type names because they are nested a couple
     * layers deep in types. Also capitalizes first letter.
     */
    function getTypeNames(types) {
        if (types.length > 1) {
            let typeNameUpper1 = types[0].type.name.charAt(0).toUpperCase() + types[0].type.name.slice(1);
            let typeNameUpper2 = types[1].type.name.charAt(0).toUpperCase() + types[1].type.name.slice(1);
            return `${typeNameUpper1}, ${typeNameUpper2}`;
        }
        return types[0].type.name.charAt(0).toUpperCase() + types[0].type.name.slice(1);
    }

    function showModal(pokemon) {
        let { name, artUrl, height, weight, types } = pokemon;
        
        // convert values to feet and pounds
        height = ((height / 10) * 3.28).toFixed(2);
        weight = ((weight / 10) * 2.2).toFixed(1);
        
        let typeNames = getTypeNames(types);
        typeNames = typeNames.charAt(0).toUpperCase() + typeNames.slice(1);

        let modalContainer = document.querySelector('#modal-container');

        // clear modal
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        // add modal content
        let closeButtonEl = document.createElement('button');
        closeButtonEl.classList.add('modal-close');
        closeButtonEl.innerText = 'Close';
        closeButtonEl.addEventListener('click', hideModal);

        let titleEl = document.createElement('h1');
        titleEl.innerText = name;

        let contentEl = document.createElement('div');
        contentEl.classList.add('pokemon-content');
        contentEl.innerHTML = `
            <img src="${artUrl}" alt="${name}"/>
            <span>
                Height: ${height} ft
                </br>
                </br>
                Weight: ${weight} lbs
                </br>
                </br>
                Types: ${typeNames}
            </span>
        `;

        modal.appendChild(closeButtonEl);
        modal.appendChild(titleEl);
        modal.appendChild(contentEl);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        let modalContainer = document.querySelector('#modal-container');
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    })

    window.addEventListener('click', (e) => {
        let modalContainer = document.querySelector('#modal-container')
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    })

    return {
        // * do i need all of these if some of them are only called internally? prob not
        add: add,
        getAll: getAll,
        find: find,
        showDetails: showDetails,
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage,
        addEventListener: addEventListener,
        loadList: loadList,
        addListItem: addListItem,
        loadSprite: loadSprite,
        loadDetails: loadDetails,
        getTypeNames: getTypeNames,
        showModal: showModal,
        hideModal: hideModal,
    };
})();

function writePokemon(pokemon) {
    pokemonRepository.addListItem(pokemon);
}

pokemonRepository.loadList()
    .then(() => {
        pokemonRepository.getAll().forEach((pokemon) => pokemonRepository.addListItem(pokemon));
    })
    .catch((e) => console.log(`this broken`));