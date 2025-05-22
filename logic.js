// Skapar en tom array som ska fyllas med statistik per manager.
// Kommer innehålla objekt, ett per manager, med tillhörande gig-data och sammanställningar.
const datasetManagerAnalyticsData = [];

// Loopa igenom alla managers som är en array med objekt
for (let manager of Managers) {
    // Sparar varje egenskap av managers i en variabel
    const managerId = manager.id;
    const managerName = manager.name;
    const managerAge = manager.age;
    const managerGender = manager.gender;
    const managerEthnicity = manager.ethnicity;
    const managerImg = manager.img;

    // Ett objekt som innehåller:
    // Managerinformation
    // En gigs-nyckel med ett objekt som i sin tur innehåller en array per år
    // En tom summary-nyckel som kommer innehålla statistik per år senare
    const dataset = {
        managerId: managerId,
        managerName: managerName,
        managerAge: managerAge,
        managerGender: managerGender,
        managerEthnicity: managerEthnicity,
        managerImg: managerImg,
        gigs: {
            "2015": [],
            "2016": [],
            "2017": [],
            "2018": [],
            "2019": [],
            "2020": [],
            "2021": [],
            "2022": [],
            "2023": [],
            "2024": []
        },
        summary: {}
    };

    // Filtrerar fram DJs som jobbar med managern
    // .filter() returnerar en ny array med DJs där managerID matchar den aktuella managerns ID.
    let djCollaboration = DJs.filter(dj => dj.managerID === managerId);
    console.log("DJ-manager collab use filter", djCollaboration)

    // Om inga DJs hittas – hoppa över denna manager:
    if (djCollaboration.length == 0) continue;

    // Hitta gigs för dessa DJs

    for (let dj of djCollaboration) {
        // För varje DJ – filtrera ut deras gigs.
        //.filter() returnerar en ny array där gig.djID == dj.id.
        let gigsForThisDj = Gigs.filter(gig => gig.djID == dj.id)

        for (let gig of gigsForThisDj) {
            // Tar årtalet från gigets datum med .slice(0, 4) (t.ex. "2022-09-01" → "2022").
            const year = gig.date.slice(0, 4);
            // Om året finns (vilket det gör mellan 2015–2024), lägg till gig-info i arrayen.
            if (dataset.gigs[year]) {
                dataset.gigs[year].push({
                    date: gig.date,
                    earning: gig.managerEarnings,
                    attendance: gig.attendance,
                    djId: gig.djID
                });
            }
        }
    }


    // Skapa statistik och sammanfattning per år
    // Loopa genom varje år och hämta ut alla gigs som finns för det året.
    for (let year in dataset.gigs) {
        let gigsThisYear = dataset.gigs[year];
        let amountOfGigs = gigsThisYear.length;
        let totalEarnings = 0;
        let totalAttendees = 0;
        let unicDjsId = [];

        // En for...of-loop som går igenom varje gig (spelning) som skett det aktuella året.
        for (let gig of gigsThisYear) {
            // Summerar alla intäkter för året.
            // Resultatet är att du får totala intäkter för det året.
            totalEarnings += gig.earning;
            // Samma princip som ovan, fast för antalet besökare (publik).
            // Du får totalt antal personer som kommit på spelningarna under året.
            totalAttendees += gig.attendance;

            // Här används array-metoden .includes():
            // Returnerar true om ett värde redan finns i arrayen.
            // I detta fall: kollar om DJ:n för detta gig redan redan har registrerats som unik för året.
            if (!unicDjsId.includes(gig.djId)) {
                // .push() lägger till DJ:ns ID i arrayen unicDjsId.
                // Detta görs bara om ID:t inte redan finns (tack vare includes() ovan).
                // På så sätt kan man räkna antalet unika DJs senare med unicDjsId.length.
                unicDjsId.push(gig.djId);
            }
        }

        //Summerar:
        //Totala gigs
        //Totala intäkter
        //Totala besökare
        //Unika DJs (via ID-kontroll)
        dataset.summary[year] = {
            totalGigs: amountOfGigs,
            totalEarnings: totalEarnings,
            totalAttendees: totalAttendees,
            unicDjs: unicDjsId.length
        };
    }
    // Lägger till dataset i huvudarrayen
    datasetManagerAnalyticsData.push(dataset);
}


// Gruppera data per år
const groupedByYear = [];

// Tar alla år som finns i första managerns sammanställning (Object.keys() ger en array av nycklar = årtal).
const allYears = Object.keys(datasetManagerAnalyticsData[0].summary);

// Sammanställ managers per år
for (let year of allYears) {
    // .map() skapar en ny array med ett objekt per manager.
    let managers = datasetManagerAnalyticsData.map(manager => {
        const summary = manager.summary[year];
        // Här används chaining med optional chaining (?.):
        // summary?.totalEarnings betyder:
        // Om summary är undefined (t.ex. inget gig det året) så blir det inte ett fel, utan bara undefined.
        // || 0 gör att det istället blir 0.
        // Detta är safe access – du slipper krascha p.g.a. undefined.
        return {
            name: manager.managerName,
            age: manager.managerAge,
            gender: manager.managerGender,
            ethnicity: manager.managerEthnicity,
            earnings: summary?.totalEarnings || 0,
            gigs: summary?.totalGigs || 0,
            attendees: summary?.totalAttendees || 0,
            djs: summary?.unicDjs || 0
        };
    });

    // groupedByYear kommer att innehålla ett objekt per år, där varje objekt ser ut så här:
    //   year: 2023,
    //   managers: [ {name: ..., earnings: ...}, {...}, ... ]
    groupedByYear.push({
        // year är från en tidigare loop:
        // for (let year of allYears)
        // Där allYears kommer från: vilket innebär att year är en sträng, t.ex. "2023".
        // parseInt(year) konverterar den strängen till ett heltal (number):
        // För att få ett nummer istället för sträng, vilket är enklare att arbeta med i t.ex. sortering, grafer eller logik längre fram.
        year: parseInt(year),
        // managers innehåller ett objekt per manager, med info och statistik för just det året (year).
        managers: managers
    });
}

// Sätt det aktuella året för visning
let currentYear = groupedByYear[0].year;

// Rendera grafer för varje fråga
// renderGraph(...) returnerar en funktion som används för att uppdatera respektive graf.
const updateGigs = renderGraph(graph1, "gigs");
const updateEarnings = renderGraph(graph2, "earnings");
const updateCollaboration = renderGraph(graph3, "djs");
const updateAttendees = renderGraph(graph4, "attendees");

// Skapa knappar per år
// När du klickar:
    // currentYear uppdateras
    // Grafer uppdateras med rätt färg och data
    // .style.border sätts för att visuellt markera valt år
groupedByYear.forEach(d => {
    const year = d.year;
    const [defaultColor, selectedColor] = colorMap[year];
    renderButton(
        d.year,
        defaultColor,
        selectedColor,
        (year) => {
            currentYear = year;
            updateGigs(year, selectedColor);
            updateEarnings(year, selectedColor);
            updateAttendees(year, selectedColor);
            updateCollaboration(year, selectedColor)

            document.getElementById("graph1").style.border = `2px solid ${selectedColor}`
            document.getElementById("graph2").style.border = `2px solid ${selectedColor}`
            document.getElementById("graph3").style.border = `2px solid ${selectedColor}`
            document.getElementById("graph4").style.border = `2px solid ${selectedColor}`
        }
    );
});

// Skapar en sammanställningsknapp
const buttonCompilation = document.createElement("button");
buttonCompilation.id = "buttonCompilation";
buttonCompilation.textContent = "Sammanställning";
buttonCompilation.addEventListener("click", () => {
    // Lägg till blur på wrapper
    document.getElementById("wrapper").classList.add("blur");

    // Skapa overlay
    const overlay = document.createElement("div");
    overlay.id = "popupOverlay";

    // Lägg till i body (inte i wrapper!)
    document.body.appendChild(overlay);

    // Rendera popup i overlay
    renderPopupCompilationContainer("popupOverlay", currentYear);

    // Förhindra scroll
    document.body.classList.add("noScroll");
});
buttonContainer.appendChild(buttonCompilation);


// Hitta manager med högst intäkter det valda året.
let maxEarningsManager = null;
let maxEarnings = 0;

// Loopa genom alla managers, och spara den som tjänat mest pengar under currentYear.
datasetManagerAnalyticsData.forEach((manager) => {
    const summary = manager.summary[currentYear];
    if (summary && summary.totalEarnings > maxEarnings) {
        maxEarnings = summary.totalEarnings;
        maxEarningsManager = manager;
    }
});

// Lägger till en ny egenskap på varje manager-objekt med referens till managern med högst intäkter.
datasetManagerAnalyticsData.forEach((manager) => {
    manager.maxEarningsManager = maxEarningsManager;
});
