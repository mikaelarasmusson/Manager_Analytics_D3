function renderButton(parent, year, color) {
    const wrapper = document.getElementById("wrapper");
    const button = document.createElement("div");
    button.id = "buttonYear";
    button.backgroundcolor = color;
    button.textContent = "year";

    wrapper.appendChild(button);


}