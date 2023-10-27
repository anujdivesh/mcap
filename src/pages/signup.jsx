import React from 'react';
import { useNavigate} from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="container">
    <div id="header">
      <h2>MCAP Dashboard</h2>
    </div>
    <p>This dashboard was developed under the Managing Coastal Acquifers Project. The portal provides home for gridded and geospatial data produced by the project. </p>

    <pre><code className="javascript" id="code"></code></pre>
   
    <div className="row" >
    <div className="col-sm-2" style={{marginLeft:'7%'}}>
      </div>
    <div className="col-sm-3">

    <div className="card" style={{width: "100%"}}>

  <img src={require('../images/laura.png')} className="card-img-top" alt="Loading.."style={{height:'160px'}}/>
  <div className="card-body">
    <h5 className="card-title">Explorer</h5>
    <p className="card-text" style={{fontSize:'13px'}}>Shows a number of datasets produced by the project.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/mcap/explorer')}}>Browse {">"}</button>
  </div>
</div>
</div>
<div className="col-sm-3">

    <div className="card" style={{width: "100%"}}>

  <img src={require('../images/cat111.png')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
  <div className="card-body">
    <h5 className="card-title">Reports</h5>

    <p className="card-text" style={{fontSize:'13px'}}>A collection of reports produced.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/mcap/reports')}}>Browse {">"}</button>
  </div>
</div>
</div>

</div>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<div style={{textAlign: 'center', fontWeight:'bold', color:'#979797'}}>
  Developed and Funded by:
  <div className="row" style={{marginTop:'5px'}}>
    <div className="col-sm-12" >
    <img src={require('../images/logos/marshal.png')} className="card-img-top" alt="Loading.." style={{height:'45px', width:'90px', paddingRight:"8px"}}/>
    <img src={require('../images/logos/palauflag.jpg')} className="card-img-top" alt="Loading.." style={{height:'45px', width:'90px', paddingRight:"8px"}}/>
    <img src={require('../images/logos/tuvaluflag.png')} className="card-img-top" alt="Loading.." style={{height:'45px', width:'90px', paddingRight:"8px"}}/>
    
    <img src={require('../images/spc11.png')} className="card-img-top" alt="Loading.." style={{height:'45px', width:'110px', paddingRight:"0px"}}/>
     
    <img src={require('../images/logos/UNDP-Logo-Blue-Large.png')} className="card-img-top" alt="Loading.."style={{height:'80px', width:'58px', marginLeft:"-5px"}}/>
    <img src={require('../images/gef.png')} className="card-img-top" alt="Loading.."style={{height:'58px', width:'47px', marginLeft:"-5px"}}/>
   
     </div>
      </div>
</div>

</div>
</>
  );

};

export default SignUp;

