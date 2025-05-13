function renderGraphsContainer (parent) {
    let parentId = document.getElementById("mainContainer");

    let container = document.createElement("div");
    container.id = "graphContainer";
    parentId.append(container);

    let contentArray = [
        {graphID: "graph1", graphText: "Hur många gigs bokade varje manager under det valda året?"},
        {graphID: "graph2", graphText: "Hur mycket intäkter genererade varje manager under det valda året?"},
        {graphID: "graph3", graphText: "Hur många kända DJs bokade varje manager under det valda året?"},
        {graphID: "graph4", graphText: "Hur stor totalpublik drog varje manager under det valda året?"},
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