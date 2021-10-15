if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

const container = document.querySelector(".container");
const fangs = [
  {
    name: "Test 1",
    name: "Test 2",
    name: "Test 3",
  },
];

const showFangs = () => {
  let output = "";
  console.log(fangs);
  fangs.forEach(
    ({ name }) =>
      (output += `<div class="card">
          <h1 class="card--title">${name}</h1>
          <a class="card--link" href="#">
            Show
          </a>
        </div>`)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showFangs);
