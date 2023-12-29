let recentSubmissions = document.querySelector(".status-frame-datatable tbody").children[1].querySelector(".status-cell");
let html=`<div class="toast"><div class="toast-content"><i class="fas fa-solid fa-check check"></i><div class="message"><span class="text text-1">Accecpted</span><span class="text text-2">you took x minutes to solve this problem</span><span class="text text-2">Updating spreadsheet...</span></div></div><i class="fa-solid fa-xmark close"></i><div class="progress"></div></div>`


let toast=document.createElement('div');
toast.innerHTML=html;
toast=toast.firstChild;
let progress=toast.querySelector('.progress')
let timer1, timer2;
document.body.appendChild(toast);

const config = { attributes: true, childList: true, subtree: true }

const callback = (mutationList, observer) => {
    if (recentSubmissions.querySelector(".verdict-accepted")) {
        toast.classList.add("active");
        progress.classList.add("active");
        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000);
        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, 5300);
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

(async () => {
    let problemName = document.querySelector(".status-frame-datatable tbody").children[1].querySelector('[data-problemid]').children[0].innerHTML;
    let problem={
        contest:problemName.match(/\d+/)[0],
        problem:problemName.match(/[A-Z]\d?/)[0]
    }
    downloadObjectAsJson(problem,"problem")
    const response = await chrome.runtime.sendMessage(problem);
    // do something with response here, not outside the function
    console.log(response);
  })();


