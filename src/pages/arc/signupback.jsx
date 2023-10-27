import React, { useEffect, useRef,useState } from 'react';
import L from 'leaflet';
import "./testmap.css";
import "./radio.css";
import {sitesShoreline, mayFlyer,addShorelineImagenoPaneGen} from "./helper";
const SignUp = () => {

  const mapContainer = React.useRef(null);
  const baseLayer = useRef();
  const _isMounted = useRef(true);
  const siteRef = useRef("Nanumaga");
  const [years, setYears] = useState([]);
  const [email, setEmail] = useState([]);
  const [extent, setExtent] = useState([]);
  const [input, setInput] = useState(true);
  const shorelineLayer = useRef();
  const [userinfo, setUserInfo] = useState({
    languages: [],
    response: [],
  });

  function initMap(){
    setYears(sitesShoreline())
       baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
         attribution: '&copy; Pacific Community (OSM)',
         detectRetina: true
     });
   
     
     mapContainer.current = L.map('map', {
       zoom: 7,
       center: [-6.287321, 176.320346]
     });
     baseLayer.current.addTo(mapContainer.current); 

     var m_drawn_features = new L.FeatureGroup();
     mapContainer.current.addLayer(m_drawn_features);

     let draw_control = new L.Control.Draw({
      position: 'topleft',
      draw: {
          polyline: false,
          polygon: false,
          circle: false,
          rectangle: true,
          circlemarker: false,
          marker: false,
      },
      edit: {
        featureGroup: m_drawn_features, //REQUIRED!!
        remove: true
    }
  });

  mapContainer.current.addControl(draw_control);

  mapContainer.current.on(L.Draw.Event.CREATED, function(e) {
    // Remove all layers (only show one location at a time)
    m_drawn_features.clearLayers();

    // Add layer with the new features
    let new_features_layer = e.layer;
    m_drawn_features.addLayer(new_features_layer);
    setExtent(new_features_layer)
    console.log(new_features_layer)
  //  console.log('----------');
 //   console.log('----------');
  //  update_plot(new_features_layer);
});
shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
mayFlyer(mapContainer.current, siteRef.current);
     }
   useEffect(() => {  
     
   if (_isMounted.current){
     initMap();
     
   }  
   return () => { _isMounted.current = false }; 
   },[input]);
   
   const handleSite=(e)=>{
    setInput(!input);
    siteRef.current = e.target.value;
    if (shorelineLayer.current != null){
      mapContainer.current.removeLayer(shorelineLayer.current);
      }
      shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
   
    mayFlyer(mapContainer.current, siteRef.current);
  
  }

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = userinfo;
    
    console.log(`${value} is ${checked}`);
    console.log(value);
   
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
  

  const handleinput = event => {
    setEmail(event.target.value);
  };

  const handleSubmit=(e)=>{
    console.log('getting params!')
  console.log(email)
  console.log(siteRef.current)
console.log(userinfo['languages'])
console.log(extent)

//after submit
setEmail('')
  e.currentTarget.blur();
  }

  return (
    <>
    <div className="container">
    <div id="header">
      <h2>Report Generator</h2>
    </div>
    <div id="map" ref={mapContainer} className="map"></div>

    <pre><code className="javascript" id="code"></code></pre>
    <div className="row"style={{marginTop:'0px'}}>
    <div className="col-sm-2">
    <p style={{fontSize:"13px"}}>Site:</p>
</div>

<div className="col-sm-10">
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

<hr style={{marginTop:7, marginBottom:7}}/>
<p style={{"fontWeight":'bold'}}>Inundation Depth</p>
<div className="row">
    <div className="col-sm-3">

    <p style={{fontSize:'13px'}}>Return Period:</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" id="Year1" name="Year1" style={{fontSize:'13px', paddingLeft:1}}>
  <option value="5">5 Year</option>
  <option value="10">10 Year</option>
  <option value="25">25 Year</option>
  <option value="50">50 Year</option>
  <option value="100">100 Year</option>
  <option value="250">250 Year</option>
  <option value="MHWS">MHWS - No Waves</option>
</select>
             </div>
      </div>
      <div className="col-sm-3">

    <p style={{fontSize:'13px'}}>Return Period (Compare):</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" id="Year1" name="Year1" style={{fontSize:'13px', paddingLeft:1}}>
  <option value="5">5 Year</option>
  <option value="10">10 Year</option>
  <option value="25">25 Year</option>
  <option value="50">50 Year</option>
  <option value="100">100 Year</option>
  <option value="250">250 Year</option>
  <option value="MHWS">MHWS - No Waves</option>
</select>
             </div>
      </div>
      </div>
<div className="row">
    <div className="col-sm-3">

    <p style={{fontSize:'13px'}}>Climate Period:</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizon" />
             <label style={{fontSize:'13px'}}>Present Climate </label>
             </div>
      <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizon" />
             <label style={{fontSize:'12px'}}>2060</label>
             </div>
             <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizon" />
             <label style={{fontSize:'12px'}}>2100</label>
             </div>
             </div>
      </div>
      <div className="col-sm-3">

<p style={{fontSize:'13px'}}>Climate Period (Compare):</p>
  </div>
  <div className="col-sm-3">
  <div className="controls">
  <div className="form-check">
              <input type="radio" className="form-check-input" value="present" id="present"
           name="horizon" />
         <label style={{fontSize:'13px'}}>Present Climate </label>
         </div>
  <div className="form-check" style={{paddingLeft:'40px'}}>
              <input type="radio" className="form-check-input" value="2060" id="2060"
            name="horizon" />
         <label style={{fontSize:'12px'}}>2060</label>
         </div>
         <div className="form-check" style={{paddingLeft:'40px'}}>
              <input type="radio" className="form-check-input" value="2100" id="2100"
            name="horizon" />
         <label style={{fontSize:'12px'}}>2100</label>
         </div>
         </div>
  </div>
      </div>
      <div className="row">
    <div className="col-sm-3">

    <p style={{fontSize:'13px'}}>Climate Change Scenario:</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <div className="form-check" style={{paddingLeft:'23px'}}>
                  <input type="radio" className="form-check-input" value="SSP2" id="SSP2"
                name="gender"  />
             <label style={{fontSize:'12px'}}>SSP2 4.5</label>
             </div>
             <div className="form-check" style={{paddingLeft:'60px'}}>
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="gender" />
             <label style={{fontSize:'12px'}}>SSP5 8.5</label>
             </div>
             </div>
      </div>
      <div className="col-sm-3">

    <p style={{fontSize:'13px'}}>Climate Change Scenario (Compare):</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <div className="form-check" style={{paddingLeft:'23px'}}>
                  <input type="radio" className="form-check-input" value="SSP2" id="SSP2"
                name="gender"  />
             <label style={{fontSize:'12px'}}>SSP2 4.5</label>
             </div>
             <div className="form-check" style={{paddingLeft:'60px'}}>
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="gender" />
             <label style={{fontSize:'12px'}}>SSP5 8.5</label>
             </div>
             </div>
      </div>
      </div>

      <hr style={{marginTop:7, marginBottom:7}}/>
      <p style={{"fontWeight":'bold'}}>Shoreline Change Analysis</p>
    <div className="row">
    <div className="col-sm-2">

    <p style={{fontSize:'13px'}}>Year:</p>
      </div>

      <div className="col-sm-10" >
        
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
                      
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                      style={{paddingLeft:"3px", fontSize:"12px"}}
                    >
                        {x.id}
                    </label>
                  </div>
                ))

                  ))}
              </div>
  
</div>

      </div>


      <hr style={{marginTop:7, marginBottom:7}}/>
      <p style={{"fontWeight":'bold'}}>Risks</p>

      <div className="row">
    <div className="col-sm-2">

    <p style={{fontSize:'13px'}}>Asset:</p>
      </div>
      <div className="col-sm-3">
      <div className="controls">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizon" />
             <label style={{fontSize:'13px'}}>Population </label>
             </div>
      <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizon" />
             <label style={{fontSize:'12px'}}>Building</label>
             </div>
             </div>
      </div>
      <div className="col-sm-2">

    <p style={{fontSize:'13px'}}>Impact Type:</p>
      </div>
      <div className="col-sm-5">
      <div className="controls">
      <div className="form-check" style={{paddingLeft:'0px'}}>
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizon" />
             <label style={{fontSize:'12px'}}>% Exposed </label>
             </div>
      <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizon" />
             <label style={{fontSize:'12px'}}># Exposed</label>
             </div>
             <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizon" />
             <label style={{fontSize:'12px'}}>Economic Damage</label>
             </div>
             <div className="form-check" style={{paddingLeft:'40px'}}>
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizon" />
             <label style={{fontSize:'12px'}}>% Damage</label>
             </div>
             </div>
      </div>
      </div>

      <hr style={{marginTop:7, marginBottom:7}}/>
      <p style={{"fontWeight":'bold'}}>Generate</p>
      <div className="row"style={{marginTop:'0px'}}>
    <div className="col-sm-2">
    <p style={{fontSize:"13px"}}>Sent to:</p>
</div>

<div className="col-sm-10">
<input type="text" className="form-control" id="usr" value={email} onChange={handleinput} style={{fontSize:'13px', paddingLeft:1}} placeholder="Email (e.g divesha@spc.int)"/>


</div>
</div>
<div className="row"style={{marginTop:'10px', textAlign:'center'}}>

<div className="col-sm-12">

<button type="button" className="btn btn-primary"  onClick={handleSubmit}>Submit for Processing</button>

</div>
</div>

<p style={{marginTop:7, marginBottom:7}}/>

</div>
</>
  );

};

export default SignUp;
