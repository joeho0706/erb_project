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
  let url =
    'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician';
  const app = document.getElementById('app');
  const response = await fetch(url, {});
  const pool = await response.json();
  const paragraphElement = document.createElement('h1');
  app.appendChild(paragraphElement);
  paragraphElement.textContent = pool.data[0].name;
  pool.data[0].card_images.forEach(async (image) => {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    divElement.textContent = '#' + image.id;
    app.appendChild(divElement);

    const imgElement = document.createElement('img');
    imgElement.src = image.image_url_small;
    divElement.appendChild(imgElement);

    imgElement.addEventListener('mouseover', () => {
      imgElement.src = image.image_url_small;
      imgElement.classList.add('img--active');
    });

    imgElement.addEventListener('mouseout', () => {
      imgElement.src = image.image_url_small;
      imgElement.classList.remove('img--active');
    });
  });
}

main();
