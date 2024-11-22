function createCollapsedIcon(item) {
  const collapsedIcon = document.createElement("div");
  collapsedIcon.id = `collapsed-${item.id}`;
  collapsedIcon.classList.add("item-icon-container");
  collapsedIcon.classList.add("hidden");
  collapsedIcon.classList.add("clickable");
  // collapsedIcon.onclick = () => onHeaderClick(item.id);

  const collapsedIconImg = document.createElement("img");
  collapsedIconImg.classList.add("item-icon");
  collapsedIconImg.src = "public/images/arrow-down.svg";
  collapsedIconImg.alt = "Default";
  collapsedIcon.appendChild(collapsedIconImg);
  return collapsedIcon;
}

function createExpandedIcon(item) {
  const expandedIcon = document.createElement("div");
  expandedIcon.id = `expanded-${item.id}`;
  expandedIcon.classList.add("item-icon-container");
  expandedIcon.classList.add("clickable");

  const expandedIconImg = document.createElement("img");
  expandedIconImg.classList.add("item-icon");
  expandedIconImg.src = "public/images/arrow-right.svg";
  expandedIconImg.alt = "Default";
  expandedIcon.appendChild(expandedIconImg);

  return expandedIcon;
}

function createIconPlaceholder(item) {
  const icoPlaceholder = document.createElement("div");
  icoPlaceholder.id = `ico-placeholder-${item.id}`;
  icoPlaceholder.classList.add("item-icon-container");
  return icoPlaceholder;
}

function createTitle(item) {
  const title = document.createElement("div");
  title.id = `title-${item.id}`;
  title.classList.add("item-title");
  title.innerText = item.name;
  return title;
}

function createCopyIcon(item) {
  const copyIcon = document.createElement("div");
  copyIcon.classList.add("item-icon-container");
  copyIcon.classList.add("clickable");
  copyIcon.onclick = () => onCopyClick(item.id);

  const copyIconImg = document.createElement("img");
  copyIconImg.classList.add("item-icon");
  copyIconImg.src = "public/images/copy.svg";
  copyIconImg.alt = "Default";

  copyIcon.appendChild(copyIconImg);
  return copyIcon;
}

function createDayPartIcon(item) {
  const dayPartIconContainer = document.createElement("div");
  dayPartIconContainer.classList.add("item-icon-container");

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.innerText = item.dayPart;

  const dayPartIcon = document.createElement("img");
  dayPartIcon.classList.add("item-icon");
  dayPartIcon.src = `public/images/${item.dayPart
    .toLowerCase()
    .replace(/\s/g, "")}.svg`;
  dayPartIcon.alt = item.dayPart;

  dayPartIconContainer.appendChild(tooltipText);
  dayPartIconContainer.appendChild(dayPartIcon);

  return dayPartIconContainer;
}

function createDefaultIcon(item) {
  const defaultIconContainer = document.createElement("div");
  defaultIconContainer.classList.add("item-icon-container");

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.innerText = "Default";

  const defaultIcon = document.createElement("img");
  defaultIcon.classList.add("item-icon");
  defaultIcon.src = "public/images/star.svg";
  defaultIcon.alt = "Default";

  defaultIconContainer.appendChild(tooltipText);
  defaultIconContainer.appendChild(defaultIcon);

  return defaultIconContainer;
}

function createItemHeader(item) {
  const result = {};

  const hasChildren = item.children?.length;

  const header = document.createElement("div");
  header.classList.add("item-header");
  result.header = header;

  const itemHeaderLeft = document.createElement("div");
  itemHeaderLeft.classList.add("item-header-left");
  if (hasChildren) {
    itemHeaderLeft.classList.add("clickable");
    itemHeaderLeft.onclick = () => onHeaderClick(item.id);

    const collapsedIcon = createCollapsedIcon(item);
    const expandedIcon = createExpandedIcon(item);

    result.collapsedIcon = collapsedIcon;
    result.expandedIcon = expandedIcon;

    itemHeaderLeft.appendChild(collapsedIcon);
    itemHeaderLeft.appendChild(expandedIcon);
  } else {
    const icoPlaceholder = createIconPlaceholder(item);
    itemHeaderLeft.appendChild(icoPlaceholder);
  }

  if (item.dayPart) {
    const dayPartIcon = createDayPartIcon(item);
    itemHeaderLeft.appendChild(dayPartIcon);
  }

  if (item.isDefault) {
    const defaultIcon = createDefaultIcon(item);
    itemHeaderLeft.appendChild(defaultIcon);
  }

  const title = createTitle(item);
  result.title = title;
  itemHeaderLeft.appendChild(title);

  const itemHeaderRight = document.createElement("div");
  itemHeaderRight.classList.add("item-header-right");

  const copyIcon = createCopyIcon(item);
  itemHeaderRight.appendChild(copyIcon);

  header.appendChild(itemHeaderLeft);
  header.appendChild(itemHeaderRight);

  return result;
}

function createItem(item) {
  const result = createItemHeader(item);

  const menuItem = document.createElement("div");
  menuItem.classList.add("menu-item");
  menuItem.appendChild(result.header);
  result.menuItem = menuItem;

  if (item.children?.length) {
    const children = document.createElement("div");
    children.id = `children-${item.id}`;
    children.classList.add("item-children");
    children.classList.add("hidden");

    result.children = children;
    menuItem.appendChild(children);
  }

  return result;
}

// <div class="menu-item">

//   <% if (item.children?.length) { %>
//     <div class="item-header">
//       <div class="item-header-left clickable" onclick="onHeaderClick('<%= item.id %>')">
//   <% } else { %>
//       <div class="item-header item-header-alone">
//         <div class="item-header-left">
//   <% } %>

//       <% if (item.children?.length) { %>
//         <div id="collapsed-<%= item.id %>" class="item-icon-container hidden clickable">
//           <img class="item-icon" src="public/images/arrow-down.svg" alt="Default" />
//         </div>

//         <div id="expanded-<%= item.id %>" class="item-icon-container clickable">
//           <img class="item-icon" src="public/images/arrow-right.svg" alt="Default" />
//         </div>
//       <% } else { %>
//         <div id="ico-placeholder-<%= item.id %>" class="item-icon-container"></div>
//       <% } %>

//       <% if (item.dayPart) { %>
//         <div class="item-icon-container">
//           <span class="tooltip-text"><%= item.dayPart %></span>
//           <% if (item.dayPart === 'All Day') { %>
//             <img class="item-icon" src="public/images/all-day1.svg" alt="All Day" />
//           <% } else if (item.dayPart === 'Breakfast') { %>
//             <img class="item-icon" src="public/images/breakfast.svg" alt="Breakfast" />
//           <% } else if (item.dayPart === 'Afternoon') { %>
//             <img class="item-icon" src="public/images/afternoon.svg" alt="Lunch" />
//           <% } else if (item.dayPart === 'Crossover') { %>
//             <img class="item-icon" src="public/images/crossover.svg" alt="Dinner" />
//           <% } %>
//         </div>
//       <% } %>

//       <% if (item.isDefault) { %>
//         <div class="item-icon-container">
//           <span class="tooltip-text">Default</span>
//           <img class="item-icon" src="public/images/star.svg" alt="Default" />
//         </div>
//       <% } %>

//       <div class="item-header-separator"></div>

//       <div id="title-<%= item.id %>" class="item-title">
//         <%= item.name %>
//       </div>

//       </div><div class="item-header-right">

//       <div class="item-icon-container clickable" onclick="onCopyClick('<%= item.id %>')">
//         <span class="tooltip-text">Copy</span>
//         <img class="item-icon" src="public/images/copy.svg" alt="Default" />
//       </div>
//     </div>

//   </div>
//   <% if (item.children && item.children.length > 0) { %>
//     <div id="children-<%= item.id %>" class="item-children hidden">
//       <% item.children.forEach(function(child) { %>
//         <%- include('menuItem', { item: child }) %>
//       <% }); %>
//     </div>
//   <% } %>
// </div>
