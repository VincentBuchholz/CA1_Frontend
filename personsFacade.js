
const URL = "https://vincehub.dk/tomcat/ca1/api/person/"


function getPersons() {
    return fetch(URL+"all")
        .then(res => res.json())
}

function getPersonByPhone(phone) {
    return fetch(URL+"phone/"+phone)
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

const personsFacade ={
    getPersons,
    getPersonByPhone
}

export default personsFacade;