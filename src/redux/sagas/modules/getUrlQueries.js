function getUrlQueries(url, queryObject){
    if(!queryObject) return url;
    const queries = Object.entries(queryObject);
    if(queries.length){
        url += `?${queries[0][0]}=${queries[0][1]}`;
        for(let i=1; i < queries.length; i++){
            const key = queries[i];
            url += `&${key[0]}=${key[1]}`;
        }
    }
    return url;
}

export default getUrlQueries;