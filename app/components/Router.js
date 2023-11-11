import api from "../helpers/wp_api.js";
import {ajax} from "../helpers/ajax.js";
import {PostCard} from "./PostCard.js";
import {Post} from "./Post.js";
import {SearchCard} from "./SearchCard.js";
import {ContactForm} from "./ContactForm.js";

export async function Router() {
  const d = document,
    w = window,
    $main = d.getElementById("main");

  let {hash} = location;

  //console.log(hash);
  //console.log(`${api.POST}?slug=${w.location.hash.split("/")[1]}`);
  //console.log(api.POST);
  $main.innerHTML = null;

  if (!hash || hash === "#/") {
    await ajax({
      url: api.POSTS,
      cbSuccess: (posts) => {
        //console.log(posts);
        let html = "";
        posts.forEach((post) => (html += PostCard(post)));
        $main.innerHTML = html;
      },
    });
  } else if (hash.includes("#/search")) {
    let query = localStorage.getItem("wpSearch");

    if (!query) {
      d.querySelector(".loader").style.display = "none";
      return false;
    }

    await ajax({
      url: `${api.SEARCH}${query}`,
      cbSuccess: (search) => {
        //console.log(search);
        let html = "";

        if (search.length === 0) {
          html = `
          <p class="error">
          No existen resultados de busqueda para el término
          <mark>${query}</mark>
          </p>
          `;
        } else {
          search.forEach((post) => (html += SearchCard(post)));
        }

        $main.innerHTML = html;
      },
    });
  } else if (hash === "#/contacto") {
    $main.appendChild(ContactForm());
    //ContactForm;
  } else {
    await ajax({
      url: `${api.POST}?slug=${hash.slice(2)}`,
      cbSuccess: (post) => {
        //console.log(post);
        $main.innerHTML = Post(post);
      },
    });
  }
  d.querySelector(".loader").style.display = "none";
}
