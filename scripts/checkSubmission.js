let recentSubmissions = document.querySelector(".status-frame-datatable tbody").children[1].querySelector(".status-cell");
let htmlString=
`<div class="toast">
<div class="toast-content">
  <i class="fas fa-solid fa-check check"></i>
  <div class="message">
    <span class="text text-1">Accecpted</span>
    <span class="text text-2">Click the input field to halt auto-update</span>
    <span class="text text-2">If left unattended, updates will occur without a remark.</span>
    </div>
    </div>
<div class="interaction">
<textarea cols="10" rows="2" id="remarkArea"></textarea>
<button class="update">Update!</button>
<i class="fa-solid fa-xmark close"></i>
<div class="progress"></div></div>
`

let toast=document.createElement('div');
toast.innerHTML=htmlString;
toast=toast.firstChild;
let progress=toast.querySelector('.progress')
let remark=toast.querySelector("#remarkArea");
let timer1, timer2;
document.body.appendChild(toast);

const config = { attributes: true, childList: true, subtree: true }

const callback = (mutationList, observer) => {
    if (recentSubmissions.querySelector(".verdict-accepted")) {
        toast.classList.add("active");
        progress.classList.add("active");
        timer1=setTimeout(()=>{
          toast.classList.remove("active");
          update();
        },5000)
        timer2=setTimeout(()=>{
            progress.classList.remove('active');
        },5300)
        remark.onfocus=function(){
            clearTimeout(timer1);
            clearTimeout(timer2);
        }
        toast.querySelector(".update").addEventListener("click",()=>{
            update();
            toast.classList.remove("active");
            progress.classList.remove('active');
        })

    }
};


const observer = new MutationObserver(callback);

observer.observe(recentSubmissions, config);



function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var s="data:text/csv;charset=utf-8, name,date\n jagnath,14/10/2003"
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     s);
    downloadAnchorNode.setAttribute("download", exportName + ".csv");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

// (async () => {
    // let problemName = document.querySelector(".status-frame-datatable tbody").children[1].querySelector('[data-problemid]').children[0].innerHTML;
    // let problem={
    //     contest:problemName.match(/\d+/)[0],
    //     problem:problemName.match(/[A-Z]\d?/)[0]
    // }
//     downloadObjectAsJson(problem,"problem")
//     const response = await chrome.runtime.sendMessage(problem);
//     // do something with response here, not outside the function
//     console.log(response);
//   })();


async function update() {
    const request={}    
    let problemName = document.querySelector(".status-frame-datatable tbody").children[1].querySelector('[data-problemid]').children[0].innerHTML;
    let problem={}
    try {
        problem.contest=problemName.match(/\d+/)[0],
        problem.problem=problemName.match(/[A-Z]\d?/)[0]
    } catch (error) {
        problem.contest=window.location.href.match(/\d+/)[0];
        problem.problem=problemName.match(/[A-Z]\d?/)[0]
    
    }
    
    request.type="problemAccepted";
    request.problem=problem;
    request.remark=document.querySelector("#remarkArea").value;
    request.submissionLink="https://codeforces.com"+document.querySelector(".status-frame-datatable tbody").children[1].querySelector(".view-source").getAttribute("href");
    request.problemDetails=await getTags(problem);
    const response = await chrome.runtime.sendMessage(request);
}

async function getTags(problem){
    let url=`https://codeforces.com/problemset/problem/${problem.contest}/${problem.problem}`
    let html=await fetch(url,{
        method: 'GET'
    }).then(response=>response.text())
        const dom=new DOMParser().parseFromString(html,"text/html");
        let tags=dom.querySelectorAll(".tag-box");
        let tagsArray=Array.from(tags,ele=>ele.textContent.replace(/\n */g, ''));
        let rating;
        let realTags=[]
        for(let i of tagsArray){
            if(i.charAt(0)=='*'){
                rating=i.substring(1);
            }else{
                realTags.push(i);
            }
        }
        return {
            rating,tags:realTags
        }
}


toast.classList.add("active");
        progress.classList.add("active");
        timer1=setTimeout(()=>{
          toast.classList.remove("active");
          update();
        },5000)
        timer2=setTimeout(()=>{
            progress.classList.remove('active');
        },5300)
        remark.onfocus=function(){
            clearTimeout(timer1);
            clearTimeout(timer2);
        }
        toast.querySelector(".update").addEventListener("click",()=>{
            update();
            toast.classList.remove("active");
            progress.classList.remove('active');
        })