const input_link = document.querySelector(".link_input");
const link_generator = document.querySelector(".link__generator-btn");
const menu_btn = document.querySelector(".menu");
let result_container = document.querySelector(".result_container");
const actionNavigation = document.querySelector(".action_wrapper");
const error = document.querySelector(".error");
const short_link = document.querySelector(".short_link");

let generating = false;

// Get All Generated Link Data
const getLinks = () => {
  let links = JSON.parse(localStorage.getItem("shortened_links"));
  if (links?.length > 0) {
    return links;
  } else {
    return [];
  }
};

const errorNotifier = (errorMessage) => {
  error.textContent = errorMessage;
  setTimeout(() => {
    error.textContent = "";
  }, 3000);
};

// Display All Previous Generated Links
const displayLinks = () => {
  const links = getLinks();
  links.forEach(({ original_link, full_short_link }) => {
    let shortLinkCard = document.createElement("div");
    shortLinkCard.className = "shortened__link-card";
    shortLinkCard.innerHTML = `<span class="real_link">${original_link}</span>
    <div class="short_link_action-container">
      <a href="" class="short_link">${full_short_link}</a>
      <button class="copy_link-btn">Copy</button>
      </div>`;
    result_container.prepend(shortLinkCard);
  });
};

displayLinks();

// Generate new shortlinks and add to UI
link_generator.addEventListener("click", async () => {
  try {
    if (input_link.value.trim() === "")
      return errorNotifier("Input a Correct Link");

    generating = true;
    generating && (link_generator.textContent = "Generating Link...");
    const res = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${input_link.value}`
    );
    const {
      ok,
      result: { original_link, full_short_link },
    } = await res.json();

    generating = false;

    let shortLinkCard = document.createElement("div");
    shortLinkCard.className = "shortened__link-card";
    shortLinkCard.innerHTML = ` <span class="real_link">${original_link}</span>
  <div class="short_link_action-container">
  <a href="" class="short_link">${full_short_link}</a>
  <button class="copy_link-btn">Copy</button>
  </div>`;

    let data = getLinks();
    data.push({ original_link, full_short_link });
    localStorage.setItem("shortened_links", JSON.stringify(data));

    result_container.prepend(shortLinkCard);
    input_link.value = "";
  } catch (err) {
    console.log(err);
    generating = false;
    link_generator.textContent = "Shorten it!";
    errorNotifier(`Error occur,\n please retry & use a valid link`);
  }
});

// Toggle Mobile Navigation Visibility

menu_btn.addEventListener("click", () => {
  actionNavigation.classList.toggle("show");
});

// Copy Short link generated

result_container.addEventListener("click", (e) => {
  const element = e.target;
  if (element.className === "copy_link-btn") {
    navigator.clipboard.writeText(element.previousElementSibling.textContent);
    element.textContent = "Copied";

    setTimeout(() => {
      element.textContent = "Copy";
    }, 3000);
  }
});
