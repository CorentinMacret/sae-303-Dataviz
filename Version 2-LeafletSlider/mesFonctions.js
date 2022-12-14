

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
            iconUrl: 'style/borne.png',
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


