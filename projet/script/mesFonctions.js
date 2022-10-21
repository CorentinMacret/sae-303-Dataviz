

function initialize() {

  // création de la carte et paramétrage : affichage et zoom de 11
  var map = L.map('mapid').setView([48.862162, 2.345818], 11);

  // création d’une couche « couche1 »
  var couche1 = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'crédits : <a href= » http://osm.org/copyright »>OpenStreetMap</a> contributeur',
    maxZoom: 19 //zoom  max de 19
  });

  // la couche « couche1 » est ajoutée à la carte
  map.addLayer(couche1);

  // création d’une couche « colorLayer »
  var colorLayer = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: '© <a href= » http://osm.org/copyright »>OpenStreetMap</a>',
    maxZoom: 19
  });

  // la couche « colorLayer » est ajoutée à la carte pour le visuel
  map.addLayer(colorLayer);

  // appelle le fichier « arrondissement.geojson »
  var arrondissement = $.getJSON("arrondissements.geojson", function (dataArrondissements) {
    L.geoJson(dataArrondissements,
      {
        style: function (feature) {
          // paramétrage de la couche « arrondissement » délimitation paris sur fond bleu
          return { color: '#046380', weight: 1, fillColor: '#4BB5C1', fillOpacity: .6 };
        },
        onEachFeature: function (feature, layer) {
          // paramétrage de la popup de la couche « arrondissement »
          layer.bindPopup('<b><u>Quel arrondissement ?</u></b><br><b> Arrondissement n° </b>' + feature.properties.c_ar)//affiche le numéro de l'arrondissement selon le fichier arrondissements.geojson
        }
      }).addTo(map);//ajoute à la "map"
  });

  // création d’une couche geoJson qui appelle le fichier « borne.geojson »
  var borne = $.getJSON("borne.geojson", function (coordonneesxy)//emplacement borne selon le fichier borne.geoJson +
  // icone de la borne
  {
    var iconeborne = L.icon({
      iconUrl: 'img/borne.png',
      iconSize: [40, 40]// taille de 40*40 sinon trop grand ou trop petit
    });

    L.geoJson(coordonneesxy, { //quand on clique sur une icone affiche :
      pointToLayer: function (feature, latlng) {
        var marker = L.marker(latlng, { icon: iconeborne });
        marker.bindPopup('<b><u>Description de la borne</u></b><br>'//titre
          // infos de la borne à afficher :
          + '<b>Nom : </b>' + feature.properties.nom_station + '<br>'
          + '<b>statut : </b>' + feature.properties.statut_pdc + '<br>'
          + '<b>adresse : </b>' + feature.properties.adresse_station + '<br>'
          + '<b>Puissance : </b>' + feature.properties.puissance_nominale + '<br>'
          + '<b>Mise en service le : </b>' + feature.properties.date_mise_en_service + '<br>'
          + '<b>Paiement CB : </b>' + feature.properties.paiement_cb + '<br>'
          + '<b>Paiement autre : </b>' + feature.properties.paiement_autre + '<br>'
          + '<b>Infos : </b>' + feature.properties.observations + '<br>'
          + '<b>Accesibilite PMR : </b>' + feature.properties.accessibilite_pmr + '<br>'
          + '<b>Prise type 2 : </b>' + feature.properties.prise_type_2
        );
        return marker;
      }
    }).addTo(map);//affiche sur la map
  });

  // contrôle des couches pour modifier les couches de fond (2 visuels différents )
  var baseLayers = {
    'OpenStreetMap': couche1,
    'color': colorLayer
  };
  L.control.layers(baseLayers).addTo(map);
}





// ////////////DATE SLIDER////////////////

var dateSlider = document.getElementById("noUiSlider");
var monthsOld = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];
var months = [
  "01/",
  "02/",
  "03/",
  "04/",
  "05/",
  "06/",
  "07/",
  "08/",
  "09/",
  "10/",
  "11/",
  "12/"
];

var initial = "2019-08-01";
var final = "2022-12-23";

// Créez une nouvelle date à partir d'une chaîne, sous forme d'horodatage.
function timestamp(str) {
  return new Date(str).getTime();
}

// Représentation sous forme de chaîne de la date.
function formatDate(date) {
  console.log(
    "Format: ",
    monthsOld[date.getMonth()] + " " + date.getFullYear().toString()
  );

  return (
    monthsOld[date.getMonth()] + " " + date.getFullYear().toString()
  );
}

function formatDate2(date) {
  console.log(
    "Format: ",
    months[date.getMonth()] + " " + date.getFullYear().toString()
  );

  return (
    months[date.getMonth()] + " " + date.getFullYear().toString()
  );
}

noUiSlider.create(dateSlider, {
  // définir une plage période
  range: {
    min: timestamp(initial),
    max: timestamp(final)
  },
  connect: true,
  // Étapes d'un trimestre de l'année
  step: 50 * 30 * 60 * 60 * 1000,


  start: [timestamp(initial), timestamp(final)],

  pips: {
    mode: "steps",
    stepped: true,
    density: 24,
    format: {
      to: function (value) {
        if (value == 0) return 0;
        return formatDate2(new Date(value));
      },
      from: function (value) {
        return timestamp(value);
      }
    }
  }
});

//control du slider
var dateValues = [
  document.getElementById("datestart"),
  document.getElementById("dateend")
];

dateSlider.noUiSlider.on("update", function (values, handle) {
  console.log("Value: ", values[handle]);
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
});
// /////////// Ici le code pour mettre a jour la map : //////////////


// const startTimeInput = document.getElementById("datestart");
// const endTimeInput = document.getElementById("dateend");

// function filterByYear(data, dateValues) {
//   f = data.filter(function(d) { 
//     return d.properties.date_mise_en_service == dateValues;
//   });
//   return f.addTo(map);
// }








// Les fichiers de données ont été télécharger en GeoJson depuis le site : https://opendata.paris.fr 

//ci-dessous les liens des pages :

// => https://opendata.paris.fr/explore/dataset/arrondissements/
// => https://opendata.paris.fr/explore/dataset/belib-points-de-recharge-pour-vehicules-electriques-donnees-statiques/


