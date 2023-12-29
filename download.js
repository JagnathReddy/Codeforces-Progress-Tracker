async function download(){
    // let problemName = document.querySelector(".status-frame-datatable tbody").children[1].querySelector('[data-problemid]').children[0].innerHTML;
    let problem={
      type:"download",
    //   contest:problemName.match(/\d+/)[0],
    //   problem:problemName.match(/[A-Z]\d?/)[0]
    }
    const response = await chrome.runtime.sendMessage(problem);
    // do something with response here, not outside the function
    console.log(response)

    let data="data:text/csv;charset=utf-8,";
    data+=response.data;
    data+="\nhead1,head2\none,two";
    const aTag=document.createElement('a');
    aTag.setAttribute('href',data);
    aTag.setAttribute('download',"data.csv");
    aTag.click();
    aTag.remove();
    console.log(response);
  }

  document.getElementById('hh').addEventListener('click',download);