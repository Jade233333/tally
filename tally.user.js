// ==UserScript==
// @name         Web Timer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show time spend on website this day
// @author       Zhou
// @match        *://www.youtube.com/*
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    // create emtpy timer dispaly template
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

    // update timer on display with data
    function updateTimerDisplay(timerDisplay, totalSeconds, opacity) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const pad = (n) => String(n).padStart(2, '0');
        timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        timerDisplay.style.color = `rgba(0, 0, 0, ${opacity})`;
    }

    // consider per top domain
    function getTopDomain() {
        const parts = location.hostname.split('.');
        return parts.slice(-2).join('.');
    }

    // 2026-01-01
    function getToday() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // init GM storage if empty
    function initializeDomain() {
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

    function incrementTime(domain) {
        const timeKey = domain + '_time';
        // ensure number not string
        const current = Number(GM_getValue(timeKey, 0));
        GM_setValue(timeKey, current + 1);
        return current + 1;
    }

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
            const opacity = calcOpacity(secs, 180);
            updateTimerDisplay(timerDisplay, secs, opacity);
        }
    }, 1000);

})();
