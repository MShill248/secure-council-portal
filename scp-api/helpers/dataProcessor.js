const aggregateRequestData = (requestData) => {
    const aggregated = {};
    requestData.forEach(request => {
      const { category } = request;
      const key = `${category}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          total: 0,
        };
      }
  
      aggregated[key].total += 1;
    });
  
    const x = [];
    const y = [];
    console.log(aggregated['waste-collection']);
    Object.entries(aggregated).forEach(entry => {
      x.push(entry[0]); 
      y.push(entry[1].total);                  
    });
  
    return { x, y };
  };

module.exports = {
    aggregateRequestData,
}