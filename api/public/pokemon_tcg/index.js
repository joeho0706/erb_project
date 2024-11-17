/**
 * Promises
 */
// function getPokemonInfo(id) {
//   return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
//     res.json()
//   );
// }
// const app = document.getElementById("app");
// fetch("https://pokeapi.co/api/v2/pokemon")
//   .then((res) => res.json())
//   .then((data) => {
//     if (data) {
//       const pokemonList = data.results;
//       pokemonList.forEach((pokemon) => {
//         const divElement = document.createElement("div");
//         divElement.classList.add("card");
//         divElement.textContent = pokemon.name;
//         app.appendChild(divElement);
//         getPokemonInfo(pokemon.name).then((pokemonInfo) => {
//           const imgElement = document.createElement("img");
//           imgElement.src = pokemonInfo.sprites.front_default;
//           imgElement.alt = pokemon.name;
//           imgElement.addEventListener("mouseover", () => {
//             imgElement.src = pokemonInfo.sprites.front_shiny;
//             imgElement.classList.add("img--active");
//           });
//           imgElement.addEventListener("mouseleave", () => {
//             imgElement.src = pokemonInfo.sprites.front_default;
//             imgElement.classList.remove("img--active");
//           });
//           divElement.appendChild(imgElement);
//         });
//       });
//     }
//   });

/**
 * Async/Await
 */
async function main() {
  let url = 'https://api.pokemontcg.io/v2/cards/';
  const app = document.getElementById('app');
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': '805095c4-b4d8-4398-8dd9-0659a3fb69de',
    },
  });
  const pool = await response.json();
  pool.data.forEach(async (pokenmonBasicInfo) => {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    divElement.textContent = pokenmonBasicInfo.name;
    app.appendChild(divElement);

    const imgElement = document.createElement('img');
    imgElement.src = pokenmonBasicInfo.images.small;
    divElement.appendChild(imgElement);

    imgElement.addEventListener('mouseover', () => {
      imgElement.src = pokenmonBasicInfo.images.small;
      imgElement.classList.add('img--active');
    });

    imgElement.addEventListener('mouseout', () => {
      imgElement.src = pokenmonBasicInfo.images.small;
      imgElement.classList.remove('img--active');
    });
  });
}

main();
