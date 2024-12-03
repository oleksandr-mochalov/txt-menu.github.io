function generateUID() {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

const { categories, itemGroups } = require("./menu.json");

class LineItem {
  constructor(instance, parentDefaultTag = "") {
    this.elementId = generateUID();
    this.name = instance.name.replace(/<[^>]*>/g, "");
    this.dayPart = instance.dayPart || "";
    this.isDefault =
      instance.modifierType === "DEFAULT" || instance.tag === parentDefaultTag;

    const items =
      instance.items ||
      itemGroups.find(({ itemGroupId }) => itemGroupId === instance.itemGroupId)
        ?.items ||
      [];

    this.children = items.length
      ? items.map((item) => {
          return new LineItem(item, instance.defaultTag || parentDefaultTag);
        })
      : undefined;
  }
}

const menu = categories.map((c) => new LineItem(c));

const fs = require("fs");
fs.writeFileSync("menuData.json", JSON.stringify(menu));
