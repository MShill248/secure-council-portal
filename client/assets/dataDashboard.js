const addPotterySection = document.querySelector("#add-pottery-item");
const potterySection = document.querySelector("#pottery-section");
const addPotteryForm = document.querySelector("#add-pottery-form");
const visualiseH2 = document.querySelector("#visualise-h2");
const visualiseDiv = document.querySelector("#visualise-div");
const visualiseButton = document.querySelector("#visualise-h2-button");
const renderPieSection = document.querySelector("#render-img");
const closeButton = document.querySelector("#close-render");
const clearButton = document.querySelector("#remove-data");

visualiseButton.addEventListener("click", () => {
  renderVisualisation();
});

const renderVisualisation = async () => {
  try {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorisation: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`http://localhost:3000/request/requestInfo`, options);
    const responseData = await response.json();
    if (responseData.success) {
      visualiseH2.textContent = "Purchase History";
      visualiseDiv.innerHTML = responseData.visualisation.visualisation_html;

      clearButton.classList.remove("hidden");

      clearButton.addEventListener(
        "click",
        () => {
          visualiseDiv.innerHTML = "";
          clearButton.classList.add("hidden");
          visualiseH2.textContent = "";
        },
        { once: true } 
      );

      const scripts = visualiseDiv.querySelectorAll("div > script");

      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      });
    }
  } catch (err) {
    console.log(err);
  }
};
