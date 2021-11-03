/**
 * @typedef {{name: string, detailsUrl: string}} Pokemon
 */

let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }

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
            console.error(`Pokemon does not contain expected values`);
        }
    }

    function showDetails(pokemon) {
        loadDetails(pokemon)
            .then(() => {
                showModal(pokemon);
            });
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
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

                let list = document.querySelector('.pokemon-list');
                let listItem = document.createElement('li');
                listItem.classList.add('list-group-item');

                let pokemonButton = document.createElement('button');
                pokemonButton.classList.add('pokemon-button');
                pokemonButton.setAttribute('data-toggle', 'modal');
                pokemonButton.setAttribute('data-target', '#poke-modal');
                pokemonButton.innerHTML = `
                    <img src="${spriteUrl}" alt="${name}"/>
                    <p>${name}</p>
                `;

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
     * This function is called from {@link showDetails}
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    function loadDetails(pokemon) {
        let url = pokemon.detailsUrl;
        return fetch(url)
            .then((response) => { return response.json() })
            .then((details) => {
                pokemon.artUrl = details.sprites.other['official-artwork'].front_default;
                pokemon.id = details.id;
                pokemon.height = details.height;
                pokemon.weight = details.weight;
                pokemon.types = details.types;
            })
            .catch((e) => {
                console.error(e);
            });
    }

    /**
     * This is called when a pokemon's button is clicked.
     * Creates a modal popup and displays the pokemon's artwork and info 
     * 
     * @param {Pokemon} pokemon - {@link Pokemon} object
     */
    function showModal(pokemon) {
        let { name, artUrl, id, height, weight, types } = pokemon;

        id = String(id).padStart(3, '0');
        // convert values to feet and pounds
        height = convertHeight(height);
        weight = convertWeight(weight);

        let typeNames = getTypeNames(types);

        let modalTitle = document.querySelector('.modal-title');
        let modalBody = document.querySelector('.modal-body');
        // clear modal
        modalBody.innerHTML = '';
        modalTitle.innerHTML = '';
        modalTitle.innerText = name + ` #${id}`;

        let contentEl = document.createElement('div');
        contentEl.classList.add('pokemon-content');
        contentEl.innerHTML = `
            <img src="${artUrl}" alt="${name}"/>
        `;

        let pokeInfoDiv = document.createElement('div');
        pokeInfoDiv.classList.add('pokemon-info');
        pokeInfoDiv.innerHTML = `
            <span class="height">Height: ${height}</span>
            <span class="weight">Weight: ${weight} lbs</span>
        `;

        // creates individual spans for the types
        //  and adds the type name as a class to be targeted in the CSS
        let typeSpanEl1 = document.createElement('span');
        let typeSpanEl2 = document.createElement('span');
        if (typeNames.includes(',')) {
            let typeArr = typeNames.split(',')
            typeSpanEl1.classList.add(typeArr[0]);
            typeSpanEl2.classList.add(typeArr[1].trim());
            typeSpanEl1.innerText = typeArr[0];
            typeSpanEl2.innerText = typeArr[1].trim();
            pokeInfoDiv.appendChild(typeSpanEl1);
            pokeInfoDiv.appendChild(typeSpanEl2);
        }
        else {
            typeSpanEl1.classList.add(typeNames);
            typeSpanEl1.innerText = typeNames;
            pokeInfoDiv.appendChild(typeSpanEl1);
        }

        contentEl.appendChild(pokeInfoDiv);
        modalBody.appendChild(contentEl);
    };

    // Formatting functions for the data displayed on the modal.
    function getTypeNames(types) {
        if (types.length > 1) {
            return `${types[0].type.name}, ${types[1].type.name}`;
        }
        return `${types[0].type.name}`;
    }

    function convertHeight(height) {
        // convert height to feet w/ decimal
        height = ((height / 10) * 3.28).toFixed(2);
        // separate out the decimal and convert to inches
        let whole = Math.floor(height);
        let dec = Math.round((height - whole) * 12);

        dec = String(dec).padStart(2, '0');
        let returnString = ``;
        // round up inches to the next foot
        returnString = dec === '12' ? `${whole + 1}' 00"` : `${whole}' ${dec}"`;

        return returnString;
    }

    function convertWeight(weight) {
        weight = ((weight / 10) * 2.2).toFixed(1);
        return weight % 1 === 0 ? Math.floor(weight) : weight;
    }

    // Diplays pokemon based on the search bar input
    let pokeSearchBar = document.querySelector('#filter');
    pokeSearchBar.addEventListener('input', () => {
        let pokeListItem = document.querySelectorAll('li');
        let filter = pokeSearchBar.value.toUpperCase();

        pokeListItem.forEach((listItem) => {
            if (listItem.innerText.toUpperCase().indexOf(filter) > -1) {
                listItem.style.display = '';
            } else {
                listItem.style.display = 'none';
            }
        });
    });

    return {
        add: add,
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
    };
})();

let scrollButton = document.getElementById('btn-to-top');
scrollButton.addEventListener('click', toTop);
function toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

pokemonRepository.loadList()
    .then(() => {
        pokemonRepository.getAll().forEach((pokemon) => pokemonRepository.addListItem(pokemon));
    })
    .catch((e) => console.error(`e`));