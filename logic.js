const datasetManagerAnalyticsData = [];

const managerCompilation = [
    {managerName: "", gender: "", ethnicity: "", age: "", bookedGigs: "", totalEarnings: "", bookedDJs: "", totalAttendees: ""}
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
    const dataset = {
        id: managerId,
        djCollaboration: DJs.find(dj => dj.managerID == managerId),
        gigs: [], 
        year: "",
        managerEarnings: "",
        attendance: "",
    }

    let managerGigs = Gigs.filter(dj => dj.djID == dataset.djCollaboration.id);
    managerGigs.map((gig => {

    }))

    dataset.gigs.push(managerGigs);
    datasetManagerAnalyticsData.push(dataset);
}

console.log(datasetManagerAnalyticsData);

// Från chatgpt
// managerGigs = managerGigs.map(gig => {
//   return {
//     date: gig.date,
//     djID: gig.djID,
//     cost: gig.cost,
//     // ...alla andra fält du vill behålla
//     year: gig.date.slice(0, 4)
//   };
// });