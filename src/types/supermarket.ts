import type { paths } from "../api/openapi.types";
import type { components } from "../api/openapi.types";

export type Product = components["schemas"]["Product"];
export type Supermarket = SearchPathParams["supermarket"];

export type SearchBody =
  paths["/search/{supermarket}"]["post"]["requestBody"]["content"]["application/json"];

type SearchPathParams =
  paths["/search/{supermarket}"]["post"]["parameters"]["path"];
