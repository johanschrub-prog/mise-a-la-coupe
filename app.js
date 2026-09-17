let currentTab = "hotel";

let data =
JSON.parse(
localStorage.getItem("miseCoupe")
) || {

hotel: [],
restaurant: []

};

function save(){

localStorage.setItem(
"miseCoupe",
JSON.stringify(data)
);

}

function changeTab(tab,btn){

currentTab = tab;

document
.querySelectorAll(".tab")
.forEach(t =>
t.classList.remove("active"));

btn.classList.add("active");

render();

}

function ajouterProduit(){

const produit =
document
.getElementById("produit")
.value
.trim();

if(!produit) return;

let dateChoisie =
document.getElementById("dateCoupe")
.value;

let date;

if(dateChoisie){

    const parties =
    dateChoisie.split("-");

    date =
    parties[2] + "/" +
    parties[1] + "/" +
    parties[0];
document.getElementById(
"dateCoupe"
).value = "";
}
else{

    const aujourdHui =
    new Date();

    date =
    String(
        aujourdHui.getDate()
    ).padStart(2,"0")
    + "/"
    + String(
        aujourdHui.getMonth()+1
    ).padStart(2,"0")
    + "/"
    + aujourdHui.getFullYear();

}

data[currentTab].unshift({

produit,
date

});

save();

document
.getElementById("produit")
.value = "";

render();

document
.getElementById("produit")
.focus();

}

function joursEcoules(dateTexte){

const morceaux =
dateTexte.split("/");

const dateProduit =
new Date(
morceaux[2],
morceaux[1]-1,
morceaux[0]
);

const maintenant =
new Date();

return Math.floor(
(maintenant-dateProduit)
/
86400000
);

}

function render(){

let html = "";

data[currentTab]
.forEach((item,index)=>{

const jours =
joursEcoules(item.date);

let couleur = "vert";

if(jours >= 3)
couleur = "orange";

if(jours >= 6)
couleur = "rouge";

html += `

<div class="card ${couleur}">

<h3>${item.produit}</h3>

<div>
Date : ${item.date}
</div>

<div>
${jours} jour(s)
</div>

<br>

<button
onclick="supprimer(${index})">
🗑️ Supprimer
</button>

</div>

`;

});

document
.getElementById("cards")
.innerHTML = html;

}

function supprimer(index){

data[currentTab]
.splice(index,1);

save();

render();

}

function resetData(){

if(
!confirm(
"Tout supprimer ?"
)
) return;

data[currentTab] = [];

save();

render();

}

function exportExcel(){

const wb =
XLSX.utils.book_new();

const wsHotel =
XLSX.utils.json_to_sheet(
data.hotel
);

XLSX.utils.book_append_sheet(
wb,
wsHotel,
"HOTEL"
);

const wsRestaurant =
XLSX.utils.json_to_sheet(
data.restaurant
);

XLSX.utils.book_append_sheet(
wb,
wsRestaurant,
"RESTAURANT"
);

const d =
new Date();

const fichier =
"mise-a-la-coupe-" +
d.getFullYear() +
"-" +
String(
d.getMonth()+1
).padStart(2,"0") +
"-" +
String(
d.getDate()
).padStart(2,"0") +
".xlsx";

XLSX.writeFile(
wb,
fichier
);

}

render();

