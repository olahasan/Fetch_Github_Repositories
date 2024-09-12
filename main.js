// Main Variables
let theInput = document.querySelector(".get-repos input");
let getButton = document.querySelector(".get-button");
let reposData = document.querySelector(".show-data");

// works after click
getButton.onclick = function () {
  getRepos();
};

////// works after click or press enter from keyboard
////// Event Listener for Enter Key Press //////"Deprecated"//////
theInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getRepos();
  }
});

////// works while writing in the input
// theInput.onkeypress = function () {
//   getRepos();
// };

// Get Repos Function
function getRepos() {
  if (theInput.value === "") {
    handleEmptyInput();
  } else {
    document.querySelector(".loading").style.display = "block";
    fetch(`https://api.github.com/users/${theInput.value.trim()}/repos`)
      .then((response) => {
        document.querySelector(".loading").style.display = "none";
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })

      .then((repositories) => {
        if (repositories.length === 0) {
          handleEmptyInput();
        } else {
          // console.log(repositories);
          // Empty The Container
          reposData.innerHTML = "";

          // Loop On Repositories
          repositories.forEach((repo) => {
            handleElementsIntoPage(repo);
          });
        }
      })
      .catch((err) => {
        // console.log(err);
        document.querySelector(".loading").style.display = "none";
        reposData.innerHTML = `<span class="error">Error: ${err.message}</span>`;
        document.querySelector(".error").style.color = "#f44336";
      });
  }
}

function handleEmptyInput() {
  reposData.innerHTML = `<span class="empty">Please Write Github Username.</span>`;
  let emptyEle = document.getElementsByClassName("empty")[0];
  emptyEle.style.color = "#f44336";
  emptyEle.style.fontWeight = "bold";
}

function handleElementsIntoPage(repo) {
  let divEle = createElement("div", "repo-box", repo.name, reposData);

  let anchor = createElement("a", null, "Visit", divEle);
  anchor.href = `https://github.com/${theInput.value}/${repo.name}`;
  anchor.setAttribute("target", "_blank");

  createElement("span", null, `Stars ${repo.stargazers_count}`, divEle);

  reposData.appendChild(divEle);
}

function createElement(tag, className, textContent, parent) {
  let element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  if (parent) parent.appendChild(element);
  return element;
}
