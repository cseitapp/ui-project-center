// To parse this data:
//
//   import { Convert, MenuModel } from "./file";
//
//   const menuModel = Convert.toMenuModel(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MenuModel {
    ROLE_ID: string;
    MENU_ID: string;
    ENABLE: number
    ICON: string | null;
    CSS_ICON: string | null;
    TYPE: string;
    MENU_NAME_EN: string | null;
    MENU_NAME_LA: string | null;
    MENU_ORDER: number;
    PATH: string | null;
    SUB_MENU_ID: string | null;
    COLOR: string | null;
    MENU_DESC: string | null;
}


export interface AllMenuModel {
    MENU_ID: string
    CREATED_BY: string
    CREATED_AT: string
    MODIFIED_BY: any
    MODIFIED_AT: any
    ENABLE: number
    ICON: string
    TYPE: string
    MENU_NAME_EN: string
    MENU_NAME_LA: string
    MENU_ORDER: number
    PATH: string
    SUB_MENU_ID: string
    PRO_ID: string
    COLOR: string
    MENU_DESC: any
    CSS_ICON: any
  }
  