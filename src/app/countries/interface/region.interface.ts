// To parse this data:
//
//   import { Convert } from "./file";
//
//   const region = Convert.toRegion(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Region {
  name:         Name;
  tld:          string[];
  cca2:         string;
  ccn3:         string;
  cca3:         string;
  cioc?:        string;
  independent:  boolean;
  status:       Status;
  unMember:     boolean;
  currencies:   Currencies;
  idd:          Idd;
  capital:      string[];
  altSpellings: string[];
  region:       RegionElement;
  subregion:    Subregion;
  languages:    Languages;
  translations: { [key: string]: Translation };
  latlng:       number[];
  landlocked:   boolean;
  borders?:     string[];
  area:         number;
  demonyms:     Demonyms;
  flag:         string;
  maps:         Maps;
  population:   number;
  gini?:        { [key: string]: number };
  fifa?:        string;
  car:          Car;
  timezones:    string[];
  continents:   RegionElement[];
  flags:        Flags;
  coatOfArms:   CoatOfArms;
  startOfWeek:  StartOfWeek;
  capitalInfo:  CapitalInfo;
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

export enum RegionElement {
  Africa = "Africa",
  Asia = "Asia",
}

export interface Currencies {
  MWK?: Aoa;
  XOF?: Aoa;
  XAF?: Aoa;
  NAD?: Aoa;
  ZAR?: Aoa;
  NGN?: Aoa;
  EUR?: Aoa;
  CVE?: Aoa;
  LYD?: Aoa;
  DZD?: Aoa;
  MUR?: Aoa;
  AOA?: Aoa;
  GHS?: Aoa;
  GBP?: Aoa;
  SHP?: Aoa;
  ETB?: Aoa;
  MAD?: Aoa;
  STN?: Aoa;
  BIF?: Aoa;
  UGX?: Aoa;
  ZWL?: Aoa;
  MZN?: Aoa;
  TND?: Aoa;
  CDF?: Aoa;
  SLL?: Aoa;
  MRU?: Aoa;
  LSL?: Aoa;
  EGP?: Aoa;
  LRD?: Aoa;
  MGA?: Aoa;
  GMD?: Aoa;
  DJF?: Aoa;
  ERN?: Aoa;
  TZS?: Aoa;
  SOS?: Aoa;
  USD?: Aoa;
  SSP?: Aoa;
  SZL?: Aoa;
  KES?: Aoa;
  ZMW?: Aoa;
  GNF?: Aoa;
  RWF?: Aoa;
  KMF?: Aoa;
  SCR?: Aoa;
  SDG?: Sdg;
  BWP?: Aoa;
}

export interface Aoa {
  name:   string;
  symbol: string;
}

export interface Sdg {
  name: string;
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
  eng?: EngEnum;
  nya?: string;
  fra?: Fra;
  afr?: string;
  deu?: string;
  her?: string;
  hgm?: string;
  kwn?: string;
  loz?: string;
  ndo?: string;
  tsn?: string;
  ara?: Ara;
  por?: string;
  mfe?: string;
  amh?: string;
  ber?: string;
  run?: string;
  swa?: string;
  bwg?: string;
  kck?: string;
  khi?: string;
  ndc?: string;
  nde?: string;
  sna?: string;
  sot?: string;
  toi?: string;
  tso?: string;
  ven?: string;
  xho?: string;
  zib?: string;
  kon?: string;
  lin?: string;
  lua?: string;
  nbl?: string;
  nso?: string;
  ssw?: string;
  zul?: string;
  mey?: string;
  spa?: string;
  sag?: string;
  mlg?: string;
  tir?: string;
  som?: string;
  kin?: string;
  zdj?: string;
  crs?: string;
  pov?: string;
}

export enum Ara {
  Arabic = "Arabic",
}

export enum EngEnum {
  English = "English",
}

export enum Fra {
  French = "French",
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
  regex:  string;
}

export enum StartOfWeek {
  Monday = "monday",
  Sunday = "sunday",
}

export enum Status {
  OfficiallyAssigned = "officially-assigned",
}

export enum Subregion {
  EasternAfrica = "Eastern Africa",
  MiddleAfrica = "Middle Africa",
  NorthernAfrica = "Northern Africa",
  SouthernAfrica = "Southern Africa",
  WesternAfrica = "Western Africa",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toRegion(json: string): Region[] {
    return cast(JSON.parse(json), a(r("Region")));
  }

  public static regionToJson(value: Region[]): string {
    return JSON.stringify(uncast(value, a(r("Region"))), null, 2);
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
  "Region": o([
    { json: "name", js: "name", typ: r("Name") },
    { json: "tld", js: "tld", typ: a("") },
    { json: "cca2", js: "cca2", typ: "" },
    { json: "ccn3", js: "ccn3", typ: "" },
    { json: "cca3", js: "cca3", typ: "" },
    { json: "cioc", js: "cioc", typ: u(undefined, "") },
    { json: "independent", js: "independent", typ: true },
    { json: "status", js: "status", typ: r("Status") },
    { json: "unMember", js: "unMember", typ: true },
    { json: "currencies", js: "currencies", typ: r("Currencies") },
    { json: "idd", js: "idd", typ: r("Idd") },
    { json: "capital", js: "capital", typ: a("") },
    { json: "altSpellings", js: "altSpellings", typ: a("") },
    { json: "region", js: "region", typ: r("RegionElement") },
    { json: "subregion", js: "subregion", typ: r("Subregion") },
    { json: "languages", js: "languages", typ: r("Languages") },
    { json: "translations", js: "translations", typ: m(r("Translation")) },
    { json: "latlng", js: "latlng", typ: a(3.14) },
    { json: "landlocked", js: "landlocked", typ: true },
    { json: "borders", js: "borders", typ: u(undefined, a("")) },
    { json: "area", js: "area", typ: 0 },
    { json: "demonyms", js: "demonyms", typ: r("Demonyms") },
    { json: "flag", js: "flag", typ: "" },
    { json: "maps", js: "maps", typ: r("Maps") },
    { json: "population", js: "population", typ: 0 },
    { json: "gini", js: "gini", typ: u(undefined, m(3.14)) },
    { json: "fifa", js: "fifa", typ: u(undefined, "") },
    { json: "car", js: "car", typ: r("Car") },
    { json: "timezones", js: "timezones", typ: a("") },
    { json: "continents", js: "continents", typ: a(r("RegionElement")) },
    { json: "flags", js: "flags", typ: r("Flags") },
    { json: "coatOfArms", js: "coatOfArms", typ: r("CoatOfArms") },
    { json: "startOfWeek", js: "startOfWeek", typ: r("StartOfWeek") },
    { json: "capitalInfo", js: "capitalInfo", typ: r("CapitalInfo") },
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
  "Currencies": o([
    { json: "MWK", js: "MWK", typ: u(undefined, r("Aoa")) },
    { json: "XOF", js: "XOF", typ: u(undefined, r("Aoa")) },
    { json: "XAF", js: "XAF", typ: u(undefined, r("Aoa")) },
    { json: "NAD", js: "NAD", typ: u(undefined, r("Aoa")) },
    { json: "ZAR", js: "ZAR", typ: u(undefined, r("Aoa")) },
    { json: "NGN", js: "NGN", typ: u(undefined, r("Aoa")) },
    { json: "EUR", js: "EUR", typ: u(undefined, r("Aoa")) },
    { json: "CVE", js: "CVE", typ: u(undefined, r("Aoa")) },
    { json: "LYD", js: "LYD", typ: u(undefined, r("Aoa")) },
    { json: "DZD", js: "DZD", typ: u(undefined, r("Aoa")) },
    { json: "MUR", js: "MUR", typ: u(undefined, r("Aoa")) },
    { json: "AOA", js: "AOA", typ: u(undefined, r("Aoa")) },
    { json: "GHS", js: "GHS", typ: u(undefined, r("Aoa")) },
    { json: "GBP", js: "GBP", typ: u(undefined, r("Aoa")) },
    { json: "SHP", js: "SHP", typ: u(undefined, r("Aoa")) },
    { json: "ETB", js: "ETB", typ: u(undefined, r("Aoa")) },
    { json: "MAD", js: "MAD", typ: u(undefined, r("Aoa")) },
    { json: "STN", js: "STN", typ: u(undefined, r("Aoa")) },
    { json: "BIF", js: "BIF", typ: u(undefined, r("Aoa")) },
    { json: "UGX", js: "UGX", typ: u(undefined, r("Aoa")) },
    { json: "ZWL", js: "ZWL", typ: u(undefined, r("Aoa")) },
    { json: "MZN", js: "MZN", typ: u(undefined, r("Aoa")) },
    { json: "TND", js: "TND", typ: u(undefined, r("Aoa")) },
    { json: "CDF", js: "CDF", typ: u(undefined, r("Aoa")) },
    { json: "SLL", js: "SLL", typ: u(undefined, r("Aoa")) },
    { json: "MRU", js: "MRU", typ: u(undefined, r("Aoa")) },
    { json: "LSL", js: "LSL", typ: u(undefined, r("Aoa")) },
    { json: "EGP", js: "EGP", typ: u(undefined, r("Aoa")) },
    { json: "LRD", js: "LRD", typ: u(undefined, r("Aoa")) },
    { json: "MGA", js: "MGA", typ: u(undefined, r("Aoa")) },
    { json: "GMD", js: "GMD", typ: u(undefined, r("Aoa")) },
    { json: "DJF", js: "DJF", typ: u(undefined, r("Aoa")) },
    { json: "ERN", js: "ERN", typ: u(undefined, r("Aoa")) },
    { json: "TZS", js: "TZS", typ: u(undefined, r("Aoa")) },
    { json: "SOS", js: "SOS", typ: u(undefined, r("Aoa")) },
    { json: "USD", js: "USD", typ: u(undefined, r("Aoa")) },
    { json: "SSP", js: "SSP", typ: u(undefined, r("Aoa")) },
    { json: "SZL", js: "SZL", typ: u(undefined, r("Aoa")) },
    { json: "KES", js: "KES", typ: u(undefined, r("Aoa")) },
    { json: "ZMW", js: "ZMW", typ: u(undefined, r("Aoa")) },
    { json: "GNF", js: "GNF", typ: u(undefined, r("Aoa")) },
    { json: "RWF", js: "RWF", typ: u(undefined, r("Aoa")) },
    { json: "KMF", js: "KMF", typ: u(undefined, r("Aoa")) },
    { json: "SCR", js: "SCR", typ: u(undefined, r("Aoa")) },
    { json: "SDG", js: "SDG", typ: u(undefined, r("Sdg")) },
    { json: "BWP", js: "BWP", typ: u(undefined, r("Aoa")) },
  ], false),
  "Aoa": o([
    { json: "name", js: "name", typ: "" },
    { json: "symbol", js: "symbol", typ: "" },
  ], false),
  "Sdg": o([
    { json: "name", js: "name", typ: "" },
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
    { json: "eng", js: "eng", typ: u(undefined, r("EngEnum")) },
    { json: "nya", js: "nya", typ: u(undefined, "") },
    { json: "fra", js: "fra", typ: u(undefined, r("Fra")) },
    { json: "afr", js: "afr", typ: u(undefined, "") },
    { json: "deu", js: "deu", typ: u(undefined, "") },
    { json: "her", js: "her", typ: u(undefined, "") },
    { json: "hgm", js: "hgm", typ: u(undefined, "") },
    { json: "kwn", js: "kwn", typ: u(undefined, "") },
    { json: "loz", js: "loz", typ: u(undefined, "") },
    { json: "ndo", js: "ndo", typ: u(undefined, "") },
    { json: "tsn", js: "tsn", typ: u(undefined, "") },
    { json: "ara", js: "ara", typ: u(undefined, r("Ara")) },
    { json: "por", js: "por", typ: u(undefined, "") },
    { json: "mfe", js: "mfe", typ: u(undefined, "") },
    { json: "amh", js: "amh", typ: u(undefined, "") },
    { json: "ber", js: "ber", typ: u(undefined, "") },
    { json: "run", js: "run", typ: u(undefined, "") },
    { json: "swa", js: "swa", typ: u(undefined, "") },
    { json: "bwg", js: "bwg", typ: u(undefined, "") },
    { json: "kck", js: "kck", typ: u(undefined, "") },
    { json: "khi", js: "khi", typ: u(undefined, "") },
    { json: "ndc", js: "ndc", typ: u(undefined, "") },
    { json: "nde", js: "nde", typ: u(undefined, "") },
    { json: "sna", js: "sna", typ: u(undefined, "") },
    { json: "sot", js: "sot", typ: u(undefined, "") },
    { json: "toi", js: "toi", typ: u(undefined, "") },
    { json: "tso", js: "tso", typ: u(undefined, "") },
    { json: "ven", js: "ven", typ: u(undefined, "") },
    { json: "xho", js: "xho", typ: u(undefined, "") },
    { json: "zib", js: "zib", typ: u(undefined, "") },
    { json: "kon", js: "kon", typ: u(undefined, "") },
    { json: "lin", js: "lin", typ: u(undefined, "") },
    { json: "lua", js: "lua", typ: u(undefined, "") },
    { json: "nbl", js: "nbl", typ: u(undefined, "") },
    { json: "nso", js: "nso", typ: u(undefined, "") },
    { json: "ssw", js: "ssw", typ: u(undefined, "") },
    { json: "zul", js: "zul", typ: u(undefined, "") },
    { json: "mey", js: "mey", typ: u(undefined, "") },
    { json: "spa", js: "spa", typ: u(undefined, "") },
    { json: "sag", js: "sag", typ: u(undefined, "") },
    { json: "mlg", js: "mlg", typ: u(undefined, "") },
    { json: "tir", js: "tir", typ: u(undefined, "") },
    { json: "som", js: "som", typ: u(undefined, "") },
    { json: "kin", js: "kin", typ: u(undefined, "") },
    { json: "zdj", js: "zdj", typ: u(undefined, "") },
    { json: "crs", js: "crs", typ: u(undefined, "") },
    { json: "pov", js: "pov", typ: u(undefined, "") },
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
    { json: "regex", js: "regex", typ: "" },
  ], false),
  "Side": [
    "left",
    "right",
  ],
  "RegionElement": [
    "Africa",
    "Asia",
  ],
  "Ara": [
    "Arabic",
  ],
  "EngEnum": [
    "English",
  ],
  "Fra": [
    "French",
  ],
  "StartOfWeek": [
    "monday",
    "sunday",
  ],
  "Status": [
    "officially-assigned",
  ],
  "Subregion": [
    "Eastern Africa",
    "Middle Africa",
    "Northern Africa",
    "Southern Africa",
    "Western Africa",
  ],
};
