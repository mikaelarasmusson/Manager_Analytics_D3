function renderPopupCompilationContainer(parent, year) {
    const wrapper = document.getElementById(parent);

    let popupCompilationContainer = document.createElement("div");
    popupCompilationContainer.id = "compilationContainer";
    wrapper.appendChild(popupCompilationContainer);

    let closePopupButton = document.createElement("div");
    closePopupButton.id = "closeButton";
    closePopupButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 37 37" fill="none">
            <path d="M25.2802 11.7198C25.1103 11.5485 24.9082 11.4126 24.6855 11.3198C24.4628 11.227 24.2239 11.1792 23.9826 11.1792C23.7414 11.1792 23.5025 11.227 23.2798 11.3198C23.0571 11.4126 22.855 11.5485 22.6851 11.7198L18.5 15.9232L14.3149 11.7198C13.9708 11.3757 13.504 11.1824 13.0174 11.1824C12.5307 11.1824 12.0639 11.3757 11.7198 11.7198C11.3757 12.0639 11.1824 12.5307 11.1824 13.0174C11.1824 13.504 11.3757 13.9708 11.7198 14.3149L15.9232 18.5L11.7198 22.6851C11.5485 22.855 11.4126 23.0571 11.3198 23.2798C11.227 23.5025 11.1792 23.7414 11.1792 23.9826C11.1792 24.2239 11.227 24.4628 11.3198 24.6855C11.4126 24.9082 11.5485 25.1103 11.7198 25.2802C11.8897 25.4515 12.0918 25.5874 12.3145 25.6802C12.5372 25.773 12.7761 25.8208 13.0174 25.8208C13.2586 25.8208 13.4975 25.773 13.7202 25.6802C13.9429 25.5874 14.145 25.4515 14.3149 25.2802L18.5 21.0768L22.6851 25.2802C22.855 25.4515 23.0571 25.5874 23.2798 25.6802C23.5025 25.773 23.7414 25.8208 23.9826 25.8208C24.2239 25.8208 24.4628 25.773 24.6855 25.6802C24.9082 25.5874 25.1103 25.4515 25.2802 25.2802C25.4515 25.1103 25.5874 24.9082 25.6802 24.6855C25.773 24.4628 25.8208 24.2239 25.8208 23.9826C25.8208 23.7414 25.773 23.5025 25.6802 23.2798C25.5874 23.0571 25.4515 22.855 25.2802 22.6851L21.0768 18.5L25.2802 14.3149C25.4515 14.145 25.5874 13.9429 25.6802 13.7202C25.773 13.4975 25.8208 13.2586 25.8208 13.0174C25.8208 12.7761 25.773 12.5372 25.6802 12.3145C25.5874 12.0918 25.4515 11.8897 25.2802 11.7198ZM31.4207 5.57927C29.7349 3.83378 27.7183 2.44152 25.4886 1.48372C23.2589 0.525927 20.8608 0.0217765 18.4342 0.000690021C16.0076 -0.0203965 13.6011 0.442003 11.3551 1.36091C9.10916 2.27981 7.06868 3.63682 5.35275 5.35275C3.63682 7.06868 2.27981 9.10916 1.36091 11.3551C0.442003 13.6011 -0.0203965 16.0076 0.000690021 18.4342C0.0217765 20.8608 0.525927 23.2589 1.48372 25.4886C2.44152 27.7183 3.83378 29.7349 5.57927 31.4207C7.26512 33.1662 9.28172 34.5585 11.5114 35.5163C13.7411 36.4741 16.1392 36.9782 18.5658 36.9993C20.9924 37.0204 23.3989 36.558 25.6448 35.6391C27.8908 34.7202 29.9313 33.3632 31.6473 31.6473C33.3632 29.9313 34.7202 27.8908 35.6391 25.6448C36.558 23.3989 37.0204 20.9924 36.9993 18.5658C36.9782 16.1392 36.4741 13.7411 35.5163 11.5114C34.5585 9.28172 33.1662 7.26512 31.4207 5.57927ZM28.8439 28.8439C26.4535 31.2369 23.3074 32.7271 19.9416 33.0606C16.5757 33.3941 13.1983 32.5503 10.3848 30.6728C7.57136 28.7954 5.49586 26.0006 4.51194 22.7645C3.52802 19.5285 3.69655 16.0513 4.98882 12.9256C6.28109 9.79985 8.61715 7.21885 11.599 5.62233C14.5808 4.02582 18.024 3.51256 21.3418 4.17C24.6597 4.82745 27.6469 6.61493 29.7947 9.22789C31.9424 11.8409 33.1177 15.1177 33.1203 18.5C33.1269 20.4213 32.7523 22.3248 32.0182 24.1003C31.2842 25.8758 30.2052 27.4881 28.8439 28.8439Z" fill="#F8F8F8"/>
        </svg>
    `;
    popupCompilationContainer.appendChild(closePopupButton);

    closePopupButton.addEventListener("click", () => {
        document.getElementById("wrapper").classList.remove("blur");
        document.body.classList.remove("noScroll");
        popupCompilationContainer.remove();
    });

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
        managerButton.className = "managerButtons";
        managerButton.textContent = mgr.name;
        managerButton.onclick = () => {
            popupCompilationContainer.remove();
            // Lägg till blur på wrapper
            document.getElementById("wrapper").classList.add("blur");

            // Skapa overlay
            const overlay = document.createElement("div");
            overlay.id = "popupOverlay";

            // Lägg till i body (inte i wrapper!)
            document.body.appendChild(overlay);

            // Rendera popup i overlay
            renderPopupManagerSummary("popupOverlay", mgr.name, year);

            // Förhindra scroll
            document.body.classList.add("noScroll");
        };
        managerButtonsContainer.appendChild(managerButton);
    });

    popupCompilationContainer.appendChild(managerButtonsContainer);
}