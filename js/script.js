// Define an object named APP to encapsulate the functionality
const APP = {
  // Properties representing various elements in the HTML
  form: document.getElementById("form"),
  date: document.getElementById("date"),
  history: document.getElementById("history"),
  clear: document.getElementById("clear"),
  getImage: document.getElementById("getImage"),
  imagePosition: document.getElementById("imagePosition"),
  images: [], // Array to store image data
  image: {}, // Object to store current image data

  // Initialization function
  init: () => {
    // Load existing images from local storage and render the history
    APP.loadStorage();
    APP.renderHistory(APP.images);

    // Add event listeners to the form and clear button
    APP.form.addEventListener("submit", APP.fetchImages);
    APP.clear.addEventListener("click", APP.clearHistory);
    date.setAttribute("max", APP.formateDate(new Date()));
  },

  // Function to load images from local storage
  loadStorage: () => {
    // Retrieve images from local storage or initialize an empty array
    localHistory = localStorage.getItem("images");
    localHistory ? (APP.images = JSON.parse(localHistory)) : (APP.images = []);
  },

  // Function to render the image history in the HTML
  renderHistory: () => {
    APP.history.innerHTML = ""; // Clear existing history
    const fragment = new DocumentFragment(); // Use a document fragment for efficiency

    // If there are images, create and append list items for each image
    if (APP.images.length > 0) {
      APP.images.forEach((image) =>
        fragment.appendChild(APP.createLineImage(image))
      );
      APP.history.appendChild(fragment);
    }
  },

  // Function to create a list item for an image in the history
  createLineImage: (image) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", image.id);
    li.classList.add("list-group-item");
    li.classList.add("d-flex");
    li.classList.add("justify-content-between");
    li.classList.add("align-items-center");
    li.style.height = "5rem";
    li.style.marginBottom = ".15rem";

    li.style.backgroundColor = "#d4dbeb";
    const title = document.createElement("strong");
    title.textContent = image.title;
    title.style.fontSize = ".8rem";
    title.style.width = "10rem";
    li.appendChild(title);

    const date = document.createElement("span");
    date.textContent = image.date;
    date.style.fontSize = ".8rem";
    li.appendChild(date);

    const img = document.createElement("img");
    img.setAttribute("src", image.url);
    img.setAttribute("alt", image.title);
    img.style.height = "5rem";
    img.style.maxWidth = "5rem";
    // img.style.objectFit = "cover";

    const linkHD = document.createElement("a");
    linkHD.setAttribute("href", image.hdurl);
    linkHD.appendChild(img);
    linkHD.setAttribute("target", "_blank");
    linkHD.style.marginLeft = "1rem";
    // linkHD.style.maxWidth = "1rem";
    li.appendChild(linkHD);

    btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("text-primary");

    btn.innerHTML = "<strong>Delete</strong>";
    btn.addEventListener("click", APP.clearImage);
    li.appendChild(btn);
    return li;
  },

  // Function to fetch images from the NASA API based on the selected date
  fetchImages: async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=jkM9dCVNqfA2EplVBEhGxRfR3zdsAYR8bbL1IYp3&start_date=${APP.date.value}&end_date=${APP.date.value}`
    );
    const json = await response.json();
    const image = json[0];
    image.id = Date.now();
    APP.image = image;
    APP.imagePosition.innerHTML = "";
    APP.imagePosition.appendChild(APP.createImage(APP.image));
  },

  // Function to create a detailed view of a single image
  createImage: (image) => {
    console.log(image);
    const card = document.createElement("div");
    card.setAttribute("data-id", image.id);
    card.classList.add("card");
    card.classList.add("m-auto");
    card.style.width = "80%";

    const img = document.createElement("img");
    img.setAttribute("src", image.url);
    img.classList.add("card-img-top");
    img.setAttribute("alt", image.title);
    img.style.maxHeight = "15rem";
    img.style.objectFit = "cover";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = image.title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.style.fontSize = ".8rem";
    cardText.textContent = image.explanation;

    const btn = document.createElement("a");
    btn.classList.add("btn");
    btn.classList.add("btn-primary");
    btn.innerHTML = "Save";
    btn.addEventListener("click", APP.saveImage);

    card.appendChild(img);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(btn);
    card.appendChild(cardBody);

    return card;
  },

  // Function to save the current image to the history
  saveImage: () => {
    APP.images.unshift(APP.image); // Add the current image to the beginning of the array
    APP.saveLocalStorage(); // Save the updated array to local storage
  },

  // Function to save the images array to local storage
  saveLocalStorage: () => {
    localStorage.setItem("images", JSON.stringify(APP.images));
    APP.loadStorage(); // Reload images from local storage
    APP.renderHistory(APP.images); // Render the updated history
  },

  // Function to clear the image history
  clearHistory: () => {
    APP.images = []; // Clear the images array
    localStorage.removeItem("images"); // Remove the images from local storage
    APP.history.innerHTML = ""; // Clear the history in the HTML
  },

  // Function to remove a single image from the history
  clearImage: (e) => {
    const image = e.target.parentNode.parentNode;
    APP.images = APP.images.filter((img) => img.id != image.dataset.id);
    APP.saveLocalStorage(); // Save the updated array to local storage
  },

  // Function to format a date object as YYYY-MM-DD
  formateDate: (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  },
};

// Initialize the application when the DOM content is loaded
document.addEventListener("DOMContentLoaded", APP.init);
