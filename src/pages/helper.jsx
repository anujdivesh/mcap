import L from 'leaflet';
import MyImage from './well.png';
import Boreimg from './bore.png';
import treatmentimg from './treatment.svg';
import tankimg from './tank.png';
import poolimg from './pool.png';
//const geoserverAddress = "http://192.168.53.70:8080/";
const geoserverAddress = "https://opmgeoserver.gem.spc.int/";

//const cgiAddress = "http://services.gsd.spc.int:8080/";

const cgiAddress = "https://opm.gem.spc.int/";

//const cgiAddress = "http://192.168.4.92/";


export function addTVMarker(map, site) {
  
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var latlng;
      if (site === "Tuvalu"){
        latlng = [-7.87321, 178.320346];
      }
      if (site === "RMI"){
        latlng = [7.146918, 171.034545];
        }
      if (site === "Palau"){
        latlng = [7.388727, 134.470231];
      }
      if (site === "Pacific"){
        latlng = [0.878032, 155.843298];
        }
        if (site === "Nanumea"){
          latlng = [-5.660150, 176.103139];
          }
          if (site === "Nui"){
            latlng = [-7.222591, 177.155294];
            }
            if (site === "Vaitupu"){
              latlng = [-7.478320, 178.680380];
              }
              if (site === "Peleliu"){
                latlng = [7.010717, 134.242728];
                }
                if (site === "Angaur"){
                  latlng = [6.909704, 134.138282];
                  }
                  if (site === "Kayangel"){
                    latlng = [8.065986, 134.711673];
                    }
                  if (site === "Majuro"){
                    latlng = [7.122342, 171.184375];
                    }
        var layer = L.marker(latlng,{icon:redIcon,id:777}).addTo(map);//.openPopup();
  return layer;

  }
export function mayFlyer(map, site) {
//fly
map.eachLayer(function (lyr) {
    if (site === "Tuvalu"){
      map.flyTo([-7.87321, 178.320346], 7);
      }
        if (site === "Palau"){
          map.flyTo([7.388727, 134.470231], 8);
          }
          if (site === "RMI"){
            map.flyTo([7.148520, 171.034049], 15);
            }
            if (site === "Pacific"){
              map.flyTo([0.878032, 155.843298], 5);
              }
              if (site === "Nanumea"){
                map.flyTo([-5.660150, 176.103139],14);
                }
                if (site === "Nui"){
                  map.flyTo([-7.222591, 177.155294],14);
                  }
                  if (site === "Vaitupu"){
                    map.flyTo([-7.478320, 178.680380],14);
                    }
                    if (site === "Peleliu"){
                      map.flyTo([7.010717, 134.242728],14);
                      }
                      if (site === "Angaur"){
                        map.flyTo([6.909704, 134.138282],14);
                        }
                        if (site === "Kayangel"){
                          map.flyTo([8.065986, 134.711673],14);
                          }
                        if (site === "Majuro"){
                          map.flyTo([7.122342, 171.184375],8);
                          }

});
}

export function addLayerMajuro(mapContainer, url, siteRef, yearRef,horizonRef,climateRef,presentBoolRef,pointerRef){
  
  // var newurl = url+""+senario+"/"+siteRef+"_"+mhws+".nc";
    var layer = L.tileLayer.betterWms(url, {
        layers: "Depth",
        format: 'image/png',
        transparent: true,
        opacity: pointerRef,
        styles: 'default-scalar/div-Spectral-inv',
        colorscalerange: '0, 2',
        abovemaxcolor: "extend",
        belowmincolor: "transparent",
        numcolorbands: 250,
        time: '2022-06-14T00:00:00.000Z',
    }).addTo(mapContainer);
    return layer;
}


export function addLayernoMap(mapContainer, url, siteRef, yearRef,horizonRef,climateRef,presentBoolRef,pointerRef,idx){

  var senario="";
  var num = String(yearRef)
  console.log(num.length)
  if( num.length === 2){
    senario="0"+yearRef;
  }
  else{
    senario = yearRef
  }


   var newurl = url+""+siteRef+"/W84_"+siteRef+"_RP_"+senario+"_SLR_"+horizonRef+".nc";
   console.log(newurl)
    var layer = L.tileLayer.betterWms(newurl, {
        id:idx,
        layers: "Depth",
        format: 'image/png',
        transparent: true,
        opacity: pointerRef,
        styles: 'default-scalar/div-Spectral-inv',
        colorscalerange: '0, 2',
        abovemaxcolor: "extend",
        belowmincolor: "transparent",
        numcolorbands: 250,
        time: '2022-06-14T00:00:00.000Z',
    });
    return layer;
}

export async function addGround(mapContainer, siteRef){
  if (siteRef === 'Peleliu' || siteRef === 'Angaur' || siteRef === 'Kayangel'){
    siteRef = 'Palau';
  }

    const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:MCAP_Combined_Groundwater&outputFormat=application/json&srsName=epsg:4326&cql_filter=island='"+siteRef+"'");
    const customData = await resp.json();
var layer = L.geoJson(customData, {
  id:3,
  onEachFeature: function (f, l) {
    var color = 'Ground water information:';
    var content = "<div style='width: 210px; height: 90px; padding:0px'><p style='font-weight: bold;'></p><p style='color:#1b6387;'><span style='font-weight: bold; background-color:#1b6387; color:#FFFFFF;'>&nbsp;&nbsp;"+color+"&nbsp;&nbsp;</span> <br/> Island: "+f.properties.island+"<br/>Estimated freshwater thickness (m): "+f.properties.thickness+"</p></div>"

  l.bindPopup(content, {
    maxWidth: "auto"
});
  },
  style: function (feature) {
    var color;

    var depth = feature.properties.thickness;
    console.log(depth)
    if(parseFloat(feature.properties.thickness) === parseFloat(2.5)){
      color = "#FFFF00"
    }
    else if(parseFloat(feature.properties.thickness) === parseFloat(4)){
      color = "#FFFF00"
    }
    else if(parseFloat(feature.properties.thickness) === parseFloat(4.5)){
      color = "#A18B7E"
    }
    else if(parseFloat(feature.properties.thickness) === parseFloat(3)){
      color = "#00008B"
    }
    else if(parseFloat(feature.properties.thickness) === parseFloat(5)){
      color = "#0096FF"
    }
    else if(parseFloat(depth) === parseFloat(7.5)){
      color = "#fadbd8"
    }
    else if(parseFloat(depth) === parseFloat(10)){
      color = "#f1948a"
    }
    else if(parseFloat(depth) === parseFloat(12.5)){
      color = "#e74c3c"
    }
    else if(parseFloat(depth) === parseFloat(15)){
      color = "#c0392b"
    }
    else{
      color= 'green';
    }

    return {
      fillColor: color,
      color: color,
      weight: 4,
      opacity: 0.9,
      fillOpacity: 0.3,
      };
}
}).addTo(mapContainer);
  return layer;
}

export async function addWaterpoint(mapContainer, siteRef){
  var well_private = L.icon({
    iconUrl: require('../images/new_icons/well_private.png'),
    iconSize:     [20, 20], // size of the icon
});
var well_communal = L.icon({
  iconUrl: require('../images/new_icons/well_communal.png'),
  iconSize:     [20, 20], // size of the icon
});
var water_tank = L.icon({
  iconUrl: require('../images/new_icons/water_tank.png'),
  iconSize:     [20, 20], // size of the icon
});
var treatment_plant = L.icon({
  iconUrl: require('../images/new_icons/treatment_plant.png'),
  iconSize:     [20, 20], // size of the icon
});
var treatment_pool = L.icon({
  iconUrl: require('../images/new_icons/traditional_pool.png'),
  iconSize:     [20, 20], // size of the icon
});
var sinkhole = L.icon({
  iconUrl: require('../images/new_icons/sinkhole.png'),
  iconSize:     [20, 20], // size of the icon
});
var pumping_well = L.icon({
  iconUrl: require('../images/new_icons/pumping_well.png'),
  iconSize:     [20, 20], // size of the icon
});
var monitoring_well = L.icon({
  iconUrl: require('../images/new_icons/monitoring_well.png'),
  iconSize:     [20, 20], // size of the icon
});
var header_tank = L.icon({
  iconUrl: require('../images/new_icons/header_tank.png'),
  iconSize:     [20, 20], // size of the icon
});
var cistern = L.icon({
  iconUrl: require('../images/new_icons/cistern.png'),
  iconSize:     [20, 20], // size of the icon
});
    const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:MCAP_Combined_Infrastructure&outputFormat=application/json&srsName=epsg:4326&cql_filter=island='"+siteRef+"'");
    const customData = await resp.json();
var layer = L.geoJson(customData, {
  id:2,
  pointToLayer: function (feature, latlng) {
    var asset = feature.properties.Asset_Type;
    var assetStr = String(asset);
    console.log(asset)
    if(assetStr.includes('Well (private)')){
    return L.marker(latlng, {icon: well_private});
    }
    else if(assetStr.includes('Treatment plant')){
      return L.marker(latlng, {icon: treatment_plant});
      }
      else if(assetStr.includes('Cistern (communal)')){
        return L.marker(latlng, {icon: cistern});
        }
      else if(assetStr.includes('Header tank')){
        return L.marker(latlng, {icon: header_tank});
        }
        else if(assetStr.includes('Traditional pool')){
          return L.marker(latlng, {icon: treatment_pool});
          }
          else if(assetStr.includes('Sinkhole')){
            return L.marker(latlng, {icon: sinkhole});
            }
            else if(assetStr.includes('Pumping well')){
              return L.marker(latlng, {icon: pumping_well});
              }
              else if(assetStr.includes('Well (communal)')){
                return L.marker(latlng, {icon: well_communal});
                }
                else if(assetStr.includes('Rain tank (communal)')){
                  return L.marker(latlng, {icon: water_tank});
                  }
                  else if(assetStr.includes('Monitoring well')){
                    return L.marker(latlng, {icon: monitoring_well});
                    }
    else{
    return L.marker(latlng, {icon: well_communal});
    }
  },
  onEachFeature: function (f, l) {
    var color = 'Water source information:';
    var content = "<div style='width: 250px; height: 90px; padding:0px'><p style='font-weight: bold;'></p><p style='color:#1b6387;'><span style='font-weight: bold; background-color:#1b6387; color:#FFFFFF;'>&nbsp;&nbsp;"+color+"&nbsp;&nbsp;</span> <br/> Island: "+f.properties.island+"<br/>Water source type: "+f.properties.Asset_Type+"<br/>Water source name: "+f.properties.Asset_dtl+"<br/>EC (mS/cm): "+f.properties['EC (mS/cm)']+"</p></div>"
   
    //console.log(f.properties)
  l.bindPopup(content, {
    maxWidth: "auto"
});
  //l.bindPopup("Name: " + f.properties.Asset_Type);
  // l.bindPopup("<div>"+yearRef+"</div>");
  }
}).addTo(mapContainer);
  return layer;
}

export function addLayerprep(mapContainer, url, siteRef, yearRef,horizonRef,climateRef,presentBoolRef,pointerRef,idx){

  var senario="";
  var num = String(yearRef)
  console.log(num.length)
  if( num.length === 2){
    senario="0"+yearRef;
  }
  else{
    senario = yearRef
  }


   var newurl = url+""+siteRef+"/W84_"+siteRef+"_RP_"+senario+"_SLR_"+horizonRef+".nc";
   console.log(newurl)
    var layer = L.tileLayer.betterWms(newurl, {
        id:idx,
        layers: "Depth",
        format: 'image/png',
        transparent: true,
        opacity: pointerRef,
        styles: 'default-scalar/div-Spectral-inv',
        colorscalerange: '0, 2',
        abovemaxcolor: "extend",
        belowmincolor: "transparent",
        numcolorbands: 250,
        time: '2022-06-14T00:00:00.000Z',
    }).addTo(mapContainer);
    return layer;
}

export function addLayer(mapContainer, url, siteRef, yearRef,horizonRef,climateRef,presentBoolRef,pointerRef){
  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
  var mhws="";
  if (yearRef === "MHWS"){
    mhws = "MHWS_out"
  }
  else{
    mhws ="out"+yearRef+"-yearARI";
  }
   var newurl = url+""+senario+"/"+siteRef+"_"+mhws+".nc";
   console.log(newurl)
    var layer = L.tileLayer.betterWms(newurl, {
        layers: "Depth",
        format: 'image/png',
        transparent: true,
        opacity: pointerRef,
        styles: 'default-scalar/div-Spectral-inv',
        colorscalerange: '0, 2',
        abovemaxcolor: "extend",
        belowmincolor: "transparent",
        numcolorbands: 250,
        time: '2022-06-14T00:00:00.000Z',
    }).addTo(mapContainer);
    return layer;
}


export function getMarker(map, site, url,assetRef,typeRef,siteRef,yearRef,climateRef,presentBoolRef,horizonRef) {
  var urri="";
  if (siteRef === "Tuvalu"){
  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
  var pp = "";
  if (assetRef === "population"){
    pp = "_percentage"
  }

  urri = url+"/"+assetRef+"_"+typeRef+"/"+siteRef+"_Islands_"+assetRef+"_"+typeRef+pp+"_"+senario+"_"+yearRef+".png";
  if (typeRef === "annualeconomic"){
    urri = url+"/Tuvalu_islands_annual_expected_economic_damage.png";
  }
}
else{
  if (assetRef === "population"){

    urri = url+"/PerIsland/"+assetRef+"/"+siteRef+"_"+typeRef+"_percentage_"+assetRef+".png";
  }
  else{
    var fold ="";
    var naming = "";
    if (typeRef === "exposed"){
      fold = "Percentage_Exposed";
      naming = "exposed_percentage_building";
    }
    else if (typeRef === "numexposed"){
      fold = "Number_Exposed";
      naming = "exposed_number_building";
    }
    else if (typeRef === "damanged"){
      fold = "Percentage_Damaged";
      naming = "damaged_percentage_building";
    }
    else{
      fold = "Expected_Economic_Damage";
      naming = "expected_economic_damage_building";
    }
    urri = url+"/PerIsland/"+assetRef+"/"+fold+"/"+siteRef+"_"+naming+".png";
  }
}
//console.log('xxxx')
  //console.log(urri)
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var latlng;
      if (site === "Nanumanga"){
        latlng = [-6.287321, 176.320346];
      }
      if (site === "Nanumaga"){
        latlng = [-6.287321, 176.320346];
        }
      if (site === "Nanumea"){
        latlng = [-5.669055, 176.110211];
      }
      if (site === "Niulakita"){
        latlng = [-10.788,179.476];
        }
        if (site === "Funafuti"){
          latlng = [-8.521147, 179.196198];
          }
          if (site === "Niutao"){
            latlng = [-6.10717, 177.34215];
            }
            if (site === "Nui"){
              latlng = [-7.23247, 177.15205];
              }
              if (site === "Nukufetau"){
                latlng = [-8.045946, 178.37589];
                }
              if (site === "Nukulaelae"){
                latlng = [-9.38412, 179.84559];
                }
                if (site === "Vaitupu"){
                  latlng = [-7.4742, 178.67456];
                  }
                  if (site === "Tuvalu"){
                    latlng = [-8, 178.3053];
                    }
                    var htmltag ="<img style='width: 700px; height: 400px;text-align: center;line-height: 500px;' alt='Loading...' src="+urri+">"
        var layer = L.marker(latlng,{icon:redIcon,id:1}).addTo(map).bindPopup(htmltag,{
      maxWidth: "auto"
  }).openPopup();
  return layer;
  }
export async function addShoreline(mapContainer, siteRef, yearRef,pane){
  const geojsonStyle = {
      fillColor: getColor(yearRef),
      color: getColor(yearRef),
      weight: 3.5,
      opacity: 1,
      fillOpacity: 0,
    };
    var filter = getFilterPrefix(siteRef,yearRef);
   // console.log(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_SL&outputFormat=application/json&srsName=epsg:4326&cql_filter="+filter)
   // const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_1971_2021_Lines&outputFormat=application/json&srsName=epsg:4326&cql_filter=id="+yearRef);
    const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_SL&outputFormat=application/json&srsName=epsg:4326&cql_filter="+filter);
    const customData = await resp.json();
  //const customData = require('../shorelineDatasets/'+siteRef+'_shoreline_'+yearRef+'.json');
var layer = L.geoJson(customData, {
  pane: pane,
  id : yearRef,
  onEachFeature: function (f, l) {
  l.bindPopup("Name: " + f.properties);
   l.bindPopup("<div>"+yearRef+"</div>");
  },

  style: geojsonStyle,
}).addTo(mapContainer);
  return layer;
}

export async function addShorelineTransect(mapContainer, siteRef, yearRef,pane){
    const geojsonStyle = {
        fillColor: getColor(yearRef),
        color: getColor(yearRef),
        weight: 3.5,
        opacity: 1,
        fillOpacity: 0,
      };
     // const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_1971_2021_Lines&outputFormat=application/json&srsName=epsg:4326&cql_filter=id="+yearRef);
      const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_T&outputFormat=application/json&srsName=epsg:4326");
      const customData = await resp.json();
    //const customData = require('../shorelineDatasets/'+siteRef+'_shoreline_'+yearRef+'.json');
  var layer = L.geoJson(customData, {
    pane: pane,
    id : yearRef,
    onEachFeature: function (f, l) {
    l.bindPopup("Name: " + f.properties);
     l.bindPopup("<div>"+yearRef+"</div>");
    },

    style: geojsonStyle,
  }).addTo(mapContainer);
    return layer;
}

export function sitesShoreline2(){
  const Nanumangaarr = [
    {"Nanumea":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2003", checked:false},
      {id:"1982", checked:false},
      {id:"1971", checked:false}      
    ], 
    "Nanumaga":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Funafuti":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Niulakita":
    [
      {id:"2021", checked:false},
      {id:"2016", checked:false},
      {id:"2019", checked:false},
      {id:"2005", checked:false} 
    ], 
    "Niutao":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nui":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2011", checked:false},
      {id:"2007", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukufetau":
    [
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukulaelae":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Vaitupu":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"1971", checked:false}   
    ]}
  ];
  return Nanumangaarr;
}


export function sitesShoreline(){
  const Nanumangaarr = [
    {"Nanumea":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2003", checked:false},
      {id:"1982", checked:false},
      {id:"1971", checked:false}      
    ], 
    "Nanumaga":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Funafuti":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Niulakita":
    [
      {id:"2021", checked:false},
      {id:"2016", checked:false},
      {id:"2019", checked:false},
      {id:"2005", checked:false} 
    ], 
    "Niutao":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nui":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2011", checked:false},
      {id:"2007", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukufetau":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukulaelae":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Vaitupu":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ]}
  ];
  return Nanumangaarr;
}



export async function addTransact(mapContainer, siteRef, yearRef,pane, legend){
  /*
  var result = legend.map(function (x) { 
    return parseInt(x, 10); 
  });
  result.sort();*/
  var urll = cgiAddress+"cgi-bin/shoreline/"+siteRef+"/get_transect_prod.py?y="+legend.toString();
  console.log(urll)
  const resp = await fetch(urll);
  const data = await resp.json();

  const resp2 = await fetch(geoserverAddress+'geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_'+siteRef+'_T&outputFormat=application/json&srsName=epsg:4326');
  const customData = await resp2.json();

  var layer = L.geoJson(customData, {
    pane: pane,
    id : yearRef,
    onEachFeature: function (f, l) {
      var htmltag;
      for (let i = 0; i < data.length; ++i){
        var station = data[i]['id'];
        var high_low = data[i]['Value'];
        var counter = data[i]['len'];
        
        if (f.properties.Transect === parseInt(station)){
          if (parseInt(counter) === 0){
            htmltag ="<div style='width: 60px; height: 15px;text-align: center;line-height: 10px;'>No Data.</div>"
          }
          else if (parseInt(counter) === 1){
            htmltag ="<div style='width: 60px; height: 25px;text-align: center;line-height: 10px;'>Cannot compare one layer.</div>"
          }
          else if (parseInt(counter) === 2){
            var erosion = "Erosion";
            if(parseFloat(high_low) >=parseFloat(0)){
              erosion = "Accretion"
            }
            htmltag ="<div style='width: 80px; height: 15px;text-align: center;line-height: 10px;'>"+erosion+":" + high_low+"</div>"
          }
          else{
            htmltag ="<img style='width: 700px; height: 500px;text-align: center;line-height: 500px;' alt='Loading...' src='"+cgiAddress+"cgi-bin/shoreline/"+siteRef+"/shoreline.py?t="+f.properties.Transect+"&y="+legend.toString()+"'>"
          }
          break
        }
        else{
          continue
        }
       }
       l.bindPopup(htmltag,{ maxWidth: "auto"});
/*
      if (legend.length <=2){
        var text = "";
     for (let i = 0; i < data.length; ++i){
      var station = data[i]['id'];
      var high_low = data[i]['Value'];
      if (f.properties.Transect === parseInt(station)){
        if (high_low <= -900){
          high_low = "No Data."
        }
        text = high_low;
        break
      }
      else{
        continue
      }
     }
        
      l.bindPopup("<div>EPR: " + text+"</div>");
      }
      else{
        l.bindPopup("<img style='width: 700px; height: 500px;text-align: center;line-height: 500px;' alt='Loading...' src='http://services.gsd.spc.int:8080/cgi-enabled/shoreline.py?t="+f.properties.Id+"&y="+legend.toString()+"'>",{
      maxWidth: "auto"
      });
    }
    */
    },

    style: function (feature) {
      var color;
      for (let i = 0; i < data.length; ++i){
        var station = data[i]['id'];
      var high_low = data[i]['Value'];
        if (feature.properties.Transect === parseInt(station)){
            if(parseFloat(high_low) >=parseFloat(0.1)){
              color = "#2874a6"
            }
            else if(parseFloat(high_low) >=0 && parseFloat(high_low) <0.1){
              color = "#2874a6"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.1) && parseFloat(high_low) <parseFloat(0)){
              color = "#fadbd8"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.2) && parseFloat(high_low) <parseFloat(-0.1)){
              color = "#f1948a"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.3) && parseFloat(high_low) <-parseFloat(-0.2)){
              color = "#e74c3c"
            }
            else if(parseFloat(high_low) <= parseFloat(-0.3)){
              color = "#c0392b"
            }
            if(parseFloat(high_low) <= parseFloat(-900)){
              color = "black";
            }
         }
      }
      return {
        fillColor: color,
        color: color,
        weight: 4,
        opacity: 0.9,
        fillOpacity: 0,
        };
  },
  }).addTo(mapContainer);
    return layer;
}

export function getLegend(legend){
  var layer = L.control({ position: "topright", id:12 });
  layer.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    for (var i =0; i<legend.current.length; i++){
      div.innerHTML += '<i style="background: '+getColor(legend.current[i])+'"></i><span>'+legend.current[i]+'</span><br>';
    }
    
   return div;
  };
  return layer;
}

export function getColor(yearRef){
  var colorhex;
  if (yearRef === "1971"){
    colorhex = "#ff7373"
  }
  else if (yearRef === "1982"){
    colorhex = "#ffc0cb"
  }
  else if (yearRef === "1984"){
    colorhex = "#40ff00"
  }
  else if (yearRef === "2003"){
    colorhex = "#e1dfd9"
  }
  else if (yearRef === "2004"){
    colorhex = "#00ffff"
  }
  else if (yearRef === "2005"){
    colorhex = "#9de26b"
  }
  else if (yearRef === "2006"){
    colorhex = "#ff00ff"
  }
  else if (yearRef === "2007"){
    colorhex = "#08E8DE"
  }
  else if (yearRef === "2008"){
    colorhex = "#ff0040"
  }
  else if (yearRef === "2009"){
    colorhex = "#FFF000"
  }
  else if (yearRef === "2010"){
    colorhex = "#FFAA1D"
  }
  else if (yearRef === "2011"){
    colorhex = "#FF007F"
  }
  else if (yearRef === "2012"){
    colorhex = "#512bca"
  }
  else if (yearRef === "2013"){
    colorhex = "#007500"
  }
  else if (yearRef === "2014"){
    colorhex = "#ff00ff"
  }
  else if (yearRef === "2015"){
    colorhex = "#bf4040"
  }
  else if (yearRef === "2015"){
    colorhex = "#ff5733 "
  }
  else if (yearRef === "2016"){
    colorhex = "#48c9b0 "
  }
  else if (yearRef === "2017"){
    colorhex = "#af7ac5 "
  }
  else if (yearRef === "2018"){
    colorhex = "#ec7063"
  }
  else if (yearRef === "2019"){
    colorhex = "#f4d03f"
  }
  else if (yearRef === "2020"){
    colorhex = "#45b39d"
  }
  else if (yearRef === "2021"){
    colorhex = "#FFC0CB"
  }
  
  return colorhex;
}


export function addShorelineImage(mapContainer, siteRef, country, year){
  var url = geoserverAddress+'geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    id:4,
    layers: "spc:"+country+"_"+siteRef+"_"+year+"_orthorectified",
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}

export function addShorelineImagenoPane(mapContainer, siteRef, yearRef){

  var url = geoserverAddress+'geoserver/spc/wms';
    
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:TuvNnmg_RGB_2019_1m_Clipped',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}

export function addShorelineImagenoPaneGen(mapContainer, siteRef){

  var url = geoserverAddress+'geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:TV_'+siteRef+'_2019_orthorectified',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}

export function getFilterPrefix(site,yearRef){
  var prefix;
  if (site === "Nanumanga"){
    prefix = "id="+yearRef;
    }
  else if (site === "Nanumaga"){
      prefix = "id="+yearRef;
      }
  else{
    prefix = "layer="+yearRef;
  }
   
    return prefix;

}

export async function fetchdatetime(){
  
  const resp = await fetch('https://opm.gem.spc.int/sample.json');
  const data = await resp.json();
    return data['timerange'];
}


export const getdata = async () =>{
  const response = await fetch('https://opm.gem.spc.int/eciks/result.geojson');
  const timerange = await response.json();
  return timerange
}


export async function addRisk(mapContainer, siteRef, yearRef,climateRef,presentBoolRef, horizonRef, name){
  
  var senario="";
  var num = String(yearRef)
  if( num.length === 2){
    senario="0"+yearRef;
  }
  else{
    senario = yearRef
  }


   var newurl = siteRef+"_RP_"+senario+"_SLR_"+horizonRef;
   console.log(newurl)

  // const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:Airport_risk&outputFormat=application/json&srsName=epsg:4326&cql_filter=id_1='Airport_RP_010_SLR_0'");
   const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_risk&outputFormat=application/json&srsName=epsg:4326&cql_filter=id_1='"+newurl+"'");
    const customData = await resp.json();
   // console.log(customData)
var layer = L.geoJson(customData, {
  id : name,
  onEachFeature: function (f, l) {
    var color;
    var hexa;
    if(parseFloat(f.properties.Exposed) >=parseFloat(1)){
      color = 'Exposed';
      hexa = "#BB3F3F";
    }
    else{
      color = 'Not-Exposed';
      hexa = "#484848";
    }
    var content = "<div style='width: 300px; height: 130px; padding:0px'><p style='font-weight: bold;'>Building Information <span style='background-color:"+hexa+"; color:#FFFFFF;'>&nbsp;("+color+")&nbsp;</span></p><p>Occupany: "+f.properties.MainOcc+"<br/>Construction: "+f.properties.Const+"<br/>Num of Stories: "+f.properties.NumStories+"<br/>More details: "+f.properties.Occ+"</p></div>"

    //console.log(f.properties)
  l.bindPopup(content, {
    maxWidth: "auto"
});
   //l.bindPopup("<div>"+yearRef+"</div>");
  },
  style: function (feature) {
    var color;
      if(parseFloat(feature.properties.Exposed) >=parseFloat(1)){
        color = "#BB3F3F"
      }
      else{
        color = "#484848"
      }
  
    return {
      fillColor: color,
      color: color,
      weight: 4,
      opacity: 0.9,
      fillOpacity: 0.5,
      };
}



}).addTo(mapContainer);
  return layer;
}



export function getYaxis(site, asset, type){
  const arr=[]
  if (asset === "building"){
    if (type ==="exposed"){
      arr.push(site+' Percentage of '+asset+' Exposed')
      arr.push('Percentage of exposed '+asset+' (%)')
      arr.push('Annual recurrence interval (years)')
    }
    else if (type ==="numexposed"){
      arr.push(site+' number of '+asset+' exposed')
      arr.push('Number of exposed '+asset+' (#)')
      arr.push('Annual recurrence interval (years)')
    }
    else if (type ==="economicdamage"){
      arr.push(site+' Expected Damage')
      arr.push('Cost of Damage (Million US$)')
      arr.push('Annual recurrence interval (years)')
    }
    else{
      arr.push(site+' Percentage of '+asset+' damaged')
      arr.push('Percentage of damaged '+asset+' (%)')
      arr.push('Annual recurrence interval (years)')
    }
  }
  else{
    arr.push(site+' Percentage of Population Exposed')
    arr.push('Percentage of exposed Population (%)')
    arr.push('Annual recurrence interval (years)')
  }

  return arr;

}

export const getChartOptions ={
  plugins: {
    tooltip: {
        callbacks: {
            label: function(context) {
                var label = context.dataset.label || '';
                if (context.parsed.y !== null) {
                    label += ' ' +context.parsed.y + '%';
                }
                return label;
            }
        }
    },
    title: {
      display: true,
      text: 'Loading...'
  }
},
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      min: 0,
      max: 100,
      stepSize: 20,
      stacked: true,
    },
  }


}
