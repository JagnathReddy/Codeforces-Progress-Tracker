
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var responseStatus = { bCalled: false };
    if (request.type == "problemGet") {
      getStartTime(request.problem).then((value) => {
        sendResponse({ "time": value });
        responseStatus.bCalled= true;
      });
      return true  //Asynchronously call sendResponse=> return true
    } else if (request.type == "problemSet") {
      setStartTime(request.problem, request.time);
      sendResponse({ "success": true });
    } else if(request.type == "problemAccepted") {
      //request.problem={contest, problem}
      //request.remark=""
      //request.problemDetails={rating,tags:[]}
      //request.submissionLink=""
      //get start time 
      responseStatus.bCalled= true;
      getStartTime(request.problem).then(startTime => {
        if (startTime == -1) {
          sendResponse({ "success": false, "error": "Start time not registered" })
          return;
        }
        const totalTime = convertMillis(Date.now() - startTime);
        const totalTimeString = `${totalTime.hour}:${totalTime.min}:${totalTime.sec}`;
        const temp = [[]];
        temp[0].push(request.problem.contest + request.problem.problem);
        temp[0].push(request.problemDetails.rating + " ");
        temp[0].push(request.problemDetails.tags.join(",") + " ");
        temp[0].push(totalTimeString);
        temp[0].push(request.submissionLink);
        temp[0].push(request.remark);
        temp[0].push((new Date()).toLocaleString());
        let req = {};
        chrome.storage.local.get(["sheetId"]).then((id) => {
          req.id=id["sheetId"];
          req.data = temp;
          fetch("https://script.google.com/macros/s/AKfycbz-gDU8F-OyNWOkbIDQDMft4QBequgK4IPY-E7Zidr7QsvotEjn-PPYEG8pfgQsoIgmTA/exec", {
            
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
  chrome.storage.local.set(problemObj)
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
