function renderFooter(parent) {
    const wrapper = document.getElementById(parent);
    const footer = document.createElement("footer");
    footer.id = "footer";

    footer.innerHTML += `
        <div id="footerText">
            <p>Manager Analytics Contact:</p>
            <p>Email: info@manageranalytics.se</p>
            <p>Phone: 072 - 374 56 89</p>
            <p>Adress: Nordenskiöldsgatan 1, 211 19, Malmö.</p>
        </div>
        <div id="footerSocialMedia">
            <p>Följ oss på sociala medier!</p>
            <div id="iconsSocialMedia">
                <img src="./assets/images/instagram.png">
                <img src="./assets/images/facebook.png">
                <img src="./assets/images/linkedin.png">
            </div>
        </div>
    
    `
    wrapper.appendChild(footer);

}


renderFooter("wrapper");