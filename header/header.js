function renderHeader(parent) {
    const wrapper = document.getElementById(parent);

    const headerContainer = document.createElement("header");
    headerContainer.innerHTML = `
        <div>
            <img src="./assets/images/logga.png" alt="Logga">
        </div>
    `;
    wrapper.appendChild(headerContainer);

    const infoContainer = document.createElement("div");
    infoContainer.id = "infoContainer";
    wrapper.appendChild(infoContainer);

    infoContainer.innerHTML = `
        <div id="infoBild">
            <img src="./assets/images/infoImg.png" alt="Info-bild">
        </div>
        <p class="infoText">Under 10 år har vi samlat in och analyserat data om hundratals managers inom musikvärlden. Med hjälp av avancerad dataanalys och visuella grafer
        visar vi svart på vitt vad som gör en manager riktigt framgångsrik.</p>
        
        <p>Vi har ställt frågan: <b style="color: #FF7EFF">Vilken manager har varit mest framgångsrik - och varför?</b></p>
        <p class="infoText">Är det antalet bokningar, totalpublik de har dragit, pengarna de tjänat, eller vilka artister de arbetat med? Våra interaktiva grafer och djupdykningar
        ger dig svaren.</p>
        
        <p class="infoText">Oavsett om du är en DJ på jakt efter rätt partner, ett bokningsbolag eller bara nyfiken - här hittar du allt du behöver för att fatta smarta beslut.
        Utforska våra insikter. Jämför managers. <b>Hitta din perfekta match.</b></p>
        
        <p class="infoText">I sidomenyn kan du filtrera mellan olika år - då ändras innehållet i varje graf för att representera det året. Du kan också se mer information genom att hålla musen över en specifik stapel.
        Vill du se en sammanställning för en specifik manager? Klicka på sammanställningsknappen.</p>
    `;
}


renderHeader("wrapper");