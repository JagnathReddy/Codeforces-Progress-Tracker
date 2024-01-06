document.getElementById("json").addEventListener("click", downloadJSON);
document.getElementById("csv").addEventListener("click", downloadCSV);

async function getLink() {
    let id = await chrome.storage.local.get("sheetId");
    if (id["sheetId"]) {
        return id["sheetId"]
    } else {
        return -1;
    }
}

document.querySelector("#message a").addEventListener("click", () => { document.getElementById("sheetLink").focus(); })
function checkLink() {
    getLink().then(value => {
        console.log(value);
        if (value == -1) {
            document.getElementById("message").style.display = "block";
            document.getElementById("sheetIn").style.display = "block";

            document.getElementById("sheetbtn").addEventListener("click", () => {
                let obj = { "sheetId": document.getElementById("sheetLink").value };
                chrome.storage.local.set(obj);
            });

        } else {
            let sheet = document.getElementById("sheet");
            sheet.style.display = "block";
            sheet.addEventListener("click", () => {
                chrome.tabs.create({ 'url': `https://docs.google.com/spreadsheets/d/${value}/edit#gid=0` });
            })
        }
    })
}
checkLink();


document.getElementById("editLink").addEventListener("click", () => {
    document.getElementById("sheetIn").style.display = "block";
    document.getElementById("message2").style.display = "block";
    
    chrome.storage.local.get(["sheetId"]).then((data) => {
        document.getElementById("sheetLink").value=data["sheetId"];
    })
    document.getElementById("sheetbtn").addEventListener("click", () => {
        let obj = { "sheetId": document.getElementById("sheetLink").value };
        chrome.storage.local.set(obj);
    });
})

function downloadJSON() {
    chrome.storage.local.get(["solved"]).then(data => {
        console.log(data["solved"]);
        const aTag = document.createElement('a');
        let dataString = "data:text/json;charset=utf-8," + JSON.stringify(data["solved"]);
        aTag.setAttribute('href', dataString);
        aTag.setAttribute('download', "data.json");
        aTag.click();
        aTag.remove();
    })
}

document.getElementById("linkedin").addEventListener("click", ()=>{
    chrome.tabs.create({ 'url': `https://www.linkedin.com/in/jagnath-reddy/` });
})

function downloadCSV() {
    chrome.storage.local.get(["solved"]).then(data => {
        console.log(data["solved"]);
        const aTag = document.createElement('a');
        let csvString = "Problem,Rating,Tags,Time Taken,Link,Remark,Date Time\n"
        for (let value of data["solved"]) {
            for (let cellValue of value) {
                csvString += cellValue.replace(",", "|") + ",";
            }
            csvString += "\n";
        }
        let dataString = "data:text/csv;charset=utf-8," + csvString;
        aTag.setAttribute('href', dataString);
        aTag.setAttribute('download', "data.csv");
        aTag.click();
        aTag.remove();
    })
}