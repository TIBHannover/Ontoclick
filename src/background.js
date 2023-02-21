'use strict';

// Add listener to create ontoclick context menu items when the extension is installed
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'termclick-en',
    title: 'TermClick',
    type: 'normal',
    contexts: ['all']
  });
});

// Add listener to create ontoclick context menu items on Chrome broswer startup
chrome.runtime.onStartup.addListener(function() {
  chrome.contextMenus.create({
    id: 'termclick-en',
    title: 'TermClick',
    type: 'normal',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
  chrome.scripting.insertCSS({
    target: {
      tabId: tab.id
    },
    files: ['static/css/loader.css']
  }), chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    func: (tab) => {'var currentTab = ' + JSON.stringify(tab)}
  }, function() {
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        files: ['static/js/loader.js']
      })
  });
});