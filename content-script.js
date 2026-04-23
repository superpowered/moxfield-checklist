(() => {
  // Global state
  let deckId = null;
  let checklistEnabled = false;
  let checkedCards = [];

  // Event listeners
  let enableEV = null;
  let clearEV = null;
  let searchDropdownEV = null;
  let groupDropdownEV = null;
  let sortDropdownEV = null;
  let checklistEVs = [];
  let collapseEvs = [];

  // DOM items
  let searchDropdown,
    groupDropdown,
    sortDropdown,
    enableChecklistBtn,
    clearChecklistBtn,
    enableChecklistEnableText,
    deckView = null;

  // SVG icons
  const checkListSVG = `<svg role="img" aria-hidden="true" class="svg-inline--fa me-2" viewBox="0 0 199 166" style="vertical-align: -2px;">
      <path fill="currentColor" d="M183.5 124.5C186.538 124.5 189 126.962 189 130C189 133.038 186.538 135.5 183.5 135.5H58C54.9624 135.5 52.5 133.038 52.5 130C52.5 126.962 54.9624 124.5 58 124.5H183.5Z" />
      <path fill="currentColor" d="M183.5 77.5C186.538 77.5 189 79.9624 189 83C189 86.0376 186.538 88.5 183.5 88.5H58C54.9624 88.5 52.5 86.0376 52.5 83C52.5 79.9624 54.9624 77.5 58 77.5H183.5Z" />
      <path fill="currentColor" d="M183.5 30.5C186.538 30.5 189 32.9624 189 36C189 39.0376 186.538 41.5 183.5 41.5H58C54.9624 41.5 52.5 39.0376 52.5 36C52.5 32.9624 54.9624 30.5 58 30.5H183.5Z" />
      <path fill="currentColor" d="M16 42H29V29H16V42ZM40 51C40 52.0357 39.2128 52.887 38.2041 52.9893L38 53H7L6.7959 52.9893C5.85435 52.8938 5.1062 52.1457 5.01074 51.2041L5 51V20C5 18.8954 5.89543 18 7 18H38C39.1046 18 40 18.8954 40 20V51Z" />
      <path fill="currentColor" d="M16 89H29V76H16V89ZM40 98C40 99.0357 39.2128 99.887 38.2041 99.9893L38 100H7L6.7959 99.9893C5.85435 99.8938 5.1062 99.1457 5.01074 98.2041L5 98V67C5 65.8954 5.89543 65 7 65H38C39.1046 65 40 65.8954 40 67V98Z" />
      <path fill="currentColor" d="M16 136H29V123H16V136ZM40 145C40 146.036 39.2128 146.887 38.2041 146.989L38 147H7L6.7959 146.989C5.85435 146.894 5.1062 146.146 5.01074 145.204L5 145V114C5 112.895 5.89543 112 7 112H38C39.1046 112 40 112.895 40 114V145Z" />
    </svg>`;
  const clearSVG = `<svg role="img" aria-hidden="true" class="svg-inline--fa me-2" viewBox="0 0 147 147" style="vertical-align: -2px;"><path fill="currentColor" d="M114.732 25.24C116.88 23.0921 120.362 23.0921 122.51 25.24C124.658 27.3878 124.658 30.8703 122.51 33.0181L33.7681 121.76C31.6202 123.908 28.1378 123.908 25.99 121.76C23.8421 119.612 23.8421 116.13 25.99 113.982L70.3609 69.6109L114.732 25.24Z"/><path fill="currentColor" d="M122.51 113.982C124.658 116.13 124.658 119.612 122.51 121.76C120.362 123.908 116.88 123.908 114.732 121.76L70.3609 77.3891L25.9899 33.0181C23.8421 30.8702 23.8421 27.3878 25.9899 25.24C28.1378 23.0921 31.6202 23.0921 33.7681 25.24L122.51 113.982Z"/></svg>`;
  const checkedBox = `<svg class="svg-inline--fa me-2" role="img" viewBox="0 0 147 147" aria-hidden="false" aria-label="Checked"><path d="M73.5 0C92.9934 0 111.688 7.74398 125.472 21.5279C139.256 35.3118 147 54.0066 147 73.5C147 92.9934 139.256 111.688 125.472 125.472C111.688 139.256 92.9934 147 73.5 147C54.0066 147 35.3118 139.256 21.5279 125.472C7.74398 111.688 0 92.9934 0 73.5C0 54.0066 7.74398 35.3118 21.5279 21.5279C35.3118 7.74398 54.0066 0 73.5 0ZM108.085 43.0167C105.755 41.3105 102.473 41.8356 100.767 44.1652H100.702L62.3114 96.9286L45.6752 80.2924C43.6409 78.258 40.2933 78.258 38.2589 80.2924C36.225 82.3267 36.225 85.6733 38.2589 87.7076L59.2589 108.708C60.3417 109.79 61.8518 110.316 63.394 110.218C64.9361 110.119 66.3146 109.332 67.2333 108.085L109.233 50.3348C110.939 48.0052 110.414 44.723 108.085 43.0167Z" /></svg>`;
  const uncheckedBox = `<svg class="svg-inline--fa me-2" role="img" viewBox="0 0 147 147" aria-hidden="false" aria-label="Unchecked"><path d="M73.5 147C54.0066 147 35.3116 139.256 21.5277 125.472C7.74373 111.688 0 92.9934 0 73.5C0 54.0066 7.74373 35.3116 21.5277 21.5277C35.3116 7.74373 54.0066 0 73.5 0C92.9934 0 111.688 7.74373 125.472 21.5277C139.256 35.3116 147 54.0066 147 73.5C147 92.9934 139.256 111.688 125.472 125.472C111.688 139.256 92.9934 147 73.5 147ZM73.5 9.1875C56.4433 9.1875 40.0851 15.9633 28.0242 28.0242C15.9633 40.0851 9.1875 56.4433 9.1875 73.5C9.1875 90.5567 15.9633 106.915 28.0242 118.976C40.0851 131.037 56.4433 137.812 73.5 137.812C90.5567 137.812 106.915 131.037 118.976 118.976C131.037 106.915 137.812 90.5567 137.812 73.5C137.812 56.4433 131.037 40.0851 118.976 28.0242C106.915 15.9633 90.5567 9.1875 73.5 9.1875Z" /></svg>`;

  const checkIfInitizialized = () => {
    const checklistInit = document.getElementById("moxfield-checklist");
    return !!checklistInit;
  };

  const updateStorage = (id) => {
    chrome.storage.local.set({ [id]: JSON.stringify([...checkedCards]) });
  };

  const clearStorage = (id) => {
    chrome.storage.local.remove([id]).then(() => {
      checkedCards = [];
    });
  };

  const getStorage = (id) => {
    return new Promise((resolve) => {
      chrome.storage.local.get([id]).then((result) => {
        resolve(result[id] ? JSON.parse(result[id]) : []);
      });
    });
  };

  const initWithRetry = (id) => {
    deckId = null;
    checklistEnabled = false;
    checkedCards = [];
    let timesRun = 0;
    const interval = setInterval(
      (id) => {
        const init = checkIfInitizialized();
        if (init || timesRun > 10) {
          clearInterval(interval);
          return;
        }
        injectChecklists(id);
        timesRun++;
      },
      500,
      id,
    );
  };

  const addEVs = () => {
    // Hook up enable button
    enableEV = () => {
      checklistEnabled = !checklistEnabled;
      enableChecklistEnableText.innerHTML = checklistEnabled
        ? "Disable"
        : "Enable";

      if (checklistEnabled) {
        deckView.classList.add("checklist-show");
      } else {
        deckView.classList.remove("checklist-show");
      }
    };
    enableChecklistBtn.addEventListener("click", enableEV);

    // Hook up checklist items
    const checkListItems = document.getElementsByClassName("checklist-item");
    Array.from(checkListItems).forEach((checkListItem) => {
      const ev = (el) => {
        const cardId = el?.currentTarget?.dataset?.["id"];
        if (!cardId) {
          console.error("No ID!");
          return;
        }
        if (checkedCards.includes(cardId)) {
          el?.currentTarget?.classList.remove("checked");
          const index = checkedCards.indexOf(cardId);
          if (index > -1) {
            checkedCards.splice(index, 1);
          }
        } else {
          el?.currentTarget?.classList.add("checked");
          checkedCards.push(cardId);
        }
        updateStorage(deckId);
      };
      checklistEVs.push({ checkListItem, ev });
      checkListItem.addEventListener("click", ev);
    });

    // Hook up Collapse Items
    Array.from(document.getElementsByClassName("text-primary")).forEach(
      (item) => {
        const ev = () => {
          setTimeout(() => {
            injectChecklists(deckId);
          }, 500);
        };
        collapseEvs.push({ item, ev });
        item.addEventListener("click", ev);
      },
    );

    // Hook up clear button
    clearEV = () => {
      clearStorage(deckId);
      Array.from(checkListItems).forEach((checkListItem) => {
        checkListItem.classList.remove("checked");
      });
    };
    clearChecklistBtn.addEventListener("click", clearEV);

    // Search dropdown
    searchDropdown = document.getElementById("deckbox-search");
    searchDropdownEV = (e) => {
      const currData = searchDropdown.value;
      let searchInterval = setInterval(() => {
        if (searchDropdown.value !== currData || !dropdown.value) {
          clearInterval(searchInterval);
        }
        if (!searchDropdown.value) {
          setTimeout(() => {
            injectChecklists(deckId);
          }, 500);
        }
      }, 500);
    };
    searchDropdownEV = searchDropdown?.addEventListener(
      "input",
      searchDropdownEV,
    );

    // Group dropdown
    groupDropdown = document.getElementById("groupBy");
    groupDropdownEV = (e) => {
      setTimeout(() => {
        injectChecklists(deckId);
      }, 250);
    };
    groupDropdownEV = groupDropdown?.addEventListener(
      "change",
      groupDropdownEV,
    );

    // Sort dropdown
    sortDropdown = document.getElementById("groupBy");
    sortDropdownEV = (e) => {
      setTimeout(() => {
        injectChecklists(deckId);
      }, 250);
    };
    sortDropdownEV = sortDropdown?.addEventListener("change", sortDropdownEV);
  };

  const resetEVs = () => {
    if (enableEV && enableChecklistBtn) {
      enableChecklistBtn.removeEventListener("click", enableEV);
    }
    if (clearEV) {
      clearChecklistBtn.removeEventListener("click", clearEV);
    }
    if (searchDropdownEV) {
      searchDropdown?.removeEventListener("input", searchDropdownEV);
    }
    if (groupDropdownEV) {
      groupDropdown?.removeEventListener("change", groupDropdownEV);
    }
    if (sortDropdownEV) {
      sortDropdown?.removeEventListener("change", sortDropdownEV);
    }
    if (checklistEVs.length) {
      checklistEVs.forEach(({ checkListItem, ev }) =>
        checkListItem.removeEventListener("click", ev),
      );
    }
    if (collapseEvs.length) {
      collapseEvs.forEach(({ item, ev }) =>
        item.removeEventListener("click", ev),
      );
    }
  };

  const removeChecklistItems = () => {
    document.querySelectorAll(".checklist-item").forEach((e) => e.remove());
  };

  const makeNav = () => {
    const init = checkIfInitizialized();
    if (init) {
      return {
        enableChecklistBtn: document.getElementsByClassName(
          "toggle-checklist-button",
        )?.[0],
        clearChecklistBtn: document.getElementsByClassName(
          "clear-checklist-button",
        )?.[0],
        deckView: document.getElementsByClassName("deckview")?.[0],
        enableChecklistEnableText: document.getElementsByClassName(
          "enable-checklist-enable-text",
        )?.[0],
      };
    }

    // This is the main element we need to find everything else, but it might not be here yet
    deckView = document.getElementsByClassName("deckview")?.[0];
    if (!deckView) {
      return null;
    }

    enableChecklistBtn = document.createElement("a");
    enableChecklistBtn.className =
      "ms-3 cursor-pointer no-outline toggle-checklist-button";
    enableChecklistBtn.id = "moxfield-checklist";
    const enableChecklistDesktopText = document.createElement("span");
    enableChecklistDesktopText.className = "d-none d-md-inline";
    const enableChecklistMobileText = document.createElement("span");
    enableChecklistMobileText.className = "d-inline d-md-none";
    enableChecklistMobileText.innerHTML = "Checklist";
    enableChecklistEnableText = document.createElement("span");
    enableChecklistEnableText.className = "enable-checklist-enable-text";
    enableChecklistEnableText.innerHTML = checklistEnabled
      ? "Disable"
      : "Enable";
    const enableChecklistChecklistText = document.createElement("span");
    enableChecklistChecklistText.innerHTML = " Checklist";

    enableChecklistBtn.innerHTML = checkListSVG;
    enableChecklistDesktopText.appendChild(enableChecklistEnableText);
    enableChecklistDesktopText.appendChild(enableChecklistChecklistText);
    enableChecklistBtn.appendChild(enableChecklistDesktopText);

    clearChecklistBtn = document.createElement("a");
    clearChecklistBtn.className =
      "ms-3 cursor-pointer no-outline clear-checklist-button";
    clearChecklistBtn.innerHTML = clearSVG + "Clear";
    if (checkedCards.length) {
      clearChecklistBtn.classList.add("show");
    }

    const form = deckView.getElementsByTagName("form")?.[0];
    if (!form) {
      console.error("no `form` found!");
      return null;
    }
    const anchors = form.getElementsByTagName("a");
    if (!anchors || !anchors?.[2] || anchors.length < 3) {
      form.prepend(clearChecklistBtn);
    } else {
      form.insertBefore(clearChecklistBtn, anchors[2]);
    }

    if (checklistEnabled) {
      deckView.classList.add("checklist-show");
    }

    form.insertBefore(enableChecklistBtn, clearChecklistBtn);

    return {
      enableChecklistBtn,
      clearChecklistBtn,
      enableChecklistEnableText,
      deckView,
    };
  };

  const addCheckElements = () => {
    const lists = deckView.getElementsByTagName("ul");
    if (!lists || !lists.length) {
      console.error("no `lists` found!");
      return null;
    }

    let listCount = 0;
    Array.from(lists).forEach((list) => {
      const listItems = list.getElementsByTagName("li");
      if (!listItems || !listItems.length) {
        console.error("no `listItems` found!", listCount);
        listCount++;
        return;
      }

      let listItemCount = 0;
      Array.from(listItems).forEach((listItem) => {
        if (listItemCount === 0) {
          listItemCount++;
          return;
        }
        const id = listItem?.dataset?.["hash"];
        if (!id) {
          console.error("no `id` found!", listCount);
          listItemCount++;
          return;
        }
        const idEl = document.createElement("span");
        idEl.className = "checklist-item";
        idEl.dataset.id = id;
        const idElChecked = document.createElement("span");
        idElChecked.innerHTML = checkedBox;
        idElChecked.className = "checklist-item-checked";
        const idElUnChecked = document.createElement("span");
        idElUnChecked.innerHTML = uncheckedBox;
        idElUnChecked.className = "checklist-item-unchecked";
        idEl.appendChild(idElChecked);
        idEl.appendChild(idElUnChecked);
        if (checkedCards.includes(id)) {
          idEl.classList.add("checked");
        }
        listItem.prepend(idEl);

        listItemCount++;
      });

      listCount++;
    });
  };

  const injectChecklists = async (id) => {
    if (!id) {
      return null;
    }
    deckId = id;
    checkedCards = await getStorage(deckId);

    resetEVs();
    removeChecklistItems();

    const nav = makeNav();
    if (!nav) {
      return null;
    }

    const {
      enableChecklistBtn,
      clearChecklistBtn,
      enableChecklistEnableText,
      deckView,
    } = makeNav();

    if (
      !enableChecklistBtn ||
      !clearChecklistBtn ||
      !deckView ||
      !enableChecklistEnableText
    ) {
      console.error(
        "no `enableChecklistBtn`, `clearChecklistBtn`, `enableChecklistEnableText` or `deckVew` found!",
        {
          enableChecklistBtn,
          clearChecklistBtn,
          enableChecklistEnableText,
          deckView,
        },
      );
      return null;
    }

    addCheckElements();

    addEVs();
  };

  // Handle app navigation
  chrome?.runtime?.onMessage?.addListener((data, sender, response) => {
    if (!data || typeof data !== "object") {
      return null;
    }
    const { id, type } = data;

    if (!id) {
      return null;
    }

    if (type === "NEW") {
      initWithRetry(id);
    }
  });

  // Handle page load
  const url = window.location.href;
  const noUrl = url.substring(url.indexOf("moxfield.com/decks/") + 19);
  const id = noUrl.substring(noUrl.indexOf("?") + 1);
  initWithRetry(id);
})();
