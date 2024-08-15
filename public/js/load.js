const params = new URLSearchParams(window.location.search);
if (params.get("game")) {
  games.forEach(async (game) => {
    if (game.id !== params.get("game"))
      return (document.title = `${game.title} | SLA`);
    document.querySelector("#gameImage").src = game.image;
    document.querySelector("#gameTitle").innerHTML = game.title;
    if (game.description)
      document.querySelector("#gameDescription").innerHTML = game.description;
    document.querySelector("#frame").src =
      __uv$config.prefix + __uv$config.encodeUrl(game.url); // Set frame data to UV prox
  //  document.querySelector("#outlink").href =
  //    document.querySelector("#frame").src; // Fallback outlink button (broken)
    location.replace(document.querySelector("#frame").src); // Go to the UV prox ~!
  });
} else if (params.get("app")) {
  apps.forEach((app) => {
    if (app.id !== params.get("app"))
      return (document.title = `${app.title} | SLA`);
    document.querySelector("#gameImage").src = app.image;
    document.querySelector("#gameTitle").innerHTML = app.title;
    if (app.description)
      document.querySelector("#gameDescription").innerHTML = app.description;

    document.querySelector("#frame").src =
      __uv$config.prefix + __uv$config.encodeUrl(app.url);
  });
}

if (!getObj("favoritedGames")) setObj("favoritedGames", []);
if (!getObj("favoritedApps")) setObj("favoritedApps", []);

const favoritedButton = document.querySelector(".favorited");
const favoritedGames = getObj("favoritedGames");
const favoritedApps = getObj("favoritedApps");

const game = params.get("game");
const app = params.get("app");

if (favoritedGames.includes(game)) {
  favoritedButton.classList.remove("far");
  favoritedButton.classList.add("fas");
}

if (favoritedGames.includes(game)) {
  favoritedButton.classList.remove("far");
  favoritedButton.classList.add("fas");
}
function favorite() {
  if (game) {
    const index = favoritedGames.indexOf(game);
    if (index !== -1) {
      favoritedGames.splice(index, 1);
      favoritedButton.classList.remove("fas");
      favoritedButton.classList.add("far");
    } else {
      favoritedGames.push(game);
      favoritedButton.classList.remove("far");
      favoritedButton.classList.add("fas");
    }
    setObj("favoritedGames", favoritedGames);
  } else if (app) {
    const index = favoritedGames.indexOf(game);
    if (index !== -1) {
      favoritedGames.splice(index, 1);
      favoritedButton.classList.remove("fas");
      favoritedButton.classList.add("far");
    } else {
      favoritedGames.push(game);
      favoritedButton.classList.remove("far");
      favoritedButton.classList.add("fas");
    }
    setObj("favoritedGames", favoritedGames);
  }
}
