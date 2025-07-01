// ==UserScript==
// @name         Drove
// @namespace    https://github.com/TrellTrell/Drove
// @version      1.1
// @description  Drove is a Shop Archives client modification that adds quality of life features for the best browsing experience.
// @author       TrellTrell
// @match        *://*.yapper.shop/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @icon         https://github.com/TrellTrell/Drove/blob/main/logo.png?raw=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/TrellTrell/Drove/src/scripts.js';
    document.body.appendChild(script);

    const css = document.createElement('link');
    css.href = 'https://cdn.jsdelivr.net/gh/TrellTrell/Drove/src/styles.css';
    css.rel = 'stylesheet';
    document.head.appendChild(css);

})();
