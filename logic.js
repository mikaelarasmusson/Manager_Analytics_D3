const datasetManagerAnalyticsData = [];

const managerCompilation = [
    { managerName: "", gender: "", ethnicity: "", age: "", bookedGigs: "", totalEarnings: "", bookedDJs: "", totalAttendees: "" }
];

// let managerID = Managers.map(element => element.id);
// let managerName = Managers.map(element => element.name);
// console.log(managerID);
// console.log(managerName);
// const bookedGigsDataset = [
//     {managerID: "", managerName: "", djID: "", numberOfGigs: "", year: "", specificSumOfGigs: ""}
// ];

// Filtrera fram managers som är kopplade till en DJ
for (let manager of Managers) {
    const managerId = manager.id;
    const managerName = manager.name;

    const dataset = {
        managerId: managerId,
        managerName: managerName,
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
        summary: {}  // Här läggs årsstatistiken in
    };

    let djCollaboration = DJs.find(dj => dj.managerID === managerId);
    if (!djCollaboration) continue;

    let managerGigs = Gigs.filter(gig => gig.djID === djCollaboration.id);

    for (let gig of managerGigs) {
        const year = gig.date.slice(0, 4);
        if (dataset.gigs[year]) {
            dataset.gigs[year].push({
                date: gig.date,
                earning: gig.managerEarnings,
                attendance: gig.attendance
            });
        }
    }

    // Beräkna statistik per år
    for (let year in dataset.gigs) {
        let gigsThisYear = dataset.gigs[year];
        let amountOfGigs = gigsThisYear.length;
        let totalEarnings = 0;
        let totalAttendees = 0;

        for (let gig of gigsThisYear) {
            totalEarnings += gig.earning;
            totalAttendees += gig.attendance;
        }

        dataset.summary[year] = {
            totalGigs: amountOfGigs,
            totalEarnings: totalEarnings,
            totalAttendees: totalAttendees
        };
    }

    datasetManagerAnalyticsData.push(dataset);
}


console.log("all data", datasetManagerAnalyticsData);


const groupedByYear = [];

const allYears = Object.keys(datasetManagerAnalyticsData[0].summary); // t.ex. "2015"–"2024"

for (let year of allYears) {
    let managers = datasetManagerAnalyticsData.map(manager => {
        const summary = manager.summary[year];
        return {
            name: manager.managerName,
            earnings: summary?.totalEarnings || 0,
            gigs: summary?.totalGigs || 0,
            attendees: summary?.totalAttendees || 0
        };
    });

    groupedByYear.push({
        year: parseInt(year),
        managers: managers
    });
}


console.log("groupbyYear", groupedByYear)






// D3.js: skapa grundgraf

// const graph1 = document.getElementById("graph1");
// const graph2 = document.getElementById("graph2");
// const graph3 = document.getElementById("graph3");

// const svgWidth = 600;
// const svgHeight = 400;
// const paddingSides = 40;
// const paddingBottom = 100;


// const svg = d3.select(graph1)
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// const xScale = d3.scaleBand()
//     .range([paddingSides, svgWidth - paddingSides])
//     .padding(0.2);

// const yScale = d3.scaleLinear()
//     .range([svgHeight - paddingBottom, paddingSides]);

// const xAxisGroup = svg.append("g")
//     .attr("transform", `translate(0, ${svgHeight - paddingBottom})`);

// const yAxisGroup = svg.append("g")
//     .attr("transform", `translate(${paddingSides}, 0)`);

// // Render initialt år (första i listan)
// //skicka med en grafid här
// updateBarChart(groupedByYear[0].year, "white");



// function updateBarChart(selectedYear, color, graph) {
//     const data = groupedByYear.find(d => d.year === selectedYear)?.managers || [];

//     xScale.domain(data.map(d => d.name));
//     yScale.domain([0, d3.max(data, d => d.gigs) || 1]); // undvik max 0

//     const bars = svg.selectAll("rect").data(data, d => d.name);

//     // Uppdatera existerande staplar
//     bars.transition()
//         .duration(500)
//         .attr("x", d => xScale(d.name))
//         .attr("y", d => yScale(d.gigs))
//         .attr("width", xScale.bandwidth())
//         .attr("height", d => svgHeight - paddingBottom - yScale(d.gigs))
//         .attr("fill", color);

//     // Lägg till nya staplar
//     bars.enter()
//         .append("rect")
//         .attr("x", d => xScale(d.name))
//         .attr("y", yScale(0))
//         .attr("width", xScale.bandwidth())
//         .attr("height", 0)
//         .attr("fill", color)
//         .transition()
//         .duration(500)
//         .attr("y", d => yScale(d.gigs))
//         .attr("height", d => svgHeight - paddingBottom - yScale(d.gigs));

//     // Ta bort gamla staplar
//     bars.exit()
//         .transition()
//         .duration(300)
//         .attr("y", yScale(0))
//         .attr("height", 0)
//         .remove();

//     // Uppdatera axlar
//     xAxisGroup.call(d3.axisBottom(xScale));
//     yAxisGroup.call(d3.axisLeft(yScale));
// }


//Hämta alla grafID:s
const graph1 = document.getElementById("graph1");
const graph2 = document.getElementById("graph2");
const graph3 = document.getElementById("graph3");
const graph4 = document.getElementById("graph4");

//Definiera grafikens mått och padding
const svgWidth = 600;
const svgHeight = 400;
const paddingSides = 40;
const paddingBottom = 100;

//Skapa en färgkarta för varje år
const colorMap = {
    "2015": ["#FF7EFF", "#EF00EF"],
    "2016": ["#7EFF8D", "#00C217"],
    "2017": ["#FF7E7E", "#CD3838"],
    "2018": ["#7EABFF", "#3064C5"],
    "2019": ["#FFE37E", "#EFC839"],
    "2020": ["#7EFFF9", "#4ED2CB"],
    "2021": ["#967EFF", "#5342A3"],
    "2022": ["#FF2428", "#B30C0F"],
    "2023": ["#FF5CB3", "#C60C6F"],
    "2024": ["#AEFF00", "#689801"]
};

function renderGraph(parent, metric) {
    const svg = d3.select(parent)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);


    //skapa skalor och axlar

    const xScale = d3.scaleBand()
        .range([paddingSides, svgWidth - paddingSides])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .range([svgHeight - paddingBottom, paddingSides]);

    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${svgHeight - paddingBottom})`);

    const yAxisGroup = svg.append("g")
        .attr("transform", `translate(${paddingSides}, 0)`);

    //Rita första grafen med första årets data och färg
    const firstYear = groupedByYear[0].year;
    const [, initialColor] = colorMap[firstYear];
    updateBarChart(firstYear, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, initialColor);

    // Den returnerar en funktion som tar två argument: year och color, och anropar funktionen updateBarChart(...)
    // med dessa samt andra parametrar som redan finns i kontexten (t.ex. xScale, yScale, svg, metric osv).
    return (year, color) => updateBarChart(year, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color);
}

/*Skapar en funktion som du senare kan använda för att uppdatera en specifik graf (med rätt metric, svg, skalor m.m. förinställda), bara genom att ge den ett nytt year och color.

Det är ett sätt att kapsla logik och undvika att upprepa kod – mycket vanligt i interaktiv datavisualisering med D3.js.*/


//Uppdatera staplarna i grafen när man filtrera
function updateBarChart(selectedYear, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color) {
    const data = groupedByYear.find(d => d.year === selectedYear)?.managers || [];

    xScale.domain(data.map(d => d.name));
    yScale.domain([0, d3.max(data, d => d[metric]) || 1]);

    const bars = svg.selectAll("rect").data(data, d => d.name);

    bars.transition()
        .duration(500)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]))
        .attr("fill", color);

    bars.enter()
        .append("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", yScale(0))
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", color)
        .transition()
        .duration(500)
        .attr("y", d => yScale(d[metric]))
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]));

    // Ta bort staplar som inte längre behövs.
    bars.exit()
        .transition()
        .duration(300)
        .attr("y", yScale(0))
        .attr("height", 0)
        .remove();

    xAxisGroup.call(d3.axisBottom(xScale));
    yAxisGroup.call(d3.axisLeft(yScale));
}


//Skapa de tre graferna
//Var och en får en update-funktion så vi kan ändra grafen när ett år väljs.

const updateGigs = renderGraph(graph1, "gigs");
const updateEarnings = renderGraph(graph2, "earnings");
const updateAttendees = renderGraph(graph4, "attendees");


//Skapa knappar för varje år med renderButton()
groupedByYear.forEach(d => {
    const year = d.year;
    const [defaultColor, selectedColor] = colorMap[year];
    renderButton(
        d.year,
        defaultColor,
        selectedColor,
        (year) => {
            updateGigs(year, selectedColor);
            updateEarnings(year, selectedColor);
            updateAttendees(year, selectedColor);
        }
    );
});














