// add react components for our Domo app
const handleDomo = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({width:'hide'},350);
    
    if($("#domoName").val() == '' || $("#domoAge").val()=='') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

// create React JSX for Add Domo form
const DomoForm = (props) => {
  return (
    <form id="domoForm" 
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );  
};

// determine what to draw
const DomoList = function(props) {
  if(props.domos.length===0) {
      return (
      <div className="domoList">
          <h3 className="emptyDomo">No Domos yet</h3>
          </div>
      );
  } 
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });
    
    return (
    <div className="domoList">{domoNodes}</div>
    );
};

// add domos from server and render a domo list
const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
       ReactDOM.render(
       <DomoList domos={data.domos} />, document.querySelector("#domos")
       ); 
    });
};

// setup to call server to get domos
const setup = function(csrf) {
  ReactDOM.render(
  <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
    ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
    );
    loadDomosFromServer();
};

// get token when you need it and load react components
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// when page loads, call getToken method
$(document).ready(function() {
    getToken();
});