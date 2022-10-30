const asAttributes = ({attributes: attributes, ...rest}) => {
  if (!attributes || attributes.constructor !== Object) return rest;
  return {
    ...rest,
    ...attributes
  };
};

const flattenAttributes = data => {
  if (!data || typeof data !== "object") return {};
  if (Array.isArray(data)) return data.map((el => asAttributes(el)));
  return asAttributes(data);
};

const findResource = (rel, included) => {
  if (!Array.isArray(included)) return;
  return included.find((res => res.id === rel.id && res.type === rel.type));
};

const deserializeIncluded = (rel, included) => {
  const resource = findResource(rel, included);
  if (!resource) return [ undefined, included ];
  const filteredIncluded = included.map((res => {
    if (res !== resource) return res;
    const {relationships: relationships, ...filter} = resource;
    return filter;
  }));
  return [ {
    ...rel,
    ...flattenAttributes(resource)
  }, filteredIncluded ];
};

const mapRelationships = (resource, included) => {
  let {relationships: relationships, ...result} = resource;
  if (resource.hasOwnProperty("attributes")) {
    result = flattenAttributes(result);
  }
  for (const key in relationships) {
    if (result.hasOwnProperty(key)) continue;
    const relData = relationships[key].data;
    let deserializedRel;
    if (relData && Array.isArray(relData)) {
      let includedRels = [];
      relData.forEach((rel => {
        let dRel;
        [dRel, included] = deserializeIncluded(rel, included);
        if (dRel) includedRels.push(dRel);
      }));
      includedRels = includedRels.map((rel => mapRelationships(rel, included)));
      if (includedRels.length) deserializedRel = includedRels;
    } else if (relData) {
      const [dRel, filteredIncluded] = deserializeIncluded(relData, included);
      if (dRel) {
        deserializedRel = mapRelationships(dRel, filteredIncluded);
      }
    }
    if (deserializedRel) result[key] = deserializedRel;
  }
  return result;
};

var freeGlobal = typeof global == "object" && global && global.Object === Object && global;

var freeGlobal$1 = freeGlobal;

var freeSelf = typeof self == "object" && self && self.Object === Object && self;

var root = freeGlobal$1 || freeSelf || Function("return this")();

var root$1 = root;

var Symbol = root$1.Symbol;

var Symbol$1 = Symbol;

var objectProto$2 = Object.prototype;

var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

var nativeObjectToString$1 = objectProto$2.toString;

var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var objectProto$1 = Object.prototype;

var nativeObjectToString = objectProto$1.toString;

function objectToString(value) {
  return nativeObjectToString.call(value);
}

var nullTag = "[object Null]", undefinedTag = "[object Undefined]";

var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

var getPrototype$1 = getPrototype;

function isObjectLike(value) {
  return value != null && typeof value == "object";
}

var objectTag = "[object Object]";

var funcProto = Function.prototype, objectProto = Object.prototype;

var funcToString = funcProto.toString;

var hasOwnProperty = objectProto.hasOwnProperty;

var objectCtorString = funcToString.call(Object);

function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var isArray = Array.isArray;

var isArray$1 = isArray;

var symbolTag = "[object Symbol]";

function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

var INFINITY = 1 / 0;

var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;

function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray$1(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}

function toString(value) {
  return value == null ? "" : baseToString(value);
}

function baseSlice(array, start, end) {
  var index = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return !start && end >= length ? array : baseSlice(array, start, end);
}

var rsAstralRange$2 = "\\ud800-\\udfff", rsComboMarksRange$3 = "\\u0300-\\u036f", reComboHalfMarksRange$3 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$3 = "\\u20d0-\\u20ff", rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3, rsVarRange$2 = "\\ufe0e\\ufe0f";

var rsZWJ$2 = "\\u200d";

var reHasUnicode = RegExp("[" + rsZWJ$2 + rsAstralRange$2 + rsComboRange$3 + rsVarRange$2 + "]");

function hasUnicode(string) {
  return reHasUnicode.test(string);
}

function asciiToArray(string) {
  return string.split("");
}

var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$2 = "\\u0300-\\u036f", reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$2 = "\\u20d0-\\u20ff", rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2, rsVarRange$1 = "\\ufe0e\\ufe0f";

var rsAstral = "[" + rsAstralRange$1 + "]", rsCombo$2 = "[" + rsComboRange$2 + "]", rsFitz$1 = "\\ud83c[\\udffb-\\udfff]", rsModifier$1 = "(?:" + rsCombo$2 + "|" + rsFitz$1 + ")", rsNonAstral$1 = "[^" + rsAstralRange$1 + "]", rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ$1 = "\\u200d";

var reOptMod$1 = rsModifier$1 + "?", rsOptVar$1 = "[" + rsVarRange$1 + "]?", rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [ rsNonAstral$1, rsRegional$1, rsSurrPair$1 ].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*", rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1, rsSymbol = "(?:" + [ rsNonAstral$1 + rsCombo$2 + "?", rsCombo$2, rsRegional$1, rsSurrPair$1, rsAstral ].join("|") + ")";

var reUnicode = RegExp(rsFitz$1 + "(?=" + rsFitz$1 + ")|" + rsSymbol + rsSeq$1, "g");

function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}

function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);
    var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
    var chr = strSymbols ? strSymbols[0] : string.charAt(0);
    var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
    return chr[methodName]() + trailing;
  };
}

var upperFirst = createCaseFirst("toUpperCase");

var upperFirst$1 = upperFirst;

function capitalize(string) {
  return upperFirst$1(toString(string).toLowerCase());
}

function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1, length = array == null ? 0 : array.length;
  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

var deburredLetters = {
  "À": "A",
  "Á": "A",
  "Â": "A",
  "Ã": "A",
  "Ä": "A",
  "Å": "A",
  "à": "a",
  "á": "a",
  "â": "a",
  "ã": "a",
  "ä": "a",
  "å": "a",
  "Ç": "C",
  "ç": "c",
  "Ð": "D",
  "ð": "d",
  "È": "E",
  "É": "E",
  "Ê": "E",
  "Ë": "E",
  "è": "e",
  "é": "e",
  "ê": "e",
  "ë": "e",
  "Ì": "I",
  "Í": "I",
  "Î": "I",
  "Ï": "I",
  "ì": "i",
  "í": "i",
  "î": "i",
  "ï": "i",
  "Ñ": "N",
  "ñ": "n",
  "Ò": "O",
  "Ó": "O",
  "Ô": "O",
  "Õ": "O",
  "Ö": "O",
  "Ø": "O",
  "ò": "o",
  "ó": "o",
  "ô": "o",
  "õ": "o",
  "ö": "o",
  "ø": "o",
  "Ù": "U",
  "Ú": "U",
  "Û": "U",
  "Ü": "U",
  "ù": "u",
  "ú": "u",
  "û": "u",
  "ü": "u",
  "Ý": "Y",
  "ý": "y",
  "ÿ": "y",
  "Æ": "Ae",
  "æ": "ae",
  "Þ": "Th",
  "þ": "th",
  "ß": "ss",
  "Ā": "A",
  "Ă": "A",
  "Ą": "A",
  "ā": "a",
  "ă": "a",
  "ą": "a",
  "Ć": "C",
  "Ĉ": "C",
  "Ċ": "C",
  "Č": "C",
  "ć": "c",
  "ĉ": "c",
  "ċ": "c",
  "č": "c",
  "Ď": "D",
  "Đ": "D",
  "ď": "d",
  "đ": "d",
  "Ē": "E",
  "Ĕ": "E",
  "Ė": "E",
  "Ę": "E",
  "Ě": "E",
  "ē": "e",
  "ĕ": "e",
  "ė": "e",
  "ę": "e",
  "ě": "e",
  "Ĝ": "G",
  "Ğ": "G",
  "Ġ": "G",
  "Ģ": "G",
  "ĝ": "g",
  "ğ": "g",
  "ġ": "g",
  "ģ": "g",
  "Ĥ": "H",
  "Ħ": "H",
  "ĥ": "h",
  "ħ": "h",
  "Ĩ": "I",
  "Ī": "I",
  "Ĭ": "I",
  "Į": "I",
  "İ": "I",
  "ĩ": "i",
  "ī": "i",
  "ĭ": "i",
  "į": "i",
  "ı": "i",
  "Ĵ": "J",
  "ĵ": "j",
  "Ķ": "K",
  "ķ": "k",
  "ĸ": "k",
  "Ĺ": "L",
  "Ļ": "L",
  "Ľ": "L",
  "Ŀ": "L",
  "Ł": "L",
  "ĺ": "l",
  "ļ": "l",
  "ľ": "l",
  "ŀ": "l",
  "ł": "l",
  "Ń": "N",
  "Ņ": "N",
  "Ň": "N",
  "Ŋ": "N",
  "ń": "n",
  "ņ": "n",
  "ň": "n",
  "ŋ": "n",
  "Ō": "O",
  "Ŏ": "O",
  "Ő": "O",
  "ō": "o",
  "ŏ": "o",
  "ő": "o",
  "Ŕ": "R",
  "Ŗ": "R",
  "Ř": "R",
  "ŕ": "r",
  "ŗ": "r",
  "ř": "r",
  "Ś": "S",
  "Ŝ": "S",
  "Ş": "S",
  "Š": "S",
  "ś": "s",
  "ŝ": "s",
  "ş": "s",
  "š": "s",
  "Ţ": "T",
  "Ť": "T",
  "Ŧ": "T",
  "ţ": "t",
  "ť": "t",
  "ŧ": "t",
  "Ũ": "U",
  "Ū": "U",
  "Ŭ": "U",
  "Ů": "U",
  "Ű": "U",
  "Ų": "U",
  "ũ": "u",
  "ū": "u",
  "ŭ": "u",
  "ů": "u",
  "ű": "u",
  "ų": "u",
  "Ŵ": "W",
  "ŵ": "w",
  "Ŷ": "Y",
  "ŷ": "y",
  "Ÿ": "Y",
  "Ź": "Z",
  "Ż": "Z",
  "Ž": "Z",
  "ź": "z",
  "ż": "z",
  "ž": "z",
  "Ĳ": "IJ",
  "ĳ": "ij",
  "Œ": "Oe",
  "œ": "oe",
  "ŉ": "'n",
  "ſ": "s"
};

var deburrLetter = basePropertyOf(deburredLetters);

var deburrLetter$1 = deburrLetter;

var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

var rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;

var rsCombo$1 = "[" + rsComboRange$1 + "]";

var reComboMark = RegExp(rsCombo$1, "g");

function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter$1).replace(reComboMark, "");
}

var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

var rsApos$1 = "['’]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";

var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos$1 + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos$1 + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [ rsNonAstral, rsRegional, rsSurrPair ].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [ rsDingbat, rsRegional, rsSurrPair ].join("|") + ")" + rsSeq;

var reUnicodeWord = RegExp([ rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [ rsBreak, rsUpper, "$" ].join("|") + ")", rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [ rsBreak, rsUpper + rsMiscLower, "$" ].join("|") + ")", rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower, rsUpper + "+" + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji ].join("|"), "g");

function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;
  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

var rsApos = "['’]";

var reApos = RegExp(rsApos, "g");

function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
  };
}

var camelCase = createCompounder((function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
}));

var camelCase$1 = camelCase;

const needsCamelCase = str => str.indexOf("-") > -1 || str.indexOf("_") > -1;

const toCamel = obj => {
  Object.keys(obj).forEach((key => {
    const camelCasedKey = needsCamelCase(key) ? camelCase$1(key) : key;
    const value = obj[key];
    delete obj[key];
    obj[camelCasedKey] = value;
    if (isPlainObject(value)) {
      obj[camelCasedKey] = toCamel(value);
    }
    if (Array.isArray(value)) {
      obj[camelCasedKey] = value.map((item => {
        if (isPlainObject(item)) {
          return toCamel(item);
        } else {
          return item;
        }
      }));
    }
  }));
  return obj;
};

const transformKeys = (object, options) => {
  if (options.transformKeys === "camelCase") {
    return toCamel(object);
  }
  return object;
};

const deserialize = (resp, options = {}) => {
  const {data: data = {}, included: included, ...rest} = resp;
  let deserialized;
  if (Array.isArray(data)) {
    deserialized = data.map((resource => mapRelationships(resource, included)));
  } else {
    deserialized = mapRelationships(data, included);
  }
  transformKeys(deserialized, options);
  return {
    data: deserialized,
    ...rest
  };
};

export { deserialize };
