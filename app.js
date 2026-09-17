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

function changeTab(tab, btn){

    currentTab = tab;

    document
    .querySelectorAll(".tab")
    .forEach(t =>
        t.classList.remove("active")
    );

    btn.classList.add("active");

    render();

}
function afficherSuggestions(){

    const recherche =
    document.getElementById("produit")
    .value
    .toLowerCase()
    .trim();

    const zone =
    document.getElementById("suggestions");

    if(recherche === ""){

        zone.innerHTML = "";
        return;

    }

    const produits = [

        ...new Set(

            data[currentTab]
            .map(item => item.produit)

        )

    ];

    const resultats =
    produits.filter(p =>

        p.toLowerCase()
        .includes(recherche)

    );

    zone.innerHTML = resultats
    .slice(0,10)
    .map(p =>

        `<div
        class="suggestion"
        onclick="selectionnerProduit('${p.replace(/'/g,'\\\'')}')">

        ${p}

        </div>`

    )
    .join("");

}

function selectionnerProduit(produit){

    document
    .getElementById("produit")
    .value = produit;

    document
    .getElementById("suggestions")
    .innerHTML = "";

}
function ajouterProduit(){

    const produit =
    document
    .getElementById("produit")
    .value
    .trim();

    if(!produit) return;

    let dateChoisie =
    document.getElementById("dateCoupe").value;

    let date;

    if(dateChoisie){

        const parties =
        dateChoisie.split("-");

        date =
        parties[2] + "/" +
        parties[1] + "/" +
        parties[0];

    }
    else{

        const d = new Date();

        date =
        String(d.getDate()).padStart(2,"0")
        + "/"
        + String(d.getMonth()+1).padStart(2,"0")
        + "/"
        + d.getFullYear();

    }

    data[currentTab].push({

        id: Date.now(),
        produit,
        date

    });

    save();

    document.getElementById("produit").value = "";
    document.getElementById("dateCoupe").value = "";

    render();

    document.getElementById("produit").focus();

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
        (maintenant - dateProduit)
        / 86400000
    );

}

function voirHistorique(produit){

    const historique =
    data[currentTab]
    .filter(
        item =>
        item.produit === produit
    );

    if(historique.length === 0){
        alert("Aucun historique");
        return;
    }

    historique.sort((a,b)=>{

        const da =
        a.date.split("/").reverse().join("-");

        const db =
        b.date.split("/").reverse().join("-");

        return new Date(db) - new Date(da);

    });

    let texte =
    produit + "\n\n";

    texte +=
    "Nombre de mises à la coupe : "
    + historique.length
    + "\n\n";

    historique.forEach(item => {

        texte +=
        item.date +
        " (" +
        joursEcoules(item.date) +
        " jour(s))\n";

    });

    alert(texte);

}

function supprimer(id){

    data[currentTab] =
    data[currentTab].filter(
        item => item.id !== id
    );

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
        data.hotel.map(item => ({
            Produit:item.produit,
            Date:item.date
        }))
    );

    XLSX.utils.book_append_sheet(
        wb,
        wsHotel,
        "HOTEL"
    );

    const wsRestaurant =
    XLSX.utils.json_to_sheet(
        data.restaurant.map(item => ({
            Produit:item.produit,
            Date:item.date
        }))
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
    String(d.getMonth()+1).padStart(2,"0") +
    "-" +
    String(d.getDate()).padStart(2,"0") +
    ".xlsx";

    XLSX.writeFile(
        wb,
        fichier
    );

}

function render(){

    let html = "";

    let liste =
    [...data[currentTab]];

    const modeTri =
    document.getElementById("tri").value;
console.log("MODE TRI :", modeTri);
    if(modeTri === "ancien"){

        liste.sort((a,b)=>{

            const da =
            a.date.split("/").reverse().join("-");

            const db =
            b.date.split("/").reverse().join("-");

            return new Date(da) - new Date(db);

        });

    }

    else if(modeTri === "recent"){

        liste.sort((a,b)=>{

            const da =
            a.date.split("/").reverse().join("-");

            const db =
            b.date.split("/").reverse().join("-");

            return new Date(db) - new Date(da);

        });

    }

    else if(modeTri === "az"){

        liste.sort((a,b)=>

            a.produit.localeCompare(
                b.produit,
                "fr"
            )

        );

    }

    else if(modeTri === "za"){

        liste.sort((a,b)=>

            b.produit.localeCompare(
                a.produit,
                "fr"
            )

        );

    }

    liste.forEach(item => {

        const jours =
        joursEcoules(item.date);

        let couleur = "vert";

        if(jours >= 3)
            couleur = "orange";

        if(jours >= 6)
            couleur = "rouge";

        html += `

        <div class="card ${couleur}">

            <h3
            style="cursor:pointer"
            onclick="voirHistorique('${item.produit}')">

            ${item.produit}

            </h3>

            <div>
            Date : ${item.date}
            </div>

            <div>
            ${jours} jour(s)
            </div>

            <br>

            <button
            onclick="supprimer(${item.id})">

            🗑️ Supprimer

            </button>

        </div>

        `;

    });

    document.getElementById("cards")
    .innerHTML = html;

}

render();
