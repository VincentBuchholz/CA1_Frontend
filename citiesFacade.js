
const URL = "https://vincehub.dk/tomcat/ca1/api/person/"


function getCities() {
    return fetch(URL+"zip/all")
        .then(res => res.json())
}

function getPersonsByZip(zip) {
    return fetch(URL+"zip/"+zip)
        .then(handleHttpErrors)
}

function makeOptions(method, body) {
    var opts =  {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if(body){
        opts.body = JSON.stringify(body);
    }
    return opts;
}


function handleHttpErrors(res){
    if(!res.ok){
        return Promise.reject({status: res.status, fullError: res.json() })
    }
    return res.json();
}

const citiesFacade ={
    getCities,
    getPersonsByZip
}

export default citiesFacade;