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


const svgWidth = 600;
const svgHeight = 400;
const paddingSides = 70;
const paddingBottom = 70;


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
    const firstYear = groupedByYear[0].year;
    const [, initialColor] = colorMap[firstYear];

    const svg = d3.select(parent)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);


    svg.append("text")
        .attr("x", svgWidth - 40)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", initialColor)
        .attr("font-size", "24px")
        .attr("font-family", "quantico-bold")
        .text(firstYear);

    const xScale = d3.scaleBand()
        .range([paddingSides, svgWidth - paddingSides])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .range([svgHeight - paddingBottom, paddingSides]);

    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${svgHeight - paddingBottom})`)

    const yAxisGroup = svg.append("g")
        .attr("transform", `translate(${paddingSides}, 0)`)

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

    return (year, color) => updateBarChart(year, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color);
}


function updateBarChart(selectedYear, xScale, yScale, svg, xAxisGroup, yAxisGroup, metric, color) {
    const data = groupedByYear.find(d => d.year === selectedYear)?.managers || [];

    xScale.domain(data.map(d => d.name));

    const maxValue = d3.max(data, d => d[metric]) || 1;
    yScale.domain([0, maxValue * 1.1]);

    const bars = svg.selectAll("rect").data(data, d => d.name);

    svg.select("text").attr("fill", color).text(selectedYear);

    bars.transition()
        .duration(500)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]))
        .attr("fill", color)
        .attr("data-original-fill", color);

    bars.enter()
        .append("rect")
        .on("mouseover", function (event, d) {
            const currentColor = d3.select(this).attr("data-original-fill");

            d3.select(this.parentNode).selectAll("rect")
                .transition().duration(200)
                .attr("fill", bar => bar.name === d.name
                    ? d3.color(currentColor).brighter(1)
                    : d3.color(currentColor).darker(1.5));

            d3.select(this.parentNode)
                .append("text")
                .attr("class", "bar-value")
                .attr("x", xScale(d.name) + xScale.bandwidth() / 2)
                .attr("y", yScale(d[metric]) - 10)
                .attr("opacity", 0)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-size", "14px")
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
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => svgHeight - paddingBottom - yScale(d[metric]))
        .attr("fill", color)
        .attr("data-original-fill", color);

    svg.selectAll(".zero-label").remove();

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