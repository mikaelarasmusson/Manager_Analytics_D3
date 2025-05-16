
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


function renderButton(year, defaultColor, selectedColor, onClick) {
    const button = document.createElement("button");
    button.className = "buttonYear";
    button.textContent = year;
    button.style.backgroundColor = defaultColor;

    // Spara färger i dataset
    button.dataset.defaultColor = defaultColor;
    button.dataset.selectedColor = selectedColor;
    button.dataset.year = year;

    buttonContainer.appendChild(button);

    button.addEventListener("click", () => {
        // Återställ alla knappar i containern till sina default-färger
        const allButtons = buttonContainer.querySelectorAll("button");
        allButtons.forEach(btn => {
            btn.style.backgroundColor = btn.dataset.defaultColor;
        });

        // Färga den klickade knappen med sin selectedColor
        button.style.backgroundColor = selectedColor;

        console.log(year)

        // Uppdatera diagrammet
        onClick(year, selectedColor);
    });
}






