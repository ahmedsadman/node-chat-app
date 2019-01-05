const getUrlParameters = (uri = window.location.search) => {
    const queryString = {};
    uri.replace(new RegExp('([^?=&]+)(=([^&#]*))?', 'g'), ($0, $1, $2, $3) => {
        queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
    });
    return queryString;
};
