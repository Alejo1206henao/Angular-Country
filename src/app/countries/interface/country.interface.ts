// To parse this data:
//
//   import { Convert } from "./file";
//
//   const searchResponse = Convert.toSearchResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface countries {
  name:         Name;
  tld:          string[];
  cca2:         string;
  ccn3:         string;
  cca3:         string;
  independent:  boolean;
  status:       Status;
  unMember:     boolean;
  currencies:   { [key: string]: Currency };
  idd:          Idd;
  capital:      string[];
  altSpellings: string[];
  region:       Region;
  subregion:    string;
  languages:    Languages;
  translations: { [key: string]: Translation };
  latlng:       number[];
  landlocked:   boolean;
  area:         number;
  demonyms:     Demonyms;
  flag:         string;
  maps:         Maps;
  population:   number;
  car:          Car;
  timezones:    string[];
  continents:   string[];
  flags:        Flags;
  coatOfArms:   CoatOfArms;
  startOfWeek:  StartOfWeek;
  capitalInfo:  CapitalInfo;
  cioc?:        string;
  fifa?:        string;
  borders?:     string[];
  gini?:        { [key: string]: number };
  postalCode?:  PostalCode;
}

export interface CapitalInfo {
  latlng: number[];
}

export interface Car {
  signs: string[];
  side:  Side;
}

export enum Side {
  Left = "left",
  Right = "right",
}

export interface CoatOfArms {
  png?: string;
  svg?: string;
}

export interface Currency {
  name:   string;
  symbol: string;
}

export interface Demonyms {
  eng:  EngClass;
  fra?: EngClass;
}

export interface EngClass {
  f: string;
  m: string;
}

export interface Flags {
  png:  string;
  svg:  string;
  alt?: string;
}

export interface Idd {
  root:     string;
  suffixes: string[];
}

export interface Languages {
  cal?: string;
  cha?: string;
  eng?: EngEnum;
  spa?: string;
  fra?: string;
  nld?: string;
  pap?: string;
  rar?: string;
  ara?: string;
  zdj?: string;
  gsw?: string;
  ita?: string;
  roh?: string;
  kon?: string;
  lin?: string;
  lua?: string;
  swa?: string;
  ber?: string;
}

export enum EngEnum {
  English = "English",
}

export interface Maps {
  googleMaps:     string;
  openStreetMaps: string;
}

export interface Name {
  common:     string;
  official:   string;
  nativeName: { [key: string]: Translation };
}

export interface Translation {
  official: string;
  common:   string;
}

export interface PostalCode {
  format: string;
  regex?: string;
}

export enum Region {
  Africa = "Africa",
  Americas = "Americas",
  Europe = "Europe",
  Oceania = "Oceania",
}

export enum StartOfWeek {
  Monday = "monday",
}

export enum Status {
  OfficiallyAssigned = "officially-assigned",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toSearchResponse(json: string): countries[] {
    return cast(JSON.parse(json), a(r("SearchResponse")));
  }

  public static searchResponseToJson(value: countries[]): string {
    return JSON.stringify(uncast(value, a(r("SearchResponse"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "SearchResponse": o([
    { json: "name", js: "name", typ: r("Name") },
    { json: "tld", js: "tld", typ: a("") },
    { json: "cca2", js: "cca2", typ: "" },
    { json: "ccn3", js: "ccn3", typ: "" },
    { json: "cca3", js: "cca3", typ: "" },
    { json: "independent", js: "independent", typ: true },
    { json: "status", js: "status", typ: r("Status") },
    { json: "unMember", js: "unMember", typ: true },
    { json: "currencies", js: "currencies", typ: m(r("Currency")) },
    { json: "idd", js: "idd", typ: r("Idd") },
    { json: "capital", js: "capital", typ: a("") },
    { json: "altSpellings", js: "altSpellings", typ: a("") },
    { json: "region", js: "region", typ: r("Region") },
    { json: "subregion", js: "subregion", typ: "" },
    { json: "languages", js: "languages", typ: r("Languages") },
    { json: "translations", js: "translations", typ: m(r("Translation")) },
    { json: "latlng", js: "latlng", typ: a(3.14) },
    { json: "landlocked", js: "landlocked", typ: true },
    { json: "area", js: "area", typ: 3.14 },
    { json: "demonyms", js: "demonyms", typ: r("Demonyms") },
    { json: "flag", js: "flag", typ: "" },
    { json: "maps", js: "maps", typ: r("Maps") },
    { json: "population", js: "population", typ: 0 },
    { json: "car", js: "car", typ: r("Car") },
    { json: "timezones", js: "timezones", typ: a("") },
    { json: "continents", js: "continents", typ: a("") },
    { json: "flags", js: "flags", typ: r("Flags") },
    { json: "coatOfArms", js: "coatOfArms", typ: r("CoatOfArms") },
    { json: "startOfWeek", js: "startOfWeek", typ: r("StartOfWeek") },
    { json: "capitalInfo", js: "capitalInfo", typ: r("CapitalInfo") },
    { json: "cioc", js: "cioc", typ: u(undefined, "") },
    { json: "fifa", js: "fifa", typ: u(undefined, "") },
    { json: "borders", js: "borders", typ: u(undefined, a("")) },
    { json: "gini", js: "gini", typ: u(undefined, m(3.14)) },
    { json: "postalCode", js: "postalCode", typ: u(undefined, r("PostalCode")) },
  ], false),
  "CapitalInfo": o([
    { json: "latlng", js: "latlng", typ: a(3.14) },
  ], false),
  "Car": o([
    { json: "signs", js: "signs", typ: a("") },
    { json: "side", js: "side", typ: r("Side") },
  ], false),
  "CoatOfArms": o([
    { json: "png", js: "png", typ: u(undefined, "") },
    { json: "svg", js: "svg", typ: u(undefined, "") },
  ], false),
  "Currency": o([
    { json: "name", js: "name", typ: "" },
    { json: "symbol", js: "symbol", typ: "" },
  ], false),
  "Demonyms": o([
    { json: "eng", js: "eng", typ: r("EngClass") },
    { json: "fra", js: "fra", typ: u(undefined, r("EngClass")) },
  ], false),
  "EngClass": o([
    { json: "f", js: "f", typ: "" },
    { json: "m", js: "m", typ: "" },
  ], false),
  "Flags": o([
    { json: "png", js: "png", typ: "" },
    { json: "svg", js: "svg", typ: "" },
    { json: "alt", js: "alt", typ: u(undefined, "") },
  ], false),
  "Idd": o([
    { json: "root", js: "root", typ: "" },
    { json: "suffixes", js: "suffixes", typ: a("") },
  ], false),
  "Languages": o([
    { json: "cal", js: "cal", typ: u(undefined, "") },
    { json: "cha", js: "cha", typ: u(undefined, "") },
    { json: "eng", js: "eng", typ: u(undefined, r("EngEnum")) },
    { json: "spa", js: "spa", typ: u(undefined, "") },
    { json: "fra", js: "fra", typ: u(undefined, "") },
    { json: "nld", js: "nld", typ: u(undefined, "") },
    { json: "pap", js: "pap", typ: u(undefined, "") },
    { json: "rar", js: "rar", typ: u(undefined, "") },
    { json: "ara", js: "ara", typ: u(undefined, "") },
    { json: "zdj", js: "zdj", typ: u(undefined, "") },
    { json: "gsw", js: "gsw", typ: u(undefined, "") },
    { json: "ita", js: "ita", typ: u(undefined, "") },
    { json: "roh", js: "roh", typ: u(undefined, "") },
    { json: "kon", js: "kon", typ: u(undefined, "") },
    { json: "lin", js: "lin", typ: u(undefined, "") },
    { json: "lua", js: "lua", typ: u(undefined, "") },
    { json: "swa", js: "swa", typ: u(undefined, "") },
    { json: "ber", js: "ber", typ: u(undefined, "") },
  ], false),
  "Maps": o([
    { json: "googleMaps", js: "googleMaps", typ: "" },
    { json: "openStreetMaps", js: "openStreetMaps", typ: "" },
  ], false),
  "Name": o([
    { json: "common", js: "common", typ: "" },
    { json: "official", js: "official", typ: "" },
    { json: "nativeName", js: "nativeName", typ: m(r("Translation")) },
  ], false),
  "Translation": o([
    { json: "official", js: "official", typ: "" },
    { json: "common", js: "common", typ: "" },
  ], false),
  "PostalCode": o([
    { json: "format", js: "format", typ: "" },
    { json: "regex", js: "regex", typ: u(undefined, "") },
  ], false),
  "Side": [
    "left",
    "right",
  ],
  "EngEnum": [
    "English",
  ],
  "Region": [
    "Africa",
    "Americas",
    "Europe",
    "Oceania",
  ],
  "StartOfWeek": [
    "monday",
  ],
  "Status": [
    "officially-assigned",
  ],
};
