
const body = document.getElementsByTagName("body")[0];
const url = window.location.href;
let problem = {
    contest: url.match(/\d+/)[0],
    problem: url.match(/[A-Z]\d?$/)[0]
}
const html =
    `
<div class="outerBox" style="background-color:#4070f4; position: fixed; top:0; right:0; padding:0px; margin:0; display:flex;flex-direction:column; z-index:1000; opacity:0.7">
<p style="font-size:15px;padding:8px;margin:0;">Time : 00:00:00</p> 
<button id="reset" style="cursor:pointer;margin:0;">Reset</button>
</div>
`
let div = document.createElement('div');
let time = { sec: 0, min: 0, hour: 0 };
div.innerHTML = html;
div = div.firstElementChild;
document.body.appendChild(div);


(async () => {
    let message = {
        type: "problemGet",
        problem: problem
    }
    let response = await chrome.runtime.sendMessage(message);
    //get time
    if (response.time == -1) {
        let message = {
            type: "problemSet",
            problem: problem,
            time: Date.now()
        }
        response = await chrome.runtime.sendMessage(message);
    } else {
        const diffMillis = Date.now() - response.time;
        time = convertMillis(diffMillis);
    }
})();


div.firstElementChild.addEventListener("mouseenter", (event) => {
    if (div.style.top == '0px') {
        div.style.top = div.clientHeight + "px";
    } else {
        div.style.top = "0";
    }
})

div.children[1].addEventListener("click", () => {

    // let problem={
    //     contest:url.match(/\d+/)[0],
    //     problem:url.match(/[A-Z]\d?$/)[0]
    // }
    let message = {
        type: "problemSet",
        problem: problem,
        time: Date.now()
    }
    chrome.runtime.sendMessage(message);
    time.sec = 0;
    time.min = 0;
    time.hour = 0;
})
setInterval(() => {
    time.sec += 1
    if (time.sec == 60) {
        time.sec = 0;
        time.min += 1;
        if (time.min == 60) {
            time.min = 0;
            time.hour++;
        }
    }
    div.querySelector("p").innerText = `Time: ${time.hour}:${time.min}:${time.sec}`
}, 1000)

async function syncTime() {
    let message = {
        type: "problemGet",
        problem: problem
    }
    let response = await chrome.runtime.sendMessage(message);
    const diffMillis = Date.now() - response.time;
    time = convertMillis(diffMillis);
}
setInterval(syncTime, (1000) * (60) * (5));

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

