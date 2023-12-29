chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.type == "problemGet") {
      console.log("get problem req");
      getStartTime(request.problem).then((value)=>{
        console.log(value);
        sendResponse({time:value});
      });
      return true;  //Asynchronously call sendResponse=> return true
    }else if(request.type == "problemSet"){
      console.log("set problem req");
      (async ()=>{  
        const problemName = request.problem.contest + request.problem.problem;
        const problemObj={};
        problemObj[problemName] = {"time":request.time,"accepted":false};
        chrome.storage.local.set(problemObj).then(() => {
          console.log("Value is set");
        });
        chrome.storage.local.get([problemName]).then((result) => {
          console.log(result);
        });
      })();
      sendResponse({"success":true});
    } else {
      console.log(request);
      const temp = [[]];
      temp[0].push(request.contest);
      temp[0].push(request.problem);
      fetch("https://script.google.com/macros/s/AKfycbwjTJ-Je-Wt-ky37XLrkwOLNnw_PMc_YAOdys1HHeWIcHToeusx0wcBKPz8y3wuOz82Ew/exec", {
        method: 'POST',
        mode: 'no-cors', // Required for CORS issues in Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(temp), // Convert the JavaScript object to a JSON string
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error('Error:', error);
        });
      sendResponse(request)
    };
  }
);

async function getStartTime(problem) {
  //problem={contest,problem}
  //example 1983,B;
  const problemName =problem.contest +problem.problem;
  console.log(problemName);
  let result=await chrome.storage.local.get([problemName])
    if (result[problemName]) {
      if (!result[problemName].accepted)   //not yet accepted => start timer where left previously
        return result[problemName].time;
      else
        return -1;
    } else {
      return -1;
    }
  ;
} 

async function setStartTime(problem,time){
  const problemName = problem.contest + problem.problem;
  const problemObj={};
  problemObj[problemName] = {"time":time,"accepted":false};
  chrome.storage.local.set(problemObj).then(() => {
    console.log("Value is set");
  });
}