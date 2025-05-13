
const mainContainer = document.createElement("div");
mainContainer.id = "mainContainer";
wrapper.appendChild(mainContainer);

const buttonContainer = document.createElement("div");
buttonContainer.id = "buttonContainer";
mainContainer.appendChild(buttonContainer);


const textFilter = document.createElement("p");
textFilter.id = "filterText";
textFilter.textContent = "Filtrera efter årtal:";
buttonContainer.appendChild(textFilter);


function renderButton(parent, year, color, selectedYearColor) {
    const button = document.createElement("button");
    button.id = "buttonYear";
    button.style.backgroundColor = color;
    button.textContent = year;

    buttonContainer.appendChild(button);

    button.addEventListener("click", (event) => {
        event.target.style.backgroundColor = selectedYearColor;

        //skicka/anropa (graffunktionen) med grafen och data som ska renderas dynamiskt utefter det selekterade årtalen, göra en if-sats
        //if (year === year) { staplarna förändras dynamisk utefter år och data som den får};
    })

}


//årtal-knappar
renderButton("wrapper", "2015", "#FF7EFF", "#EF00EF");
renderButton("wrapper", "2016", "#7EFF8D", "#00C217");
renderButton("wrapper", "2017", "#FF7E7E", "#CD3838");
renderButton("wrapper", "2018", "#7EABFF", "#3064C5");
renderButton("wrapper", "2019", "#FFE37E", "#EFC839");
renderButton("wrapper", "2020", "#7EFFF9", "#4ED2CB");
renderButton("wrapper", "2021", "#967EFF", "#5342A3");
renderButton("wrapper", "2022", "#FF2428", "#B30C0F");
renderButton("wrapper", "2023", "#FF5CB3", "#C60C6F");
renderButton("wrapper", "2024", "#AEFF00", "#689801");


//sammanställnings-knapp
const buttonCompilation = document.createElement("button");
buttonCompilation.id = "buttonCompilation";
buttonCompilation.textContent = "Sammanställning";
buttonContainer.appendChild(buttonCompilation);


