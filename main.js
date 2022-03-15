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

function getPersonsByZip() {
    let zip = document.querySelector("#zipInput").value

    citiesFacade.getPersonsByZip(zip).then(persons => {
        const personRows = persons.map(person => `
<tr>
    <td>${person.fName}</td>
    <td>${person.lName}</td>
    <td>${person.email}</td>
</tr>`);

        document.querySelector("#personsZipTable").innerHTML = personRows.join("");
    });
}


//JS for persons
getPersons()

function getPersons() {
    personsFacade.getPersons().then(persons => {
        const personRows = persons.map(person => `
<tr>
    <td>${person.fName}</td>
    <td>${person.lName}</td>
    <td>${person.email}</td>
</tr>`);

        document.querySelector("#personsTable").innerHTML = personRows.join("");
    });
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
});

const CREATEPERSONBTN = document.querySelector("#createPersonBTN")
CREATEPERSONBTN.addEventListener("click", createPerson)

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
    console.log(person)
    personsFacade.createPerson(person).then(user => console.log(user)).catch(err => {
        if (err.status) {
            err.fullError.then(e => console.log(e.msg))
        } else {
            console.log("Network error");
        }
    })
}

//JS for Search

    const SEARCHBTN = document.querySelector("#searchBTN")
    SEARCHBTN.addEventListener("click", getPersonByPhone)

    function getPersonByPhone() {
        let phone = document.querySelector("#phoneNumber").value;
        personsFacade.getPersonByPhone(phone).then(person => {
            document.querySelector("#fName").value = `${person.fName}`;
            document.querySelector("#lName").value = `${person.lName}`;
            document.querySelector("#email").value = `${person.email}`;
            document.querySelector("#street").value = `${person.address.street}`;
            document.querySelector("#houseNr").value = `${person.address.info}`;
            document.querySelector("#zip").value = `${person.address.cityInfo.zip}`;
            document.querySelector("#city").value = `${person.address.cityInfo.city}`;
            let phoneRows = person.phones.map(phone => {
                return `
        <tr>
            <td>${phone.nr}</td>
            <td>${phone.desc}</td>
        </tr>
            `
            })
            document.querySelector("#phones").innerHTML = phoneRows.join("");

            let hobbyRows = person.hobbies.map(hobby => {
                return `
            <tr>
                <td>${hobby.name}</td>
                <td>${hobby.desc}</td>
            </tr>
            `
            });
            document.querySelector("#hobby").innerHTML = hobbyRows.join("");
        });
    }


    function hideAllShowOne(idToShow) {
        document.getElementById("startPage").style = "display:none"
        document.getElementById("citiesPage").style = "display:none"
        document.getElementById("personsPage").style = "display:none"
        document.getElementById("hobbiesPage").style = "display:none"
        document.getElementById("searchPage").style = "display:none"
        document.getElementById(idToShow).style = "display:block"
    }

    function menuItemClicked(evt) {
        const id = evt.target.id;
        switch (id) {
            case "cities":
                hideAllShowOne("citiesPage");
                break
            case "persons":
                hideAllShowOne("personsPage");
                break
            case "hobbies":
                hideAllShowOne("hobbiesPage");
                break
            case "searchBTN":
                hideAllShowOne("searchPage");
                break
            default:
                hideAllShowOne("startPage");
                break
        }
        evt.preventDefault();
    }

    document.getElementById("menu").onclick = menuItemClicked;
    hideAllShowOne("startPage");


    import "bootstrap/dist/js/bootstrap.js"