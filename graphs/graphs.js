function renderGraphsContainer(parent) {
    let parentId = document.getElementById(parent);

    let container = document.createElement("div");
    container.id = "graphContainer";
    parentId.append(container);

    let contentArray = [
        { graphID: "graph1", graphText: "Hur många gigs bokade varje manager under det valda året?" },
        { graphID: "graph2", graphText: "Hur mycket intäkter genererade varje manager under det valda året?" },
        { graphID: "graph3", graphText: "Hur många olika DJs har managern jobbat med under året? (Antal DJs)" },
        { graphID: "graph4", graphText: "Hur stor totalpublik drog varje manager under det valda året? (Med hjälp av sina DJs)" },
    ];

    for (let i = 0; i < contentArray.length; i++) {
        let graphDivContainer = document.createElement("div");
        graphDivContainer.className = "graphDivContainer";
        container.append(graphDivContainer);

        let text = document.createElement("p");
        text.innerHTML = `${contentArray[i].graphText}`;
        graphDivContainer.append(text);

        let graphDiv = document.createElement("div");
        graphDiv.id = `${contentArray[i].graphID}`;
        graphDivContainer.append(graphDiv);
    }
}

renderGraphsContainer("mainContainer");

const graph1 = document.getElementById("graph1");
const graph2 = document.getElementById("graph2");
const graph3 = document.getElementById("graph3");
const graph4 = document.getElementById("graph4");

// Storlekar av svg
const svgWidth = 600;
const svgHeight = 400;
const paddingSides = 70;
const paddingBottom = 70;

// Färgkarta för knapparna, återanvänds för graferna senare så att graferna är baserade på årets färg.
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


// Skapar en graf i det angivna parent-elementet (t.ex. "graph1").
// metric är den data som ska visas: "gigs", "earnings", etc.
function renderGraph(parent, metric) {
    // Tar första året i datan, samt dess färg.
    const firstYear = groupedByYear[0].year;
    const [, initialColor] = colorMap[firstYear];

    // Skapar ett nytt <svg>-element där grafen ska ritas.
    const svg = d3.select(parent)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);


    // Lägger till ett textfält med året uppe i hörnet av grafen.
    svg.append("text")
        .attr("x", svgWidth - 40)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", initialColor)
        .attr("font-size", "24px")
        .attr("font-family", "quantico-bold")
        .text(firstYear);

    // xScale: används för att placera staplar (en stapel per manager).
    const xScale = d3.scaleBand()
        .range([paddingSides, svgWidth - paddingSides])
        .padding(0.2);

    // yScale: avgör staplarnas höjd beroende på värde.
    const yScale = d3.scaleLinear()
        .range([svgHeight - paddingBottom, paddingSides]);

    // xAxisGroup hamnar längst ner (x-axel), yAxisGroup till vänster.
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${svgHeight - paddingBottom})`)

    const yAxisGroup = svg.append("g")
        .attr("transform", `translate(${paddingSides}, 0)`)

    // Uppdaterar grafen för det första året med all konfiguration ovan.
    updateBarChart(firstYear, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, initialColor);

    xAxisGroup.selectAll("path, line").attr("stroke", "white");
    xAxisGroup.selectAll("text").attr("fill", "white")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dy", "0.25em")
        .attr("font-family", "quantico-bold");

    yAxisGroup.selectAll("path, line").attr("stroke", "white");
    yAxisGroup.selectAll("text").attr("fill", "white");

    document.getElementById("graph1").style.border = `2px solid ${initialColor}`
    document.getElementById("graph2").style.border = `2px solid ${initialColor}`
    document.getElementById("graph3").style.border = `2px solid ${initialColor}`
    document.getElementById("graph4").style.border = `2px solid ${initialColor}`

    // Returnerar en funktion som kan uppdatera grafen när ett nytt år väljs.
    return (year, color) => updateBarChart(year, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color);
}

// Den här funktionen ritar själva staplarna (bars) och uppdaterar dem när användaren byter år.
// Denna funktion ansvarar för att:
// Rita stapeldiagram (bars) för ett valt år (selectedYear),
// Binda rätt data till varje stapel (via D3),
// Animera uppdateringar (transition),
// Hantera musinteraktion (hover = highlight + visa värde),
// Rita etiketter för 0-värden.
function updateBarChart(selectedYear, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color) {
    // 1. Hämta data för valt år, om det inte finns något så blir det undefined eller en tom array utan att krascha.
    const data = groupedByYear.find(d => d.year === selectedYear)?.managers || [];

    // x: namn på managers.
    xScale.domain(data.map(d => d.name));

    // y: maxvärde för datan + 10 % för luft ovanför staplar.
    const maxValue = d3.max(data, d => d[metric]) || 1;
    yScale.domain([0, maxValue * 1.1]);

    // D3 binder data till <rect>-element – varje manager får en stapel.
    const bars = svg.selectAll("rect").data(data, d => d.name);

    // Uppdatera året till det valda året.
    svg.select("text").attr("fill", color).text(selectedYear);

    // Animera till nya värden för aktuellt år.
    bars.transition()
        .duration(500)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]))
        .attr("fill", color)
        .attr("data-original-fill", color);

    // Staplar som inte finns ännu skapas här.
    bars.enter()
        .append("rect")
        // d är datan för stapeln du hovrar över (en manager).
        // this är stapeln.
        .on("mouseover", function (event, d) {
            const currentColor = d3.select(this).attr("data-original-fill");

            // I D3-eventhandlers (som .on("mouseover", ...)) pekar this på det DOM-element som användaren interagerar med.
            // I det här fallet är this en <rect> – alltså en stapel i diagrammet.
            d3.select(this.parentNode).selectAll("rect")
                .transition().duration(200)
                // Vi jämför alla staplar med d.name för att avgöra om de ska lysa upp eller tonas ned.
                .attr("fill", bar => bar.name === d.name
                    // ? : Den fungerar som en kortform för if-else.
                    // Här står samma sak som: 
                    // if (bar.name === d.name) {
                    //      return d3.color(currentColor).brighter(1);
                    // } else {
                    //      return d3.color(currentColor).darker(1.5);
                    // }
                    // Den stapel du hovrar på blir ljusare (highlight).
                    // De andra blir mörkare (tonas ned).
                    ? d3.color(currentColor).brighter(1)
                    : d3.color(currentColor).darker(1.5));

            d3.select(this.parentNode)
                .append("text")
                .attr("class", "bar-value")
                // xScale är en band scale – används när du har kategorier, t.ex. namn på managers.
                // Returnerar bredden för varje “band” (dvs. varje stapel i diagrammet).
                // Beräknas automatiskt baserat på:
                // antalet kategorier (t.ex. managers),
                // tillgängligt utrymme (svgWidth),
                // padding (mellan staplar).
                // Om du har 5 managers och en range på 500px, får varje stapel kanske 80px bredd med lite luft mellan.
                .attr("x", xScale(d.name) + xScale.bandwidth() / 2)
                .attr("y", yScale(d[metric]) - 10)
                .attr("opacity", 0)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-size", "14px")
                // datan vi vill visa, t.ex. 500 gigs eller 12000 intäkter
                .text(d[metric])
                .transition()
                .duration(200)
                .attr("opacity", 1);
        }).on("mouseout", function (event, d) {
            d3.select(this.parentNode).selectAll("rect")
                .transition().duration(200)
                .attr("fill", function () {
                    return d3.select(this).attr("data-original-fill");
                });

            d3.select(this.parentNode).selectAll(".bar-value")
                .transition()
                .duration(200)
                .attr("opacity", 0)
                .remove();
        })
        .attr("x", d => xScale(d.name))
        .attr("y", yScale(0))
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", color)
        // Stapeln “växer uppåt” från height: 0 till rätt höjd.
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]))
        .attr("fill", color)
        .attr("data-original-fill", color);

    svg.selectAll(".zero-label").remove();

    // Om ett värde är 0 blir det ingen stapel.
    // Därför visas en "0"-etikett istället – annars skulle det se ut som att manager saknas.
    svg.selectAll(".zero-label")
        .data(data.filter(d => d[metric] === 0), d => d.name)
        .enter()
        .append("text")
        .attr("class", "zero-label")
        .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d[metric]) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .text("0");

    // Om en stapel inte längre ska finnas (försvann från datan) → den animeras bort snyggt.
    bars.exit()
        .transition()
        .duration(300)
        .attr("y", yScale(0))
        .attr("height", 0)
        .remove();

    xAxisGroup.call(d3.axisBottom(xScale));
    yAxisGroup.call(d3.axisLeft(yScale)
        .ticks(5))

    xAxisGroup.selectAll("path, line").attr("stroke", "white");
    xAxisGroup.selectAll("text").attr("fill", "white")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dy", "0.25em");

    yAxisGroup.selectAll("path, line").attr("stroke", "white");
    yAxisGroup.selectAll("text").attr("fill", "white");
}







