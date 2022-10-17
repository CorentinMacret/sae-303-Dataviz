

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


// Les fichiers de données ont été télécharger en GeoJson depuis le site : https://opendata.paris.fr 

//ci-dessous les liens des pages :

// => https://opendata.paris.fr/explore/dataset/arrondissements/
// => https://opendata.paris.fr/explore/dataset/belib-points-de-recharge-pour-vehicules-electriques-donnees-statiques/





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

  // Two more timestamps indicate the handle starting positions.
  start: [timestamp(initial), timestamp(final)],
  //No decimals
  //format: wNumb({
  // decimals: 0
  //}),
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

//Slider Control
var dateValues = [
  document.getElementById("datestart"),
  document.getElementById("dateend")
];

dateSlider.noUiSlider.on("update", function (values, handle) {
  console.log("Handle Value: ", values[handle]);
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
});




// COURBE DATAVIZ EN TEST D'UN CODE TROUVÉ 

$('document').ready(function() {

    var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    var formatCurrency = d3.format("$,.2f");
  
    $.getJSON(url).success(function(jsonData) {
      var data = jsonData.data;
  
      console.log(data);
      console.log(JSON.stringify(jsonData));
  
      d3.select(".notes")
        .append("text")
        .text(jsonData.description);
  
      var margin = {
          top: 5,
          right: 10,
          bottom: 30,
          left: 75
        },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  
      var barWidth = Math.ceil(width / data.length);
  
      minDate = new Date(data[0][0]);
      maxDate = new Date(data[274][0]);
  
      var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);
  
      var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) {
          return d[1];
        })]);
  
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.years, 5);
  
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "");
  
      var infobox = d3.select(".infobox");
  
      var div = d3.select(".card").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
      var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
      chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.8em")
        .style("text-anchor", "end")
        .text("Gross Domestic Product, USA");
  
      chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(new Date(d[0]));
        })
        .attr("y", function(d) {
          return y(d[1]);
        })
        .attr("height", function(d) {
          return height - y(d[1]);
        })
        .attr("width", barWidth)
        .on("mouseover", function(d) {
          var rect = d3.select(this);
          rect.attr("class", "mouseover");
          var currentDateTime = new Date(d[0]);
          var year = currentDateTime.getFullYear();
          var month = currentDateTime.getMonth();
          var dollars = d[1];
          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html("<span class='amount'>" + formatCurrency(dollars) + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function() {
          var rect = d3.select(this);
          rect.attr("class", "mouseoff");
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
  
    });
  
  });