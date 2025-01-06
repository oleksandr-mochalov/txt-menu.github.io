const menu = getMenuData();
const model = {};
const searchTimer = { id: null };

const applyVisibility = (element, hidden) => {
  if (!element) return;
  if (hidden && !element.classList.contains("hidden")) {
    element.classList.add("hidden");
  } else if (!hidden && element.classList.contains("hidden")) {
    element.classList.remove("hidden");
  }
};

function buildModel(data, parentElement, parentItem) {
  if (!parentElement) parentElement = window.document.getElementById("menu");
  if (!data) data = menu;

  data.forEach((item) => {
    model[item.id] = item;
    item.collapsed = true;
    item.parent = parentItem;

    const { menuItem, children, title, collapsedIcon, expandedIcon } =
      createItem(item);

    item.hide = () => {
      item.collapsed = true;
      applyVisibility(collapsedIcon, true);
      applyVisibility(expandedIcon, false);
      applyVisibility(children, true);
      item.unhighlight();
    };

    item.show = (openSelf = true) => {
      if (openSelf) {
        item.collapsed = false;
        applyVisibility(collapsedIcon, false);
        applyVisibility(expandedIcon, true);
        applyVisibility(children, false);
      }
      if (item.parent?.collapsed) {
        item.parent.show();
      }
    };
    item.highlight = () => {
      if (!title.classList.contains("highlight")) {
        title.classList.add("highlight");
      }
    };
    item.unhighlight = () => {
      if (title.classList.contains("highlight")) {
        title.classList.remove("highlight");
      }
    };
    item.toggle = () => {
      (item.collapsed ? item.show : item.hide)();
    };

    parentElement.appendChild(menuItem);

    if (item.children?.length) {
      buildModel(item.children, children, item);
    }
  });
}

function showCopyNotification() {
  const notification = document.querySelector(".copy-notification");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 300);
}

function onCopyClick(id) {
  const item = model[id];
  navigator.clipboard.writeText(item.name);
  showCopyNotification();
}

function onHeaderClick(id) {
  model[id]?.toggle();
}

function hideAll() {
  Object.values(model).forEach((item) => item.hide());
}

function cleanName(name) {
  return name.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function showBySearch(term) {
  clearTimeout(searchTimer.id);
  searchTimer.id = setTimeout(() => {
    hideAll();
    const search = cleanName(term);
    if (!search) return;
    Object.values(model).forEach((item) => {
      if (cleanName(item.name).includes(search)) {
        item.show(false);
        item.highlight();
      }
    });
  }, 250);
}

function clearSearch() {
  clearTimeout(searchTimer.id);
  hideAll();
  const search = document.getElementById("search-input");
  search.value = "";
}

function runPreProcess() {
  const src = document.getElementById("preprocess-input").value;
  const target = document.getElementById("preprocess-result");
  const { result } = preProcessMessage(src);

  target.innerText = result;
}

function copyPreprocessResult() {
  const target = document.getElementById("preprocess-result");
  navigator.clipboard.writeText(target.innerText);
  showCopyNotification();
}
