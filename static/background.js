chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: chrome.extension.getURL('index.html'), selected: true });
});
// open tab to get summary
// https://www.upwork.com/ab/reports/freelancer/weekly-summary?group_by=assignment&group_by_time=day&range=20220318-20220618&columns=company,hours,hours_offline,hours_online,hours_overtime,assignment_rate,charges,contract_type,payment_type,payment_description,task,task_description