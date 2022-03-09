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
  chrome.tabs.insertCSS({
    file: 'static/css/loader.css'
  }), chrome.tabs.executeScript({
    code: 'var currentTab = ' + JSON.stringify(tab)
  }, function() {
      chrome.tabs.executeScript({
        file: 'static/js/loader.js'
      })
  });
});