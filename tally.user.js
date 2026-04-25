// ==UserScript==
// @name         Tally
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show time spend on website today
// @author       Jade233333
// @match        *://www.youtube.com/*
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    // create emtpy timer dispaly element template
    function createTimerDisplay() {
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 64px;
            font-family: monospace;
            z-index: 2147483647;
            pointer-events: none;
        `;
        document.body.appendChild(timerDisplay);
        return timerDisplay;
    }

    // update timer on display with data provided
    function updateTimerDisplay(timerDisplay, totalSeconds, opacity) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        // ensures 2 digit display 00
        const pad = (n) => String(n).padStart(2, '0');
        timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        timerDisplay.style.color = `rgba(0, 0, 0, ${opacity})`;
    }


    // 2026-01-01
    function getToday() {
        // the Date object
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // init GM storage if empty
    // return the domain name for later use
    function initializeDomain() {
        //  get the topdomain, consider topdomain per record 
        const parts = location.hostname.split('.');
        domain = parts.slice(-2).join('.');

        const domain = getTopDomain();
        const dayKey = domain + '_day';
        const timeKey = domain + '_time';

        if (GM_getValue(dayKey, null) === null) {
            // first time ever
            GM_setValue(dayKey, getToday());
            GM_setValue(timeKey, 0);
        } else if (GM_getValue(dayKey) !== getToday()) {
            // new day — reset
            GM_setValue(dayKey, getToday());
            GM_setValue(timeKey, 0);
        }

        return domain;
    }

    // update the GM storage for watching time per second
    function incrementTime(domain) {
        const timeKey = domain + '_time';
        // ensure number not string
        const current = Number(GM_getValue(timeKey, 0));
        GM_setValue(timeKey, current + 1);
        return current + 1;
    }

    // determine opacity value based on limit user set and current time spending
    function calcOpacity(seconds, limit) {
        return Math.min(seconds / limit, 1);
    }

    // test code here to clear previous data
    // GM_deleteValue("youtube.com_time");
    // GM_deleteValue("youtube.com_date");

    // init
    const domain = initializeDomain();
    const timerDisplay = createTimerDisplay();

    // main loop
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            const secs = incrementTime(domain);
            const opacity = calcOpacity(secs, 1800);
            updateTimerDisplay(timerDisplay, secs, opacity);
        }
    }, 1000);

})();
