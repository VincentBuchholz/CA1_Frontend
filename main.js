import './style.css'
import "bootstrap/dist/css/bootstrap.css"
import citiesFacade from "./citiesFacade";
import personsFacade from "./personsFacade";
import hobbiesFacade from "./hobbiesFacade";

//JS for cities
let cities = citiesFacade.getCities().then(cities => {
    const cityRows = cities.map(city => `
<tr>
    <td>${city.zip}</td>
    <td>${city.city}</td>
</tr>`);

    document.querySelector("#citiesTable").innerHTML = cityRows.join("");
});

const SEARCHZIPBTN = document.querySelector("#searchZipBTN")
SEARCHZIPBTN.addEventListener("click", getPersonsByZip)

const zipAlert = document.querySelector("#searchZipError");
const searchZipTable = document.querySelector("#searchZipTable");

function getPersonsByZip() {

    let zip = document.querySelector("#zipInput").value

    citiesFacade.getPersonsByZip(zip).then(persons => {
        const personRows = persons.map(person => `
<tr>
    <td>${person.fName}</td>
    <td>${person.lName}</td>
    <td>${person.email}</td>
</tr>`);
        searchZipTable.style = "display"
        zipAlert.style = "display:none"
        document.querySelector("#personsZipTable").innerHTML = personRows.join("");
    }).catch(err =>{
        if(err.status){
            err.fullError.then(e=> {
                zipAlert.innerText = e.message;
                zipAlert.style = "display:block"
                searchZipTable.style = "display:none"
            })
        }
        else{console.log("Network error"); }
    });
}


//JS for persons
getPersons()

document.querySelector("#personsTable").addEventListener("click",getPersonByPhoneInfo)

function getPersonByPhoneInfo(e){
        const target = e.target;
        if(target.value) {
            getPersonByPhone(target.value);
            hideAllShowOne("searchPage");
        }
}

function getPersons() {
    console.log("test get persons")
    personsFacade.getPersons().then(persons => {
        const personRows = persons.map(person => `
<tr>
    <td>${person.fName}</td>
    <td>${person.lName}</td>
    <td>${person.email}</td>
    <td><button type="button" class="btn-primary rounded float-end" value="${person.phones[0].nr}">Info</button></td>
</tr>`);

        document.querySelector("#personsTable").innerHTML = personRows.join("");
    });
}
const ADDPHONEBTN = document.querySelector("#addPhoneBTN");
const openAddPhoneModalBTN = document.querySelector("#openAddPhoneModalBTN");
ADDPHONEBTN.addEventListener("click",addPhone);

openAddPhoneModalBTN.addEventListener("click",function(){document.querySelector("#phoneSuccess").style="display:none;"});




const PHONETABLE = document.querySelector("#phones")
PHONETABLE.addEventListener("click",removePhone)

function addPhone() {
    let userID = document.querySelector("#addPhoneBTN").value;
    let number= document.querySelector("#addPhoneNr").value;
    let desc = document.querySelector("#addPhoneDesc").value;
    if(number && desc) {
        let person = {
            phones: [
                {
                    nr: number,
                    desc: desc
                }
            ]
        }
        personsFacade.addPhone(userID, person).then(user => {
            document.querySelector("#phoneSuccess").style="display:block;"
            document.querySelector("#addPhoneNr").value = null;
            document.querySelector("#addPhoneDesc").value = null;
        }).catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.msg))
            } else {
                console.log("Network error");
            }
        })
        setTimeout(updatAfterEdit, 300)
    }
}
function removePhone(e){
    const target = e.target;
    if (target.value) {
        if (document.querySelector("#phones").rows.length > 1) {
            let phoneID = target.value;
            personsFacade.removePhone(phoneID).then(user => console.log(user)).catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log("Network error");
                }
            })
        } else {
            document.querySelector("#removePhoneError").style = "display:block"
            setTimeout(function () {
                document.querySelector("#removePhoneError").style = "display:none"
            }, 3000)
        }
        setTimeout(updatAfterEdit, 300)
    }
}

const ADDHOBBYBTN = document.querySelector("#addHobbyBTN");
ADDHOBBYBTN.addEventListener("click",addHobby);

function addHobby() {
    let userID = document.querySelector("#addPhoneBTN").value;
    let hobbyID = document.querySelector("#selectAddHobby").value;
    personsFacade.addHobby(userID,hobbyID).then(user => console.log(user)).catch(err => {
        if (err.status) {
            err.fullError.then(e => console.log(e.msg))
        } else {
            console.log("Network error");
        }
    })
    setTimeout(updatAfterEdit,300)
}

const HOBBYTABLE = document.querySelector("#hobby")
HOBBYTABLE.addEventListener("click",removeHobby)


function removeHobby(e) {
    const target = e.target;
    let hobbyID = target.value;
    let userID = document.querySelector("#addPhoneBTN").value;
    personsFacade.removeHobby(userID,hobbyID).then(user => console.log(user)).catch(err => {
        if (err.status) {
            err.fullError.then(e => console.log(e.msg))
        } else {
            console.log("Network error");
        }
    })
    setTimeout(updatAfterEdit,300)
}


//JS for create person
citiesFacade.getCities().then(cities => {
    let cityRows = cities.map(city => `    
    <option value="${city.id}">${city.zip} - ${city.city}</option>
    `);
    cityRows.unshift("<option selected value='0'>Choose city</option>")
    document.querySelector("#selectZip").innerHTML = cityRows.join("");
});


hobbiesFacade.getHobbies().then(hobbies => {
    let hobbyRows = hobbies.map(hobby => `    
    <option value="${hobby.id}">${hobby.name} - ${hobby.desc}</option>
    `);
    hobbyRows.unshift("<option selected value='0'>Choose hobby</option>")
    document.querySelector("#selectHobby").innerHTML = hobbyRows.join("");
    document.querySelector("#selectAddHobby").innerHTML = hobbyRows.join("");
    document.querySelector("#searchHobby").innerHTML = hobbyRows.join("");
});

const CREATEPERSONBTN = document.querySelector("#createPersonBTN")
const CREATEPERSONMODALBTN = document.querySelector("#createPersonModalBTN")

CREATEPERSONBTN.addEventListener("click", createPerson)
CREATEPERSONMODALBTN.addEventListener("click", function (){document.querySelector("#createPersonSuccess").style="display:none;"})

const CLOSEMODALBTN = document.querySelector("#closeModalBTN");
CLOSEMODALBTN.addEventListener("click",getPersons);

function createPerson() {
    let person = {
        fName: document.querySelector("#createfName").value,
        lName: document.querySelector("#createlName").value,
        email: document.querySelector("#createEmail").value,
        hobbies: [
            {
                id: document.querySelector("#selectHobby").value
            }
        ],

        phones: [
            {
                nr: document.querySelector("#createPhoneNr").value,
                desc: document.querySelector("#createPhoneDesc").value
            }
        ],
        address: {
            street: document.querySelector("#createStreet").value,
            info: document.querySelector("#createHouseNr").value,
            cityInfo: {
                id: document.querySelector("#selectZip").value
            }
        }
    }
    personsFacade.createPerson(person).then(user => {
        const personSuccessAlert = document.querySelector("#createPersonSuccess");
        personSuccessAlert.style="display";
        document.querySelector("#createfName").value=null
        document.querySelector("#createlName").value=null
        document.querySelector("#createEmail").value=null
        document.querySelector("#selectHobby").value=0
        document.querySelector("#createPhoneNr").value=null
        document.querySelector("#createPhoneDesc").value=null
        document.querySelector("#createStreet").value=null
        document.querySelector("#createHouseNr").value=null
        document.querySelector("#selectZip").value=0
    }).catch(err => {
        if (err.status) {
            err.fullError.then(e => console.log(e.message))
        } else {
            console.log("Network error");
        }
    })
    setTimeout(getPersons,1000)

}

//JS for Search

    const SEARCHBTN = document.querySelector("#searchBTN")
    SEARCHBTN.addEventListener("click", getPersonByPhoneSearch)

function getPersonByPhoneSearch(){
    let phone = document.querySelector("#phoneNumber").value;
    getPersonByPhone(phone);
}

function getPersonByPhone(phone) {
    personsFacade.getPersonByPhone(phone).then(person => {
            document.querySelector("#fName").value = `${person.fName}`;
            document.querySelector("#lName").value = `${person.lName}`;
            document.querySelector("#email").value = `${person.email}`;
            document.querySelector("#street").value = `${person.address.street}`;
            document.querySelector("#houseNr").value = `${person.address.info}`;
            document.querySelector("#zip").value = `${person.address.cityInfo.zip}`;
            document.querySelector("#city").value = `${person.address.cityInfo.city}`;
            document.querySelector("#addPhoneBTN").value = person.id;
            document.querySelector("#openGoogle").href= `https://www.google.com/maps/search/?api=1&query=${person.address.street}+${person.address.info}+${person.address.cityInfo.zip}`;
            let phoneRows = person.phones.map(phone => {
                return `
        <tr>
            <td>${phone.nr}</td>
            <td>${phone.desc}</td>
            <td><button type="button" class="btn-danger rounded float-end" value="${phone.id}">Remove</button></td>
        </tr>
            `
            })
            document.querySelector("#editfName").value = person.fName;
            document.querySelector("#editlName").value = person.lName;
            document.querySelector("#editEmail").value = person.email;
            document.querySelector("#editStreet").value = person.address.street;
            document.querySelector("#editHouseNr").value = person.address.info;

        citiesFacade.getCities().then(cities => {
            let cityRows = cities.map(city => `    
    <option value="${city.id}">${city.zip} - ${city.city}</option>
    `);
            cityRows.unshift(`<option selected value="${person.address.cityInfo.id}">${person.address.cityInfo.zip} - ${person.address.cityInfo.city}</option>`)
            document.querySelector("#selectEditZip").innerHTML = cityRows.join("");
        });

        const EDITINFORMATIONBTN = document.querySelector("#editPersonBTN");
        EDITINFORMATIONBTN.addEventListener("click",editPersonAddress);

        function editPersonAddress() {
            let personID = document.querySelector("#addPhoneBTN").value
            let person ={
                fName: document.querySelector("#editfName").value,
                lName: document.querySelector("#editlName").value,
                email: document.querySelector("#editEmail").value
            }

            let address ={
                address:{
                    street: document.querySelector("#editStreet").value,
                    info: document.querySelector("#editHouseNr").value,
                    cityInfo: {
                        id: document.querySelector("#selectEditZip").value
                    }
                }
            }


            personsFacade.editPerson(personID,person).then(user => console.log(user)).catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log("Network error");
                }
            })

            personsFacade.editAddress(personID,address).then(user => console.log(user)).catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log("Network error");
                }
            })
            const editSuccessAlert = document.querySelector("#editSuccess");
            editSuccessAlert.style="display";

            setTimeout(updatAfterEdit,1000)

        }



            document.querySelector("#phones").innerHTML = phoneRows.join("");

            let hobbyRows = person.hobbies.map(hobby => {
                return `
            <tr>
                <td>${hobby.name}</td>
                <td>${hobby.desc}</td>
                <td><button type="button" class="btn-danger rounded float-end" value="${hobby.id}"> Remove</button></td>
            </tr>
            `
            });
            document.querySelector("#hobby").innerHTML = hobbyRows.join("");
            hideAllShowOne("searchPage");
        }).catch(err => {
        if (err.status) {
            err.fullError.then(e => {
                 document.querySelector("#phoneNotFoundMsg").innerText = e.message;
                 document.querySelector("#phoneNotFound").style ="display:block;"

                setTimeout(function () {
                    document.querySelector("#phoneNotFound").style = "display:none"
                }, 3000)
            })
        } else {
            console.log("Network error");
        }
    })
    }

function updatAfterEdit(){
    let phone = document.querySelector("#phones").rows[0].cells[0].innerText
    getPersonByPhone(phone);
}

    //JS for hobbiespage

getAllHobbies();

    function getAllHobbies() {

        hobbiesFacade.getHobbies().then(hobbies =>{
            let hobbyRows = hobbies.map(hobby =>{




                return `
                <tr>
                 <td>${hobby.name}</td>
                 <td>${hobby.desc}</td>
                </tr>
                `
            })


            document.querySelector("#hobbiesTable").innerHTML = hobbyRows.join("");
        })
    }

    const SEARCHHOBBYBNT = document.querySelector("#searchHobbyBTN");
    SEARCHHOBBYBNT.addEventListener("click",getAmountPerHobby);

    function getAmountPerHobby() {
        let hobbyID = document.querySelector("#searchHobby").value;
        hobbiesFacade.getAmountOfPersons(hobbyID).then(amount =>{
            document.querySelector("#searchHobbyAmount").value = `Amount: ${amount.amount}`;
        })
    }








    //JS for navigation:

    function hideAllShowOne(idToShow) {
    if(idToShow) {
        document.getElementById("startPage").style="display:none;"
        document.getElementById("citiesPage").style="display:none;"
        document.getElementById("personsPage").style="display:none;"
        document.getElementById("hobbiesPage").style="display:none;"
        document.getElementById("searchPage").style="display:none;"
        document.getElementById("apiPage").style="display:none;"
        document.querySelector("#home").classList.remove("active");
        document.querySelector("#cities").classList.remove("active");
        document.querySelector("#persons").classList.remove("active");
        document.querySelector("#hobbies").classList.remove("active");
        document.querySelector("#api").classList.remove("active");
        document.getElementById(idToShow).style = "display:block"
        if(idToShow === "startPage"){
            document.querySelector("#home").classList.add("active")
        }
    }
    }

    function menuItemClicked(evt) {
        const id = evt.target.id;
        switch (id) {
            case "cities":
                hideAllShowOne("citiesPage");
                document.querySelector("#cities").classList.add("active")
                break
            case "persons":
                hideAllShowOne("personsPage");
                document.querySelector("#persons").classList.add("active")
                break
            case "hobbies":
                hideAllShowOne("hobbiesPage");
                document.querySelector("#hobbies").classList.add("active")
                break
            case "home":
                hideAllShowOne("startPage");
                document.querySelector("#home").classList.add("active")
                break;
            case"logo":
                hideAllShowOne("startPage");
                document.querySelector("#home").classList.add("active")
                break;
            case"api":
                hideAllShowOne("apiPage");
                document.querySelector("#api").classList.add("active")
                break;
            default:
                hideAllShowOne();
                break
        }
        evt.preventDefault();
    }

    document.getElementById("menu").onclick = menuItemClicked;
    hideAllShowOne("startPage");


    import "bootstrap/dist/js/bootstrap.js"
import data from "bootstrap/js/src/dom/data";