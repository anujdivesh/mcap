import React, { useEffect, useRef, useState , useCallback} from 'react';
import L from 'leaflet';
import "./testmap.css";
import "./radio.css";
import "leaflet-bing-layer";
import { saveAs } from "file-saver";
import {mayFlyer,addShorelineImagenoPaneGen,addRisk, getChartOptions,getYaxis} from "./helper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar} from 'react-chartjs-2';

const Contact = () => {
 
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    {
      id: 'no_data_label',
      beforeDraw: function (chart, easing) {
        var ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
  }
  );

  const shorelineLayer = useRef();
  const baseLayer = useRef();
  //const layer2 = useRef();
  const _isMounted = useRef(true);
  const mapContainer = React.useRef(null);
  //const url_risk = "https://opm.gem.spc.int/tcap/risk-plots";
  const yearRef = useRef(10);
  const siteRef = useRef("Majuro");
  const horizonRef = useRef("0");
  const climateRef = useRef("SSP2");
  const presentBoolRef = useRef(true);
  const [abool, setabool] = useState(false);
  const [economicbool, seteconomicbool] = useState(false);
  const [expo, setExpo] = useState(true);
  const assetRef = useRef("population");
  const typeRef = useRef("exposed");
  const siteRefBool = useRef(true);
  const [data, setData] = useState({labels:[],datasets:[]});
  
const [type, setType] = useState("exposed");
  const [displayShape, setDisplayShape] = useState(false);
  const risklayer = useRef();
  const [display2, setDisplay2] = useState(false);
  const [display3, setDisplay3] = useState(false);
  const [chartOptionsData, setChartOptionsData] = useState(getChartOptions);

  const chartOptions = (title, ylabel, xlabel, bool, isStacked) => {
    var yy ={
      min: 0,
      max: 100,
      stepSize: 20,
      stacked: false,
      ticks: {
        beginAtZero: true,
      },
      title: {
        display: true,
        text: ylabel
      }
    };
    if (!bool){
      yy ={
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: ylabel
        }
      };
    }
    if (isStacked){
      yy ={
        min: 0,
        max: 100,
        stepSize: 20,
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: ylabel
        }
      };
    }
    else{
      yy ={
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: ylabel
        }
      };
    }
    setChartOptionsData({
      plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    var label = context.dataset.label || '';
                    var unit = '%';
                    if (!bool){
                      unit = '';
                    }
                    if (context.parsed.y !== null) {
                        label += ' ' +Math.round(context.parsed.y,1) + unit;
                    }
                    return label;
                }
            }
        },
        title: {
          display: true,
          text: title
      },
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
          title: {
            display: true,
            text: xlabel
          }
        },
        y: yy,
        /*
        y1: {
          min: 0,
        max: 40,
        stepSize: 10,
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },*/
      }
    
    
    });
  };
  /*
  const chart = (presentArr) => {
    setChartData({
      labels:["5","10","25", '50','100','250'],
      datasets:[{
        label:'Present',
        backgroundColor: 'rgb(53, 162, 235)',
        stack: 'Stack 1',
        data:presentArr
      
      },
      {
      label:'SSP2-4.5(2060)',
      backgroundColor: 'rgb(255, 99, 132)',
      stack: 'Stack 0',
        data:[8,5,4,8,5,4]
  
    },
    {
      label:'SSP2-4.5(2100)',
      backgroundColor: 'rgb(75, 192, 192)',
      stack: 'Stack 0',
      data:[20,50,30,20,50,30]
  
  },
  {
    label:'SSP2-4.5(2060)',
    backgroundColor: 'rgb(153, 102, 255)',
    stack: 'Stack 2',
      data:[8,5,4,8,5,4]
  
  },
  {
    label:'SSP2-4.5(2100)',
    backgroundColor: 'rgb(255, 159, 64)',
    stack: 'Stack 2',
    data:[100,100,100,100,100,100]
  
  }]
  });
  };
*/
  const fetchData= useCallback(async(island, varib,yaxis,bool,isStacked)=> {
    //const url = "https://opm.gem.spc.int/cgi-bin/Risk/test2.py?island="+island+"&var="+varib;
    const url = "https://opm.gem.spc.int/cgi-bin/Majuro/mj_scenario.py?island="+island+"&var="+varib;
    console.log(url)
    var presentArr = [];
var SSP452060 = [];
var SSP452100 = [];
var SSP852060 = [];
var SSP852100 = [];
  await fetch(url).then((data)=> {
      const res = data.json();
      return res
  }).then((res) => {
    var horizon = [0, 0.25, 0.5, 1, 2];
    var return_periods = [10,25,50,100,250];

    for (let i = 0; i < res.length; ++i){
      var ARI = res[i]['ARI'];
      var Scenario = res[i]['SLR'];
      var Percentage_Exposed_Population = res[i]['data'];
      var sss = Scenario
   // presentArr.push(i)
      
      for (let j = 0; j < return_periods.length; ++j){
        if (ARI === return_periods[j] && sss === horizon[0]){

          presentArr.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[1]){

          SSP452060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[2]){
          if(isStacked){
          SSP452100.push(Percentage_Exposed_Population)}
          else{
            SSP452100.push(Percentage_Exposed_Population)
          }
        }
        if (ARI === return_periods[j] && sss === horizon[3]){

          SSP852060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[4]){
          if(isStacked){
          SSP852100.push(Percentage_Exposed_Population)}
          else{
            SSP852100.push(Percentage_Exposed_Population)
          }
        }
      }
  
    }
    chartOptions(yaxis[0], yaxis[1], yaxis[2], bool,isStacked)

    var stack1 = 'Stack 1';
    var stack0 = 'Stack 0';
    var stack3 = 'Stack 0';
    var stack2 = 'Stack 2';
    var stack4 = 'Stack 2';
    if (!isStacked){
      stack3 = 'Stack 3';
      stack4 = 'Stack 4';
    }
     setData({
      labels:["10","25", '50','100','250'],
      datasets:[{
        label:'0cm',
        backgroundColor: '#fd7f6f',
        stack: stack1,
        data:presentArr
      
      },
      {
      label:'0.25cm',
      backgroundColor: '#7eb0d5',
      stack: stack0,
        data:SSP452060
  
    },
    {
      label:'0.5cm',
      backgroundColor: '#b2e061',
      stack: stack3,
      data:SSP452100
  
  },
  {
    label:'1cm',
    backgroundColor: '#bd7ebe',
    stack: stack2,
      data:SSP852060
  
  },
  {
    label:'2cm',
    backgroundColor: '#ffb55a',
    stack: stack4,
    data:SSP852100
  
  }]
  })
  }).catch(e => {
         console.log("error", e)
     })
 }, [])

 const fetchDataCountry = useCallback(async (retur, asset, type, horizon, gender,yaxis,bool,isStacked) => {
  //const url = "https://opm.gem.spc.int/cgi-bin/Risk/country.py?island="+retur+"&var="+asset+"_"+type+"&scenario="+namee;
  const url = "https://opm.gem.spc.int/cgi-bin/Majuro/country.py?ARI="+retur+"&var="+asset+"_exposed&SLR="+horizon;
  console.log(url)
  var presentArr = [];
await fetch(url).then((data)=> {
    const res = data.json();
    return res
}).then((res) => {

  for (let i = 0; i < res.length; ++i){
    var prev = res[i]['data'];
    console.log(prev)
    presentArr.push(prev)

  }
  console.log(yaxis)
  //var title = yaxis[0]+" ["+retur+" year "+namee+"]";
  var title = yaxis[0]+" ["+retur+" year]";
  chartOptions(title, yaxis[1], yaxis[2], bool,isStacked)
  var stack1 = 'Stack 1';
   setData({
    labels:["Airport","DUD_north","DUD_south", 'Laura'],
    datasets:[{
      label:['Sea Level Rise '+horizon+"cm"],
      backgroundColor: '#ff7f0e',
      stack: stack1,
      data:presentArr
    
    }]
})
}).catch(e => {
       console.log("error", e)
   })
    }, []) // update the callback if the state changes
     

  function initMap(){
     
    const BING_KEY = 'AnIOo4KUJfXXnHB2Sjk8T_zV-tI7FkXplU1efiiyTYrlogDKppodCvsY7-uhRe8P'
   
    baseLayer.current = L.tileLayer.bing(BING_KEY, {
    //  maxZoom: 5,
      attribution:
      '&copy; Pacific Community (OSM)',
      detectRetina: true,
    });
/*
       baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
         attribution: '&copy; Pacific Community (OSM)',
         detectRetina: true
     });
   */
     mapContainer.current = L.map('map', {
      zoom: 12,
      center: [7.117960, 171.190260]
     });
     baseLayer.current.addTo(mapContainer.current); 
   //  layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)

shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
//mayFlyer(mapContainer.current, siteRef.current);

     }


   useEffect(() => {  
   if (_isMounted.current){
   
     initMap();
     fetchDataCountry(yearRef.current, 'population','exposed','0', 'SSP2', getYaxis('Majuro','population','exposed'),true, true)
     
   }  
   return () => { _isMounted.current = false }; 
   },[fetchDataCountry]);
   
const handleSite=(e)=>{
  siteRef.current = e.target.value;
  setHorizon("0")
  horizonRef.current = "0";
  if (e.target.value !== "Majuro"){
   // setCountry('island')
    setDisplayShape(true)
    setDisplay2(true)
    setDisplay3(true)
    if (assetRef.current === "population"){
      setExpo(true)
    }
    else{
      setExpo(false)
    }

  fetchData(e.target.value, "population_exposed", getYaxis(e.target.value,'population','exposed'),true,false);
  }
  else{
    setDisplay2(false)
    setDisplay3(false)
    setDisplayShape(false)
    setExpo(false)
    setCountry('majuro')

 fetchDataCountry(yearRef.current, 'population','exposed','0', 'SSP2', getYaxis('Majuro','population','exposed'),true, true)

  }
  setAsset('population')
  setType('exposed')
  setExpo(true)


  if (e.target.value !== "Majuro"){
    //setDisplay2(true)
    siteRefBool.current = false;
   
  }
  else{
    //setDisplay2(false)
    siteRefBool.current = true;
    
  }

  seteconomicbool(false)
  if (shorelineLayer.current != null){
  mapContainer.current.removeLayer(shorelineLayer.current);
  }
 // if (layer2.current != null){
   // mapContainer.current.removeLayer(layer2.current);
    //}
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  //layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  mayFlyer(mapContainer.current, siteRef.current);

  if (risklayer.current != null){
    mapContainer.current.removeLayer(risklayer.current);
    mapContainer.current.eachLayer(function (layer) {

      console.log(layer)
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    }
  if (e.target.value !== "Majuro"){
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
 
  }
  else{
    
  }
   
}

const [gender, setGender] = useState("SSP2");



const [horizon, setHorizon] = useState("0");



const [asset, setAsset] = useState("population");
const [country, setCountry] = useState("majuro");

function onChangeValueAsset(e) {
  setHorizon('0');
  if (country === 'island' || siteRef.current !== "Majuro"){
    if (e.target.value === 'population'){
      fetchData(siteRef.current, e.target.value+"_exposed",getYaxis(siteRef.current,e.target.value,type),true,false);
    }
    else{
    fetchData(siteRef.current, e.target.value+"_"+type,getYaxis(siteRef.current,e.target.value,type),true,false);
    }
  }
  else{

    fetchDataCountry(yearRef.current, e.target.value,'exposed','0', gender, getYaxis('Majuro',e.target.value,'exposed'),true, true);
  }

 // if (siteRef.current !== "Tuvalu"){
    if (e.target.value === "population"){
      setExpo(true)
      typeRef.current= 'exposed';
      setType("exposed")
    }
    else{
      setExpo(false)
    }
 
  setAsset(e.target.value);
  assetRef.current = e.target.value
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);

 e.currentTarget.blur();
}


function onChangeValueTV(e) {
  setType('exposed');

  //var view = true;
   if (e.target.value !== "majuro"){
    fetchData(siteRef.current, asset+"_"+type,getYaxis(siteRef.current,asset,type),true,true);
    setDisplay3(true)
   }
   else{
  fetchDataCountry("5", 'population','exposed',horizon, gender, getYaxis('Majuro','population','exposed'),true, true);
    setDisplay3(false)
   // view = false;
   }
 //    if (e.target.value === "population"){
   //    setExpo(true)
     //  typeRef.current= 'exposed';
       //setType("exposed")
    // }
     //else{
      // setExpo(false)
     //}
  
   setCountry(e.target.value);
   //mapContainer.current.removeLayer(layer2.current);
  // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,view,e.target.value)

  // assetRef.current = e.target.value
 //mapContainer.current.removeLayer(layer2.current);
 //layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
 //mayFlyer(mapContainer.current, siteRef.current);
 
  e.currentTarget.blur();
 }


function onChangeValueType(e) {
  var vool = true;
  if (e.target.value === "numexposed" || e.target.value === 'economicdamage'){
    vool = false
  }
  if (country === 'island'|| siteRef.current !== "Majuro"){
    fetchData(siteRef.current, asset+"_"+e.target.value,getYaxis(siteRef.current,asset,e.target.value),vool,false);
  }
  else{

    fetchDataCountry("5", asset,e.target.value,horizon, gender, getYaxis('Majuro',asset,e.target.value),true, true);
  }

  console.log(e.target.value)
  if (e.target.value === "annual"){
    setabool(true)
  }
  else{
    setabool(false)
  }
/*
  if (e.target.value === "annualeconomic"){
    seteconomicbool(true)
  }
  else{
    seteconomicbool(false)
  }*/
  setType(e.target.value);
    presentBoolRef.current = false;
    typeRef.current = e.target.value;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);
 e.currentTarget.blur();
}

//Tuvalu Scale


const handleYear=(e)=>{
  yearRef.current = e.target.value;
  //mapContainer.current.removeLayer(layer2.current);
 // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  //mayFlyer(mapContainer.current, siteRef.current);
 

    fetchDataCountry(e.target.value, asset,type,horizon, gender, getYaxis('Majuro',asset,type),true, true);
 // }
 
}


const pointerRef2 = useRef(0);
const [ value2, setValue2 ] = React.useState(pointerRef2.current);

function onChangeValueHorizon(e) {
  setValue2(e.target.value)
  pointerRef2.current = e.target.value;
    if (e.target.value === "0"){
      pointerRef2.current = "0"
    } 
    if (e.target.value === "1"){
      pointerRef2.current = "0.25"
    } 
    if (e.target.value === "2"){
      pointerRef2.current = "0.5"
    } 
    if (e.target.value === "3"){
      pointerRef2.current = "1"
    } 
    if (e.target.value === "4"){
      pointerRef2.current = "2"
    } 

  setHorizon(pointerRef2.current);
  horizonRef.current = pointerRef2.current

  if (pointerRef2.current !== "present"){
    presentBoolRef.current = false;
 // yearRef.current = e.target.value;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);

}
else{
 // setHorizon2('present')
  presentBoolRef.current = true;
 // mapContainer.current.removeLayer(layer2.current);
 // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  //mayFlyer(mapContainer.current, siteRef.current);

}

fetchDataCountry(yearRef.current, asset,type,pointerRef2.current, gender, getYaxis('Majuro',asset,type),true, true);
 e.currentTarget.blur();
}




//Buildings Shapefile *************************
const handleYearShape=(e)=>{
  yearRef.current = e.target.value;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 
}


const pointerRef3 = useRef(0);
const [ value3, setValue3 ] = React.useState(pointerRef3.current);

function onChangeValueHorizonShape(e) {
  setValue3(e.target.value)
  pointerRef3.current = e.target.value;
    if (e.target.value === "0"){
      pointerRef3.current = "0"
    } 
    if (e.target.value === "1"){
      pointerRef3.current = "0.25"
    } 
    if (e.target.value === "2"){
      pointerRef3.current = "0.5"
    } 
    if (e.target.value === "3"){
      pointerRef3.current = "1"
    } 
    if (e.target.value === "4"){
      pointerRef3.current = "2"
    } 

  setHorizon(pointerRef3.current);
  horizonRef.current = pointerRef3.current

  if (pointerRef3.current !== "present"){
    presentBoolRef.current = false;
    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
    
   

}
else{
  presentBoolRef.current = true;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 

}
 e.currentTarget.blur();
}



const handleSubmit=(e)=>{
/*  saveAs(
    getURL(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country),
    "risk.png"
  );
*/
const canvasSave = document.getElementById('stack');
canvasSave.toBlob(function (blob) {
    saveAs(blob, "Export.png")
})

e.currentTarget.blur();
}


  return (
    <>
    <div className="container-fluid">
    <div className="row" style={{height:"93.5vh"}}>
    <div className="col-sm-2"  style={{backgroundColor:"#efefef",padding:0}}>

    <div className="card">
    <div className="card-body" style={{fontSize:"13px"}}>
   
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Sites:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="Majuro">Majuro</option>
      <option value="DUD_north">DUD North</option>
  <option value="DUD_south">DUD South</option>
  <option value="Laura">Laura</option>
  <option value="Airport">Airport</option>
</select>
      </div>
      </div>
      {display2 ?
      null
 : <>
  {/*
 <hr style={{marginTop:0}}/>
 <div className="row" style={{marginTop:'-10px'}}>
<div className="col-sm-6">
<div className="form-check">
             <input type="radio" className="form-check-input" value="majuro" id="majuro"
           name="country" onChange={onChangeValueTV} checked={country === "majuro"}/>
        <label>Island Scale</label>
        </div>
 </div>

 <div className="col-sm-6">

        <div className="form-check">
             <input type="radio" className="form-check-input" value="island" id="island"
          name="country" onChange={onChangeValueTV} checked={country === "island"}/>
        <label>Country Scale</label>
        </div>
 </div>

 </div> */}
 </>}
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Asset:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="population" id="population"
                name="asset" onChange={onChangeValueAsset} checked={asset === "population"} disabled={abool || economicbool} />
             <label>Population</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="building" id="building"
               name="asset" onChange={onChangeValueAsset} checked={asset === "building"} disabled={abool || economicbool} />
             <label>Buildings</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Impact Type:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="exposed" id="exposed"
                name="type" onChange={onChangeValueType} checked={type === "exposed"} />
                {display3 ?
             <label>% Exposed</label>
             : <label>Exposed</label>}
             </div>
             <>{display3 ?
             <>
              <div className="form-check">
                  <input type="radio" className="form-check-input" value="numexposed" id="numexposed"
                name="type" onChange={onChangeValueType} checked={type === "numexposed"} disabled={ expo}/>
             <label># Exposed</label>
             </div>

             <div className="form-check">
                  <input type="radio" className="form-check-input" value="economicdamage" id="economicdamage"
               name="type" onChange={onChangeValueType} checked={type === "economicdamage"} disabled={ expo}/>
             <label>Economic Damage</label>
             </div>

            
              </>
              : null}
              </>
             
             
             
      </div>
      </div>
     
      {display3 || display2 ?
      null
 : <>
      <hr style={{marginTop:0}}/>
     

      <div className="row"style={{marginTop:'-7px'}}>
<div className="col-sm-6">

<p>Return Period:</p>
  </div>

  <div className="col-sm-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYear} id="Year2" name="Year2" style={{fontSize:'13px', paddingLeft:1}}>
  <option value="10">10 Year</option>
  <option value="25">25 Year</option>
  <option value="50">50 Year</option>
  <option value="100">100 Year</option>
  <option value="250">250 Year</option>
</select>

</div>

  </div>
  <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-5">

    <p>Sea Level Rise:</p>
      </div>
      <div className="col-sm-7">
      <div className="row">
             <div className="col-sm-7">
    <input type="range" className="form-range" onClick={(e) => e.currentTarget.blur()} min={0} max={4} step={1} id="refreshButton22" value={value2} onChange={onChangeValueHorizon} style={{height:'10px'}}/>
      </div>
      <div className="col-sm-5">
       <p>{pointerRef2.current}m</p>
      </div>   
      </div> 
      </div> 
      {/*
      <div className="col-sm-6">



      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0" id="0"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "0"} disabled={ economicbool}/>
             <label>0 cm</label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0.25" id="0.25"
               name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "0.25"} disabled={ economicbool}/>
             <label>0.25 cm </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0.5" id="0.5"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "0.5"} disabled={ economicbool}/>
             <label>0.5 cm</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="1" id="1"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "1"} disabled={ economicbool}/>
             <label>1 cm</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2" id="2"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "2"} disabled={ economicbool}/>
             <label>2 cm</label>
             </div>
      </div>
      */}
      </div>


    
     </>}

    
    
    </div>
  </div>




  {displayShape ?
      <>
        <div className="row" style={{marginTop:'10px', marginBottom:'-15px'}}>
        <div className="col-sm-12" style={{marginLeft:'15px'}}>
          <p style={{fontSize:'13px'}}>Building Shapefile:</p>
          </div>
          </div>
  <div className="card"  style={{marginTop:"0px"}}>
    <div className="card-body" style={{fontSize:"13px"}}>
  
      <div className="row"style={{marginTop:'0px'}}>
<div className="col-sm-6">

<p>Return Period:</p>
  </div>

  <div className="col-sm-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYearShape} id="Year2" name="Year2" style={{fontSize:'13px', paddingLeft:1}}>
  <option value="10">10 Year</option>
  <option value="25">25 Year</option>
  <option value="50">50 Year</option>
  <option value="100">100 Year</option>
  <option value="250">250 Year</option>
</select>

</div>

  </div>
  <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-5">

    <p>Sea Level Rise:</p>
      </div>
      <div className="col-sm-7">
      <div className="row">
             <div className="col-sm-7">
    <input type="range" className="form-range" onClick={(e) => e.currentTarget.blur()} min={0} max={4} step={1} id="refreshButton22" value={value3} onChange={onChangeValueHorizonShape} style={{height:'10px'}}/>
      </div>
      <div className="col-sm-5">
       <p>{pointerRef3.current}m</p>
      </div>   
      </div> 
      </div> 
      {/*
      <div className="col-sm-6">


      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0" id="0"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "0"} />
             <label>0 cm</label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0.25" id="0.25"
               name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "0.25"}/>
             <label>0.25 cm </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="0.5" id="0.5"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "0.5"}/>
             <label>0.5 cm</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="1" id="1"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "1"} />
             <label>1 cm</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2" id="2"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "2"} />
             <label>2 cm</label>
             </div>
      </div>
      */}
      </div>
     
      </div>
      </div>
      </>
 : null}
    </div>
    <div className="col-sm-10" style={{padding:0}}>
    <div id="map" ref={mapContainer} className="map"></div>
    <div className="container">

    <pre><code className="javascript" id="code"></code></pre>
    <div className="row"style={{marginTop:'0px', height:'350px'}}>
    {

<Bar id="stack" options={chartOptionsData} data={data}/>

    }
</div>
<div className="row"style={{marginTop:'10px', textAlign:'center'}}>

<div className="col-sm-10">

</div>
<div className="col-sm-2">

<button type="button" className="btn btn-primary" onClick={handleSubmit}>Export</button>

</div>
</div>
</div>

</div>
</div>
    </div>
</>
  );

};

export default Contact;
