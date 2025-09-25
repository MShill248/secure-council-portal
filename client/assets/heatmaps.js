const categorySelection = document.querySelector('#requestCategory');
const criticalCondition = document.querySelector('#critical');
const severeCondition = document.querySelector('#severe');
const moderateCondition = document.querySelector('#moderate');
const minorCondition = document.querySelector('#minor');

categorySelection.addEventListener('change', async () => {
    const response = await fetch(`http://localhost:3000/request/category/${categorySelection.value}`)
    if (!response.ok) throw new Error("Failed to fetch requests")
    const requests = await response.json()
    const { x, y } = aggregateBoroughData(requests)
    const critical = Math.max(...y)
    for(let i = 0; i < x.length; i++) {
        const selectedBorough = document.querySelector(`#${x[i]}`.replace(/ /g, ''))
        selectedBorough.classList.remove(...selectedBorough.classList)
        if(y[i] >= 0.9 * critical) selectedBorough.classList.add('critical')
        else if(y[i] >= 0.7 * critical) selectedBorough.classList.add('severe')
        else if(y[i] >= 0.4 * critical) selectedBorough.classList.add('moderate')
        else if(y[i] >= 0.1 * critical) selectedBorough.classList.add('minor')
    }
    criticalCondition.textContent = `> ${0.9*critical}`
    severeCondition.textContent = `> ${0.7*critical}`
    moderateCondition.textContent = `> ${0.4*critical}`
    minorCondition.textContent = `> ${0.1*critical}`
})

// async function aggregateBoroughData(requestData) {
//     const aggregated = {};
//     const promises = requestData.map(async (request) => {
//         const user = await getUserData(request)
//         return user
//     })
//     const users = await Promise.all(promises);
//     for (const user of users) {
//         const { borough } = user;
//         const key = `${borough}`;
//         if (!aggregated[key]) {
//             aggregated[key] = {
//                 total: 0,
//             };
//         }
//         aggregated[key].total += 1;
//     }
//     const x = [];
//     const y = [];
//     Object.entries(aggregated).forEach(entry => {
//         x.push(entry[0]); 
//         y.push(entry[1].total);                
//     });
//     return { x, y };
// };
const aggregateBoroughData = (requestData) => {
    const aggregated = {};
    requestData.forEach(request => {
        const { borough } = request;
        const key = `${borough}`;

        if (!aggregated[key]) {
        aggregated[key] = {
            total: 0,
        };
        }

        aggregated[key].total += 1;
    });
    const x = [];
    const y = [];
    Object.entries(aggregated).forEach(entry => {
        x.push(entry[0]); 
        y.push(entry[1].total);                  
    });

    return { x, y };
};

async function getUserData(request) {
        const {user_id} = request;
        const response = await fetch(`http://localhost:3000/user/${user_id}`)
        if (!response.ok) throw new Error("Failed to fetch user details")
        return await response.json();
}
