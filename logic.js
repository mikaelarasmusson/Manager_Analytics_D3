const datasetManagerAnalyticsData = [];

for (let manager of Managers) {
    const managerId = manager.id;
    const managerName = manager.name;
    const managerAge = manager.age;
    const managerGender = manager.gender;
    const managerEthnicity = manager.ethnicity;
    const managerImg = manager.img;

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


    let djCollaboration = DJs.filter(dj => dj.managerID === managerId);

    if (djCollaboration.length == 0) continue;

    for (let dj of djCollaboration) {
        let gigsForThisDj = Gigs.filter(gig => gig.djID == dj.id)

        for (let gig of gigsForThisDj) {
            const year = gig.date.slice(0, 4);
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

    for (let year in dataset.gigs) {
        let gigsThisYear = dataset.gigs[year];
        let amountOfGigs = gigsThisYear.length;
        let totalEarnings = 0;
        let totalAttendees = 0;
        let unicDjsId = [];

        for (let gig of gigsThisYear) {
            totalEarnings += gig.earning;
            totalAttendees += gig.attendance;

            if (!unicDjsId.includes(gig.djId)) {
                unicDjsId.push(gig.djId);
            }
        }

        dataset.summary[year] = {
            totalGigs: amountOfGigs,
            totalEarnings: totalEarnings,
            totalAttendees: totalAttendees,
            unicDjs: unicDjsId.length
        };
    }
    datasetManagerAnalyticsData.push(dataset);
}


const groupedByYear = [];

const allYears = Object.keys(datasetManagerAnalyticsData[0].summary);

for (let year of allYears) {
    let managers = datasetManagerAnalyticsData.map(manager => {
        const summary = manager.summary[year];

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

    groupedByYear.push({
        year: parseInt(year),
        managers: managers
    });
}

let currentYear = groupedByYear[0].year;

const updateGigs = renderGraph(graph1, "gigs");
const updateEarnings = renderGraph(graph2, "earnings");
const updateCollaboration = renderGraph(graph3, "djs");
const updateAttendees = renderGraph(graph4, "attendees");

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

const buttonCompilation = document.createElement("button");
buttonCompilation.id = "buttonCompilation";
buttonCompilation.textContent = "Sammanställning";
buttonCompilation.addEventListener("click", () => {
    document.getElementById("wrapper").classList.add("blur");

    const overlay = document.createElement("div");
    overlay.id = "popupOverlay";

    document.body.appendChild(overlay);

    renderPopupCompilationContainer("popupOverlay", currentYear);

    document.body.classList.add("noScroll");
});
buttonContainer.appendChild(buttonCompilation);


let maxEarningsManager = null;
let maxEarnings = 0;

datasetManagerAnalyticsData.forEach((manager) => {
    const summary = manager.summary[currentYear];
    if (summary && summary.totalEarnings > maxEarnings) {
        maxEarnings = summary.totalEarnings;
        maxEarningsManager = manager;
    }
});
