function renderPopupCompilationContainer (parent, year) {
    const wrapper = document.getElementById(parent);

    let popupCompilationContainer = document.createElement("div");
    popupCompilationContainer.id = "compilationContainer";
    wrapper.appendChild(popupCompilationContainer);

    let compilationContent = document.createElement("div");
    compilationContent.id = "compilationContent";
    compilationContent.innerHTML = `
        <h2 class="title">${year}</h2>
        <p class="infoText"> 
            Här kan du se en sammanställning av data från alla graferna, men för endast en specifik manager. På så sätt kan du få en bredare överblick hur framgångsrik managern varit under just de året, sett till flera olika parametrar. Var uppmärksam på att du nu endast ser för år: ${year}, vill du se för ett annat år så kan du ändra i knapp-menyn utanför denna popup. Välj vilken manager du vill titta på i listan nedan.
        </p> 
    `;
    popupCompilationContainer.appendChild(compilationContent);

    let managerButtonsContainer = document.createElement("div");
    managerButtonsContainer.id = "managerButtonsContainer";
    popupCompilationContainer.appendChild(managerButtonsContainer);

    const managers = groupedByYear.find(d => d.year === year)?.managers || [];

    managers.forEach(mgr => {
        let managerButton = document.createElement("button");
        managerButton.textContent = mgr.name;
        //managerButton.onclick = () => showManagerSummary(mgr.name, year); // Funktion du definierar separat
        managerButtonsContainer.appendChild(managerButton);
    });

    popupCompilationContainer.appendChild(managerButtonsContainer); // Inuti popupen
}