
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    var responseStatus = { bCalled: false };
    if (request.type == "problemGet") {
      getStartTime(request.problem).then((value) => {
        console.log(value+"herererrere");
        sendResponse({ "time": value });
        console.log("value sent 1");
        responseStatus.bCalled= true;
      });
      console.log("value sent 2");
      return true  //Asynchronously call sendResponse=> return true
    } else if (request.type == "problemSet") {
      console.log("set problem req");
      setStartTime(request.problem, request.time);
      sendResponse({ "success": true });
    } else if(request.type == "problemAccepted") {
      //request.problem={contest, problem}
      //request.remark=""
      //request.problemDetails={rating,tags:[]}
      //request.submissionLink=""
      //get start time 
      console.log(request); 
      responseStatus.bCalled= true;
      getStartTime(request.problem).then(startTime => {
        if (startTime == -1) {
          sendResponse({ "success": false, "error": "Start time not registered" })
          return;
        }
        const totalTime = convertMillis(Date.now() - startTime);
        console.log(totalTime);
        const totalTimeString = `${totalTime.hour}:${totalTime.min}:${totalTime.sec}`;
        const temp = [[]];
        temp[0].push(request.problem.contest + request.problem.problem);
        temp[0].push(request.problemDetails.rating + " ");
        temp[0].push(request.problemDetails.tags.join(",") + " ");
        temp[0].push(totalTimeString);
        temp[0].push(request.submissionLink);
        temp[0].push(request.remark);
        temp[0].push((new Date()).toLocaleString());
        console.log(temp);
        let req = {};
        chrome.storage.local.get(["sheetId"]).then((id) => {
          console.log(id)
          req.id=id["sheetId"];
          req.data = temp;
          console.log(req);
          fetch("https://script.google.com/macros/s/AKfycbw0iGxPdJG-_qKlyoJLoeTCDJfjINta3xzAxIvXlMmZyXdfKmyu6ZGpAcsOGJzWbkQg0w/exec", {
            method: 'POST',
            mode: 'no-cors', // Required for CORS issues in Google Apps Script
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req), // Convert the JavaScript object to a JSON string 
          })
          //update locally
          chrome.storage.local.get(["solved"]).then(value=>{
            let solved=[]
            try {
              for(let v of value["solved"]){
                solved.push(v);
                console.log(v);
              }
            } catch (error) {
              
            }
            solved.push(temp[0]);
            let obj={"solved":solved};
            chrome.storage.local.set(obj);
          })
        });
        sendResponse({ "success": true})
      });
      if(responseStatus.bCalled)return true;
    };
  }
);

async function getStartTime(problem) {
  //problem={contest,problem}
  //example 1983,B;
  const problemName = problem.contest + problem.problem;
  console.log(problemName);
  let result = await chrome.storage.local.get([problemName])
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

async function setStartTime(problem, time) {
  const problemName = problem.contest + problem.problem;
  const problemObj = {};
  problemObj[problemName] = { "time": time, "accepted": false };
  chrome.storage.local.set(problemObj).then(() => {
    console.log("Value is set");
  });
}



function convertMillis(millis) {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  
  seconds = seconds % 60;
  minutes = minutes % 60;
  
  return {
      hour: hours,
      min: minutes,
      sec: seconds
  };
}
