
const URL = "https://vincehub.dk/tomcat/ca1/api/person/"


function getPersons() {
    return fetch(URL+"all")
        .then(res => res.json())
}

function getPersonByPhone(phone) {
    return fetch(URL+"phone/"+phone)
        .then(handleHttpErrors)
}

function createPerson(person){
    const options = makeOptions("POST",person)
    return fetch(URL,options)
        .then(handleHttpErrors)
}

function addPhone(id,phone){
    const options = makeOptions("POST",phone)
    return fetch(URL+"addphone/"+id,options)
        .then(handleHttpErrors)
}

function addHobby(personID,hobbyID){
    const options = makeOptions("PUT")
    return fetch(URL+"addhobby/"+personID +"/"+hobbyID,options)
        .then(handleHttpErrors)
}

function editPerson(personID,person) {
    const options = makeOptions("PUT",person)
    return fetch(URL+"edit/"+personID,options)
}

function editAddress(personID,address) {
    const options = makeOptions("PUT",address)
    return fetch(URL+"editaddress/"+personID,options)
}

function removeHobby(userID,hobbyID){
    console.log("Userid: "+userID +" Hobbyid: "+ hobbyID)
    const options = makeOptions("DELETE")
    return fetch(URL+"removehobby/"+userID+"/"+hobbyID,options)
        .then(handleHttpErrors)
}

function removePhone(phoneID){
    const options = makeOptions("DELETE")
    return fetch(URL+"deletephone/"+phoneID,options)
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
    getPersonByPhone,
    createPerson,
    addPhone,
    addHobby,
    editPerson,
    editAddress,
    removeHobby,
    removePhone
}

export default personsFacade;