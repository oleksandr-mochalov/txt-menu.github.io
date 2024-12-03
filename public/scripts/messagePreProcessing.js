/**
 * Removes all articles from the message. But keep the "a" in the "chick-fil-a" and "chick fil a" phrases
 * @param {string} message - Input message
 * @returns {string} - Message without articles
 */
function removeArticles(message) {
  if (/^(a|option a|opt a)$/i.test(message)) return "a"; // Workaround for the "a" option

  const res = message.replace(/(?<!chick-fil-|chick fil )\b(a|an|the)\b/gi, "");
  return res;
}

/**
 * Removes the phrases "side of" and "on the side" from the message
 * @param {string} message - Input message
 * @returns {string} - Message without "side of" and "on the side"
 */
function removeSideOf(message) {
  return message.replace(/(side of|on the side|on side)/gi, "");
}

function removeCustomWords(message) {
  return message
    .replace(/both/gi, "")
    .replace(/toppings|topping/gi, "")
    .replace(/(?<!salt )\b(packets|packet)/gi, "")
    .replace(/pls|plz|please/gi, "");
}

/**
 * Removes all punctuation from the message. But keep the "-" in the "chick-fil-" phrase
 * @param {string} message - Input message
 * @returns {string} - Message without punctuation
 */
function removePunctuation(message) {
  return message.replace(/[.,#!$%^*;:{}/=_`~()®-]/gi, "");
}

/**
 * Removes the word "and" from the message
 * @param {string} message - Input message
 * @returns {string} - Message without "and"
 */
function removeAnd(message) {
  // return message.replace(/(\b|\s)and(\b|\s)/g, '') // .replace(/(\b|\s)&(\b|\s)/g, '')
  return message
    .replace(/\b(and|also|as well as|)\b/g, "")
    .replace(/\b&\b/g, "");
}

function removeSome(message) {
  return message.replace(/\b(some)\b/g, "");
}

/**
 * Removes all double spaces from the message, and trims the message
 * @param {string} message - Input message
 * @returns {string} - Message without double spaces
 */
function removeDoubleSpaces(message) {
  return message.replace(/\s{2,}/g, " ").trim();
}

/**
 * Make Strips consistent for Lex across different variations
 * @param {string} message - Input message
 * @returns {string} - Message with "strips" replaced by "strips_2", "strips_3", "strips_4" or "strips_8" or "strips_12" or "strips_30"
 */
function replaceStripsWithSystemValue(message) {
  const TITLE = "((chick n |chick-n-|chickn|chicken |chicken-)?strips)";
  const DIGITS = "(2|3|4|two|double|three|four)";
  const SEPARATOR = "(\\s|\\b)";
  const COUNT = "(ct|count)";

  const titleCountRe = new RegExp(
    `${TITLE}${SEPARATOR}?${DIGITS}${SEPARATOR}?${COUNT}`
  );
  const countTitleRe = new RegExp(
    `${DIGITS}${SEPARATOR}?${COUNT}?${SEPARATOR}?${TITLE}`
  );

  const placeholders = {
    2: "duo strips",
    3: "tres strips",
    4: "quoter strips",
  };

  const replace = (matchGroup, countGroup) => {
    const cnt = countGroup
      .replace("two", "2")
      .replace("double", "2")
      .replace("three", "3")
      .replace("four", "4")
      .replace("eight", "8");
    // .replace('twelve', '12')
    // .replace('thirty', '30')
    const result = placeholders[cnt];
    const msgWithStrips = result
      ? message.replace(new RegExp(matchGroup, "gi"), result)
      : message;
    return msgWithStrips;
  };

  let fullyHandled = false;
  while (!fullyHandled) {
    const titleCountReMatch = message.match(titleCountRe);
    const countTitleReMatch = message.match(countTitleRe);

    if (titleCountReMatch?.[2]) {
      message = replace(titleCountReMatch[0], titleCountReMatch[4]);
    } else if (countTitleReMatch?.[1]) {
      message = replace(countTitleReMatch[0], countTitleReMatch[1]);
    } else {
      fullyHandled = true;
    }
  }
  return message;
}

/**
 * Make Nuggets consistent for Lex across different variations
 * @param {string} message - Input message
 * @returns {string} - Message with "nuggets" replaced by "nuggets_5" or "nuggets_8" or "nuggets_12" or "nuggets_30"
 */
function replaceNuggetsWithSystemValue(message) {
  const placeholders = {
    regular: {
      5: "quinque nuggets",
      8: "octo nuggets",
      12: "duodecim nuggets",
      30: "triginta nuggets",
    },
    grilled: {
      5: "quinque grilled nuggets",
      8: "octo grilled nuggets",
      12: "duodecim grilled nuggets",
      30: "triginta grilled nuggets",
    },
  };

  const TITLE =
    "((chick fil a|chick-fil-a|chickfila|chicken|grilled)?\\s?nuggets)";
  const DIGITS = "(5|8|12|30|four|eight|twelve|thirty)";
  const SEPARATOR = "(\\s|\\b)";
  const COUNT = "(ct|count)";

  const titleCountRe = new RegExp(
    `${TITLE}${SEPARATOR}?${DIGITS}${SEPARATOR}?${COUNT}`
  );
  const countTitleRe = new RegExp(
    `${DIGITS}${SEPARATOR}?${COUNT}?${SEPARATOR}?${TITLE}`
  );

  const replace = (matchGroup, countGroup) => {
    const cnt = countGroup
      .replace("five", "5")
      .replace("eight", "8")
      .replace("twelve", "12")
      .replace("thirty", "30");
    const key = matchGroup.includes("grilled") ? "grilled" : "regular";
    const result = placeholders[key][cnt];
    return result
      ? message.replace(new RegExp(matchGroup, "gi"), result)
      : message;
  };

  let fullyHandled = false;
  while (!fullyHandled) {
    const titleCountReMatch = message.match(titleCountRe);
    const countTitleReMatch = message.match(countTitleRe);

    if (titleCountReMatch?.[2]) {
      message = replace(titleCountReMatch[0], titleCountReMatch[4]);
    } else if (countTitleReMatch?.[1]) {
      message = replace(countTitleReMatch[0], countTitleReMatch[1]);
    } else {
      fullyHandled = true;
    }
  }
  return message;
}

/**
 * Make Minis consistent for Lex across different variations
 * @param {string} message - Input message
 * @returns {string} - Message with "minis" replaced by "minis_4" or "minis_10"
 */
function replaceMinisWithSystemValue(message) {
  const TITLE =
    "((chick fil a|chick-fil-a|chickfila )?\\s?(chick-n-|chick n |chickn)?minis)";
  const DIGITS = "(4|10|four|ten)";
  const SEPARATOR = "(\\s|\\b)";
  const COUNT = "(ct|count)";

  const titleCountRe = new RegExp(
    `${TITLE}${SEPARATOR}?${DIGITS}${SEPARATOR}?${COUNT}`
  );
  const countTitleRe = new RegExp(
    `${DIGITS}${SEPARATOR}?${COUNT}?${SEPARATOR}?${TITLE}`
  );

  const placeholders = {
    4: "quattuor minis",
    10: "decem minis",
  };

  const replace = (matchGroup, countGroup) => {
    const cnt = countGroup.replace("four", "4").replace("ten", "10");
    const result = placeholders[cnt];
    return result
      ? message.replace(new RegExp(matchGroup, "gi"), result)
      : message;
  };

  let fullyHandled = false;
  while (!fullyHandled) {
    const titleCountReMatch = message.match(titleCountRe);
    const countTitleReMatch = message.match(countTitleRe);

    if (titleCountReMatch?.[2]) {
      message = replace(titleCountReMatch[0], titleCountReMatch[4]);
    } else if (countTitleReMatch?.[1]) {
      message = replace(countTitleReMatch[0], countTitleReMatch[1]);
    } else {
      fullyHandled = true;
    }
  }
  return message;
}

/**
 * Replaces "dr pepper" with "drpepper"
 * @param {string} message - Input message
 * @returns {string} - Message with "dr pepper" replaced by "drpepper"
 */
function drPepper(message) {
  return message.replace(/dr[.\s]*pepper/gi, "drpepper");
}

function pluralToSingle(message) {
  return message
    .replace("sandwiches", "sandwich")
    .replace("sauces", "sauce")
    .replace("dressings", "dressing")
    .replace("meals", "meal")
    .replace("filets", "filet")
    .replace("wraps", "wrap")
    .replace("sunjoys", "sunjoy")
    .replace("lemonades", "lemonade")
    .replace("biscuits", "biscuit")
    .replace("burritos", "burrito")
    .replace("bowls", "bowl")
    .replace("muffins", "muffin")
    .replace("salads", "salad")
    .replace("cups", "cup")
    .replace("cokes", "coke")
    .replace("coffees", "coffee")
    .replace("juices", "juice")
    .replace("milkshakes", "milkshake");
}

/** Makes custom input word "honeymustard" to be parsed as "honey mustard" item
 * Make sure run it before punctuation clean up, because "honey, mustard" and "honey mustard" have different meaning
 * @param {string} message - Input message
 * @returns {string} - Message with "honeymustard" replaced by "honey mustard"
 */
function customHoneyMustard(message) {
  return message.replace(/honey\s+mustard/gi, "honeymustard");
}

/** Adding "chick-fil-a" to sauce, if another type of sauce is not mentioned
 * @param {string} message - Input message
 * @returns {string} - Message with "sauce" replaced by "chick-fil-a sauce"
 */
function customSauce(message) {
  return message.replace(
    /(?<!\b(?:barbeque|barbecue|bbq|ranch|herb|garden|Hot|mustard|honey|honeymustard|hotpolynesian|sriracha|spicy|buffalo|polynesian|chick-fil-a|chick fil a|chickfila|cfa)\s)sauce\b/gi,
    "chick-fil-a sauce"
  );
}

function comboToMeal(message) {
  return message.replace(/combo meal/gi, "meal").replace(/combo/gi, "meal");
}

function replaceWithShortOnFull(message) {
  return message.replace(/w\/o/gi, "no").replace(/w\//gi, "with");
}

function replaceIceDream(message) {
  return message.replace("ice dream", "icedream");
}

/**
 * Pre-processes the message by removing articles, "side of", punctuation, "and", and double spaces
 * @param {string} message - Input message
 * @returns {string} - Pre-processed message
 */
function preProcessMessage(message) {
  let result = message.toLowerCase();
  result = drPepper(result);
  result = customHoneyMustard(result);
  result = replaceWithShortOnFull(result);
  result = removePunctuation(result);
  result = removeArticles(result);
  result = removeSideOf(result);
  result = removeCustomWords(result);
  result = removeAnd(result);
  result = removeSome(result);
  result = pluralToSingle(result);
  result = removeDoubleSpaces(result);
  result = customSauce(result);
  result = comboToMeal(result);
  result = replaceStripsWithSystemValue(result);
  result = replaceNuggetsWithSystemValue(result);
  result = replaceMinisWithSystemValue(result);
  result = replaceIceDream(result);

  return result;
}
