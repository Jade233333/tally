// ==UserScript==
// @name         Tally
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show time spend on website today
// @author       Jade233333
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';


    // confgi
    const CONFIG = {
        limit: 1800,
        domains: [
            'youtube.com',
        ],
        style: {
            fontSize: '72px',
        },
    };


    function applyStyle(el, style) {
        for (const [k, v] of Object.entries(style)) {
            el.style[k] = v;
        }
    }

    // create emtpy timer dispaly element template
    function createTimerDisplay() {
        const DEFAULTS = {
            fontSize: '64px',
            fontFamily: 'monospace',
            padding: '16px 32px',
            borderRadius: '12px',
        };
        const ENFORCED = {
            position :'fixed',
            top :'50%',
            left :'50%',
            transform :'translate(-50%, -50%)',
            'z-index' :'2147483647',
        }
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        // first oad defualts
        // then overwritten by user's
        // then enforced to ensure critical features
        applyStyle(timerDisplay, DEFAULTS);
        applyStyle(timerDisplay, CONFIG.style);
        applyStyle(timerDisplay, ENFORCED);
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
        timerDisplay.style.background = `rgba(255, 255, 255, ${opacity})`;
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
    function initializeDomain(domain) {
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
        return Math.min(seconds / limit, 0.9);
    }

    // if match, run!!!
    function matchDomain() {
        const host = location.hostname;

        for (const domain of CONFIG.domains) {
            // check perfect match or contain
            // add . to prevent something like notyoutube.com to match
            if (host === domain || host.endsWith('.' + domain)) {
                return domain;  // use the config entry as the storage key
            }
        }
        return null;  // not in the list, don't track
    }

    // test code here to clear previous data
    // GM_deleteValue("youtube.com_time");
    // GM_deleteValue("youtube.com_day");

    // init
    const domain = matchDomain();
    // if not match stop the script entirely
    if (domain === null) { return; }
    initializeDomain(domain);
    const timerDisplay = createTimerDisplay();

    // main loop
    setInterval(() => {
        if (document.visibilityState === 'visible' && document.hasFocus()) {
            const secs = incrementTime(domain);
            const opacity = calcOpacity(secs, CONFIG.limit);
            updateTimerDisplay(timerDisplay, secs, opacity);
        }
    }, 1000);

})();
