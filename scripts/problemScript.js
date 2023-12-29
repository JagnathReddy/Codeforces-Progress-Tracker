
const body=document.getElementsByTagName("body")[0];
const div = document.createElement('div');
let time={sec:0,min:0,hour:0};
div.innerHTML = 'Time :0:0:0';
div.style.position = 'fixed';
div.style.top = '0';
div.style.right = '0';
div.style.backgroundColor = 'lightblue';
div.style.boxShadow = '5px 5px 10px grey';
div.style.zIndex= 100000;
document.body.appendChild(div);
 
  
  (async () => {
    const url=window.location.href;
    let problem={
        contest:url.match(/\d+/)[0],
        problem:url.match(/[A-Z]\d?$/)[0]
    }
    let message={
        type:"problemGet",
        problem:problem
    }
    let response = await chrome.runtime.sendMessage(message);
    //get time
    console.log(response);
    if (response.time == -1) {
        let message = {
            type: "problemSet",
            problem: problem,
            time:Date.now()
        }
        response=await chrome.runtime.sendMessage(message);
    }else{
        const diffMillis=Date.now()-response.time;
        time=convertMillis(diffMillis);
    }
    console.log(response);
  })();




div.addEventListener("mouseenter",(event)=>{
    console.log(div.clientHeight);
    console.log(div.style.top)
    if(div.style.top=='0px'){
       div.style.top=div.clientHeight+"px";
    }else{
       div.style.top="0";
    }
    console.log("after " +div.style.top);
})

setInterval(()=>{
    time.sec+=1
    if(time.sec==60){
        time.sec=0;
        time.min+=1;
        if(time.min==60){
            time.min=0;
            time.hour++;
        }
    }
    div.innerText=`Time: ${time.hour}:${time.min}:${time.sec}`
},1000)



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
