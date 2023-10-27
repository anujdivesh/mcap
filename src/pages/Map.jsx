import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import "./L.TileLayer.BetterWMS";
import "leaflet-side-by-side";
import './legend.css';
import './checkbox.css';
import {mayFlyer, addShoreline,sitesShoreline,sitesShoreline2, addTransact,getLegend,addShorelineImage} from "./helper";

const Services = () => {

  
  //VARIABLES
  const [display, setDisplay] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const checkedRef = useRef(false);
  const [input, setInput] = useState(true);
  const displayRef = useRef(false);
  const layer = useRef();
  //const layer2 = useRef();
  const staelliteLayer = useRef();
  const staelliteLayer2 = useRef();
  const sidebyside = useRef();
  const baseLayer = useRef();
  const legendRef = useRef();
  const legendColorRef = useRef();
  const _isMounted = useRef(true);
  const legend = useRef([]);
  const mapContainer = React.useRef(null);
  const url = "http://149.28.173.12/thredds/wms/Oceans/TCAP/";
//  const baselayerurl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  const siteRef = useRef("Nanumaga");
  const imageRef = useRef("2021");
  const [years, setYears] = useState([]);
  const [yearsCheck, setYearsCheck] = useState([]);
  const yearRef = useRef(2019);

  function initMap(url){

  setYears(sitesShoreline())

  setYearsCheck(sitesShoreline2())
  /*
    const BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
    baseLayer.current = L.tileLayer.bing(BING_KEY, {
      maxZoom: 5,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    */
    baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; Pacific Community (OSM)',
      detectRetina: true
  });

  
  mapContainer.current = L.map('map', {
    zoom: 7,
    center: [-6.287321, 176.320346]
  });
/*
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

  layer2.current = L.marker([-6.287321, 176.320346],{icon:redIcon,id:1}).addTo(mapContainer.current).bindPopup("<p>hiie</p>",{
    maxWidth: "auto"
});*/
  mapContainer.current.createPane('left');
  mapContainer.current.createPane('right');
  baseLayer.current.addTo(mapContainer.current); 
  //layer.current = addTransact(mapContainer.current, siteRef.current, "2021", 'left')
  //layer.current = addShoreline(mapContainer.current, siteRef.current, "2021", 'left')
  staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')
  mayFlyer(mapContainer.current, siteRef.current);
  //LEGENDD
  
  legendColorRef.current = L.control({ position: "bottomright", id:12 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Legend</h4>";
          div.innerHTML += '<i style="background: #c0392b"></i><span><-0.3</span><br>';
          div.innerHTML += '<i style="background: #e74c3c"></i><span>-0.3 - -0.2</span><br>';
          div.innerHTML += '<i style="background:  #f1948a"></i><span>-0.2 - -0.1</span><br>';
          div.innerHTML += '<i style="background: #fadbd8"></i><span>-0.1 - 0.0</span><br>';
          div.innerHTML += '<i style="background: #a9cce3"></i><span>0.0 - 0.1</span><br>';
          div.innerHTML += '<i style="background:  #2874a6"></i><span>>0.1</span><br>';
          div.innerHTML += '<i style="background: black"></i><span>Missing</span><br>';
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);
    
  //Popup
  mapContainer.current.on('popupopen', function (e) {
  if(displayRef.current){
    mapContainer.current.closePopup();
  }


  
  });
  }
useEffect(() => { 
if (_isMounted.current){
  initMap(url);
}
return () => { _isMounted.current = false }; 
},[input, years]);


const [userinfo, setUserInfo] = useState({
  languages: [],
  response: [],
});

const handleChange = (e) => {
  // Destructuring
  const { value, checked } = e.target;
  const { languages } = userinfo;
  
  console.log(`${value} is ${checked}`);
  console.log(value);
  if (checked){

    legend.current.push(value)
    layer.current = addShoreline(mapContainer.current, siteRef.current, value, 'left')
    if (legendRef.current == null){
      legendRef.current = getLegend(legend);
      legendRef.current.addTo(mapContainer.current);
    
  }
  else{

    mapContainer.current.removeControl(legendRef.current);
    legendRef.current = getLegend(legend);
    legendRef.current.addTo(mapContainer.current);
  }
  }
  else{

var index = legend['current'].indexOf(value);
if (index >= 0) {
  legend['current'].splice( index, 1 );
}

//console.log(legend['current'])
    mapContainer.current.removeControl(legendRef.current);

    legendRef.current = getLegend(legend);
    legendRef.current.addTo(mapContainer.current);

    
    mapContainer.current.eachLayer(function (layer) {

      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === value){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
  }
  //Adding Transact
   if(legend['current'].length >= 2 ){

    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "transact"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    layer.current = addTransact(mapContainer.current, siteRef.current, "transact", 'left', legend['current'],layer)
   }
   else{
    mapContainer.current.eachLayer(function (layer) {

      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "transact"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
   }
  // Case 1 : The user checks the box
  if (checked) {
    setUserInfo({
      languages: [...languages, value],
      response: [...languages, value],
    });
  }

  // Case 2  : The user unchecks the box
  else {
    setUserInfo({
      languages: languages.filter((e) => e !== value),
      response: languages.filter((e) => e !== value),
    });
  }
  e.currentTarget.blur()
};


const handleSite=(e)=>{
  setYears(sitesShoreline())
  setIsCheckAll(!isCheckAll);
  setInput(!input);
  yearRef.current = 2019;
  siteRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    //console.log(layername);
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });
// layer.current = addShoreline(mapContainer.current, siteRef.current, "2018", 'left')
  mayFlyer(mapContainer.current, siteRef.current);
  staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')

}


const handleImage=(e)=>{
  setInput(!input);
  if (checkedRef.current){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(staelliteLayer.current);
    staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
 sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
  }
  else{
    yearRef.current = e.target.value
    console.log(e.target.value)
  imageRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });

 //Add Layer
 staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
}
}

const handleImage2=(e)=>{
  setInput(!input);
  imageRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.removeControl(sidebyside.current);
 /* mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });*/
 mapContainer.current.removeLayer(staelliteLayer2.current);
 staelliteLayer2.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
 sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
 //Add Layer

}

const handleClick = (e) => {
  //Show layer
  setDisplay(!display)
  setChecked(!checked)
  setInput(!input);
  checkedRef.current = !checkedRef.current;
  if (checkedRef.current){
    //mapContainer.current.removeLayer(staelliteLayer.current);
    mapContainer.current.eachLayer(function (layer) {
      console.log(layer)
      if (layer.defaultOptions != null){
        var lay = layer.defaultOptions.id;
        var bol = lay.length;
        console.log(bol)
        if (bol === 4 || bol >= 4){
          mapContainer.current.removeLayer(layer);
        }
        console.log(layer.defaultOptions.id)
       /// if (layer.defaultOptions.id === value){
      //    mapContainer.current.removeLayer(layer);
       // }
      }
   });
   staelliteLayer2.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2021')
   sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
  }
  else{
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(staelliteLayer2.current);
   // mapContainer.current.removeLayer(staelliteLayer.current);
    //staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')
  }

  mapContainer.current.closePopup();
  e.currentTarget.blur();
}

//selecting all
const [isCheckAll, setIsCheckAll] = useState(false);
const [isCheck, setIsCheck] = useState([]);
const [list, setList] = useState([]);

const handleSelectAll = (e) => {
  setInput(!input);
  setIsCheckAll(!isCheckAll);
  setIsCheck(list.map(li => li.id));
  var dummy = years;
  var b = dummy[0];
  //console.log(b['Nanumaga'])
  var arrayLength = b['Nanumaga'].length;
 
  var stringlegened="";
  for (var i = 0; i < arrayLength; i++) {
    stringlegened +=b['Nanumaga'][i].id+",";
  }
  var stringlegened = stringlegened.substring(0, stringlegened.length-1);
  console.log(stringlegened)
for (var i = 0; i < arrayLength; i++) {
  b['Nanumaga'][i].checked = true;
  layer.current = addShoreline(mapContainer.current, siteRef.current, b['Nanumaga'][i].id, 'left');
  layer.current = addTransact(mapContainer.current, siteRef.current, "transact", 'left', stringlegened)
}
setYears(dummy)
  if (isCheckAll) {
    setIsCheck([]);
  }
  console.log(!isCheckAll)
  console.log(isCheckAll);
};


  return (
    <div className="container-fluid">
    <div className="row" style={{height:"93.5vh"}}>
    <div className="col-sm-2"  style={{backgroundColor:"#efefef",padding:0}}>
    <div className="card">
    <div className="card-body" style={{fontSize:"13px"}}>
    <div className="row">
    <div className="col-sm-6">

    <p>Sites:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="Nanumaga">Nanumaga</option>
  <option value="Nanumea">Nanumea</option>
  <option value="Funafuti">Funafuti</option>
  <option value="Niulakita">Niulakita</option>
  <option value="Niutao">Niutao</option>
  <option value="Nui">Nui</option>
  <option value="Nukufetau">Nukufetau</option>
  <option value="Nukulaelae">Nukulaelae</option>
  <option value="Vaitupu">Vaitupu</option>
</select>
      </div>
      </div>


<hr style={{marginTop:0}}/>
    <div className="row">
    <div className="col-sm-4">

    <p>Year:</p>
      </div>

      <div className="col-sm-8" >
        
      <div className="item" key={10}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="selectAll"
                      value="selectAll" 
                      id="selectAll"
                       key={input}
                      onChange={handleSelectAll}
                      defaultChecked={isCheckAll}
                      
                    />
                    <label
                      className="form-check-label"
                      htmlFor="selectall"
                      style={{paddingLeft:"3px", fontSize:"10px"}}
                    >
                        Select All
                    </label>
                  </div>
              <div className="flex">
              
                {years.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                  <div className="item" key={y}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="languages"
                      value={x.id}
                      id="flexCheckDefault"
                      onChange={handleChange}
                      key={input}
                      defaultChecked={x.checked}
                      disabled={checkedRef.current}
                      
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                      style={{paddingLeft:"3px"}}
                    >
                        {x.id}
                    </label>
                  </div>
                ))

                  ))}
              </div>
  
</div>

      </div>
     


      <hr style={{marginTop:0}}/>

      <div className="row">
    <div className="col-sm-6">

    <p>Satellite Image:</p>
      </div>
      <div className="col-sm-6">
      <select defaultValue={yearRef.current} key={yearRef.current} className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleImage} style={{fontSize:'13px', paddingLeft:1}}>
      
  <option value="2019">2019 - Lidar</option>
      {yearsCheck.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                    <option value={x.id} key={y}>{x.id}</option>
                ))

                ))
                  }
  {/*
  <option value="2021">2021</option>
  <option value="2020">2020</option>
  <option value="2018">2018</option>*/}
</select>
      </div>
      </div>
      
      </div>
      </div>
      <div className="form-check" style={{marginLeft:"20px", fontSize:"13px"}}>
  <input className="form-check-input" type="checkbox" id="fj_ezz" name="fj_ezz" value="fj_ezz" onChange={handleClick} defaultChecked={checked} />
  <label className="form-check-label">Activate Compare Layer</label>
</div> 

{display ?
 <div className="card">
 <div className="card-body" style={{fontSize:"13px"}}>
 <div className="row">
    <div className="col-sm-6">

    <p>Satellite Image:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleImage2} style={{fontSize:'13px', paddingLeft:1}}>
  <option value="2021">2021</option>
  {years.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                    <option value={x.id} key={y}>{x.id}</option>
                ))

                ))
                  }
</select>
      </div>
      </div>
 

 
 </div>
</div>



: null}
      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} style={{width:"100%", height:"100%",Zindex: "auto"}}></div>
      </div>
    </div>
  </div>

  )
}


export default Services;
