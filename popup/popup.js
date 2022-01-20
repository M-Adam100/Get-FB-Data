document.querySelector('#posts').addEventListener('change',(e) => {
    chrome.storage.local.set({ number: document.querySelector('#posts').value})
})

document.querySelector('#Get_Data').addEventListener('click', () => {
    const query = { active: true, currentWindow: true };
    function callback(tabs) {
        const currentTab = tabs[0]; 
        chrome.scripting.executeScript(
            {
              target: {tabId: currentTab.id},
              files: ['scripts/json2csv.js','scripts/capture-data.js']
            },
            () => { console.log("Executed Script")});
      }

    chrome.tabs.query(query, callback);


})

chrome.storage.local.set({ number: document.querySelector('#posts').value})








