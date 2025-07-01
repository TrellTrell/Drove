const droveVersion = "1.0";

const droveSettings = {
    "remove_no_prices": 1,
    "modal_tab_styles": 0
};

if (!localStorage.getItem('droveSettingsStore')) {
    localStorage.setItem('droveSettingsStore', JSON.stringify({}))
}

let droveSettingsStore = JSON.parse(localStorage.getItem('droveSettingsStore'));

// Initialize settings store
function initializeDroveSettings() {
    if (Object.keys(droveSettingsStore).length === 0) {
        // Initialize with default values
        for (let key in droveSettings) {
            droveSettingsStore[key] = droveSettings[key];
        }
    } else {
        // Only add missing keys, don't overwrite existing ones
        for (let key in droveSettings) {
            if (!(key in droveSettingsStore)) {
                droveSettingsStore[key] = droveSettings[key];
            }
        }
    }
    
    localStorage.setItem('droveSettingsStore', JSON.stringify(droveSettingsStore));
}

initializeDroveSettings();

// Function to change a setting
function changeDroveSetting(key, value) {
    if (key in droveSettingsStore) {
        droveSettingsStore[key] = value;
        
        localStorage.setItem('droveSettingsStore', JSON.stringify(droveSettingsStore));
        
        console.log(`Setting '${key}' changed to ${value}`);
    } else {
        console.error(`Setting '${key}' does not exist`);
    }
}





// Insert Drove Section
function insertDroveSectionBetween(topSelector, bottomSelector) {
    const topElem = document.querySelector(topSelector);
    const bottomElem = document.querySelector(bottomSelector);

    if (document.querySelector('#drove-section')) return;

    const settingsSection = document.createElement('div');
    settingsSection.innerHTML = `
        <hr>
        <div class="side-tabs-category-text-container">
            <p>DROVE</p>
        </div>
        <div class="side-tabs-button" id="drove-tab-drove" onclick="setDroveTab('drove');">
            <p>Drove</p>
        </div>
        <div class="side-tabs-button" id="drove-tab-tweaks" onclick="setDroveTab('tweaks');">
            <p>Settings</p>
        </div>
    `;
    settingsSection.id = 'drove-section';

    if (topElem && bottomElem && topElem.parentNode === bottomElem.parentNode) {
        topElem.parentNode.insertBefore(settingsSection, bottomElem);
    } else if (topElem) {
        topElem.parentNode.insertBefore(settingsSection, topElem.nextSibling);
    } else if (bottomElem) {
        bottomElem.parentNode.insertBefore(settingsSection, bottomElem);
    }
}

function overrideSettingDisclaimer() {
    const target = document.querySelector('.modalv3-side-tabs-app-info-container');
    if (target && !target.dataset.overridden) {
        let redirect = "stable";
        if (appType === "Dev") {
            redirect = "developer";
        }
        target.innerHTML = `
            <div>
                <p>Site made by:</p>
                <a class="link" href="https://github.com/DTACat/" target="_blank">DTACat</a>
            </div>
            <div>
                <p>Shop Archives</p>
                <a class="link" href="https://github.com/ShopArchives/${redirect}" target="_blank">${typeof appVersion !== 'undefined' ? appVersion : 'vUnknown'}</a>
            </div>
            <div>
                <p>Drove</p>
                <a class="link" href="https://github.com/TrellTrell/Drove" target="_blank">${droveVersion}</a>
            </div>
        `;
        target.dataset.overridden = "true";
    }
}

function overrideSettingPag() {
    const target = document.querySelector('#category_page_limit_select');
    if (target && !target.dataset.overridden) {
        target.innerHTML = `
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="9999">No Limit</option>
        `;
        const selectEl = document.querySelector('#category_page_limit_select');

        for (const option of selectEl.options) {
            if (option.value === String(settingsStore.category_page_limit)) {
                option.selected = true;
                break;
            }
        }
        target.dataset.overridden = "true";
    }
}

const handleImage = img => {
    if (!img.dataset._hasErrorHandler) {
        img.onerror = () => {
            img.style.opacity = '0';
        };
        img.dataset._hasErrorHandler = 'true'; // prevent re-adding
    }
};
const scanImages = () => {
    document.querySelectorAll('img').forEach(handleImage);
};
scanImages();

function clearTextFromTabs() {
    if (droveSettingsStore.modal_tab_styles === 1) {
        const tabs = document.querySelectorAll('.modalv2-tabs-container .tab');
        tabs.forEach(tab => {
            tab.querySelectorAll('p').forEach(p => {
                p.remove();
            });

            tab.querySelectorAll('svg').forEach(svg => {
                svg.style.marginRight = '0px';
            });
        });
    } else if (droveSettingsStore.modal_tab_styles === 2) {
        const tabs = document.querySelectorAll('.modalv2-tabs-container .tab');
        tabs.forEach(tab => {
            tab.querySelectorAll('svg').forEach(svg => {
                svg.remove();
            });
        });
    }
}

function removeElementWithText(targetText) {
    if (droveSettingsStore.remove_no_prices === 1) {
        const allElements = document.querySelectorAll('body *');

        allElements.forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                if (el.textContent.trim() === targetText) {
                    el.parentElement.remove();
                }
            }
        });
    }
}



const observer1 = new MutationObserver(() => {
    removeElementWithText("US$0.00");
    clearTextFromTabs();
    scanImages();
    overrideSettingPag();
    overrideSettingDisclaimer();

    insertDroveSectionBetween('#modal-v3-tab-appearance', '.bottom-element');
});
observer1.observe(document.body, {
    childList: true,
    subtree: true
});





function setDroveTab(tab) {
    if (!document.getElementById("modalv3-right-content-container-inner")) {
        openNewDiscordLikeSettings();
    }
    const tabPageOutput = document.getElementById("modalv3-right-content-container-inner");

    if (document.querySelector(".modalv3-tab-selected")) {
        document.querySelectorAll('.modalv3-tab-selected').forEach((el) => {
            el.classList.remove("modalv3-tab-selected");
        });
    }

    document.getElementById("modalv3-right-content-container").scrollTo(0,0);
    document.getElementById("drove-tab-" + tab).classList.add("modalv3-tab-selected");

    if (tab === "drove") {
        tabPageOutput.innerHTML = `
            <h2>Drove</h2>

            <hr>

            <div class="modalv3-content-card-1">
                <p class="modalv3-content-card-summary">Drove is a Shop Archives client modification that adds quality of life features for the best browsing experience.</p>
            </div>

            <hr>

            <div class="drove-quickAction-container">
                <button class="drove-quickAction-button" onclick="location.reload()">
                    <svg role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4 12a8 8 0 0 1 14.93-4H15a1 1 0 1 0 0 2h6a1 1 0 0 0 1-1V3a1 1 0 1 0-2 0v3a9.98 9.98 0 0 0-18 6 10 10 0 0 0 16.29 7.78 1 1 0 0 0-1.26-1.56A8 8 0 0 1 4 12Z"></path>
                    </svg>
                    Refresh
                </button>
                <button class="drove-quickAction-button" onclick="window.open('https://github.com/TrellTrell/Drove', '_blank')">
                    <svg role="img" width="24" height="24" viewBox="-3 -3 30 30">
                        <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.577C20.565 21.797 24 17.298 24 12c0-6.63-5.37-12-12-12z"></path>
                    </svg>
                    View Source Code
                </button>
            </div>

        `;

    } else if (tab === "tweaks") {
        tabPageOutput.innerHTML = `
            <h2>Settings</h2>

            <hr>

            <div class="modalv3-content-card-1">
                <h2 class="modalv3-content-card-header">Misc</h2>
                <div class="setting">
                    <div class="setting-info">
                        <div class="setting-title">Remove $0 Prices</div>
                        <div class="setting-description">If an item is priced at $0, it hides the price.</div>
                    </div>
                    <div class="toggle-container">
                        <div class="toggle" id="remove_no_prices_toggle">
                            <div class="toggle-circle"></div>
                        </div>
                    </div>
                </div>
                <div class="setting">
                    <div class="setting-info">
                        <div class="setting-title">Modal Tab Styles</div>
                        <div class="setting-description">Changes how the tabs on item and category modals look.</div>
                    </div>
                    <div class="toggle-container">
                        <select id="modal_tab_styles_select" class="modalv3-experiment-treatment-container">
                            <option value="0">Both Icons and Text</option>
                            <option value="1">Icons Only</option>
                            <option value="2">Text Only</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        updateToggleStates();

        tabPageOutput.querySelector('#remove_no_prices_toggle').addEventListener("click", () => {
            toggleSetting('remove_no_prices');
            updateToggleStates();
            try {
                loadPage(currentPageCache, true);
            } catch {}
        });


        const selectEl = document.querySelector('#modal_tab_styles_select');

        for (const option of selectEl.options) {
            if (option.value === String(droveSettingsStore.modal_tab_styles)) {
                option.selected = true;
                break;
            }
        }

        selectEl.addEventListener('change', () => {
            const selectedValue = selectEl.value;
            changeDroveSetting('modal_tab_styles', Number(selectedValue));
        });

    } else {
        console.error(tab + ' is not a valid tab');
    }

    // Function to toggle a setting (0 or 1)
    function toggleSetting(key) {
        if (key in droveSettingsStore) {
            const newValue = droveSettingsStore[key] === 0 ? 1 : 0;
            changeDroveSetting(key, newValue);
        }
    }

    // Update toggle visual states
    function updateToggleStates() {
        for (let key in droveSettingsStore) {
            const toggle = document.getElementById(key + '_toggle');
            if (toggle) {
                if (droveSettingsStore[key] === 1) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }
            }
        }
    }
}
