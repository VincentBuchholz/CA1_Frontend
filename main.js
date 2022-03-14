import './style.css'
import "bootstrap/dist/css/bootstrap.css"
import citiesFacade from "./citiesFacade";

//JS for cities
let cities = citiesFacade.getCities().then(cities =>{
    const cityRows = cities.map(city => `
<tr>
    <td>${city.zip}</td>
    <td>${city.city}</td>
</tr>`);

    document.querySelector("#citiesTable").innerHTML = cityRows.join("");
    });















function hideAllShowOne(idToShow)
{
    document.getElementById("startPage").style = "display:none"
    document.getElementById("citiesPage").style = "display:none"
    document.getElementById("personsPage").style = "display:none"
    document.getElementById("hobbiesPage").style = "display:none"
    document.getElementById(idToShow).style = "display:block"
}

function menuItemClicked(evt)
{
    const id = evt.target.id;
    switch (id)
    {
        case "cities": hideAllShowOne("citiesPage"); break
        case "persons": hideAllShowOne("personsPage"); break
        case "hobbies": hideAllShowOne("hobbiesPage"); break
        default: hideAllShowOne("startPage"); break
    }
    evt.preventDefault();
}
document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("startPage");


import "bootstrap/dist/js/bootstrap.js"