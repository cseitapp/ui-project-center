// To parse this data:
//
//   import { Convert, LoginModel } from "./file";
//
//   const loginModel = Convert.toLoginModel(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
export interface LoginModel {
  ROLE_ID:       string;
  ROLE_CODE:     string;
  EMP_ID:        number;
  USER_NAME:     string;
  FULL_NAME_LA:  string;
  FULL_NAME_EN:  string;
  DOB:           string;
  EMAIL:         string;
  GENDER:        string;
  MOBILE:        string;
  PICTURE:       null;
  EMP_STATUS:    number;
  HIRE_DATE:     string;
  POS_ID:        number;
  POS_NAME:      string;
  POS_NAME_EN:   string;
  POS_ORDER:     number;
  POS_DESC:      string;
  TEAM_ID:       number;
  TEAM_NAME:     string;
  SECTION_ID:    number;
  SEC_NAME:      string;
  SEC_NAME_EN:   string;
  SEC_LATITUDE:  null;
  SEC_LONGITUDE: null;
  SEC_RADIUS:    null;
  BRANCH_ID:     number;
  BR_NAME:       string;
  BR_LATITUDE:   number;
  BR_LONGITUDE:  number;
  BR_RADIUS:     number;
  BR_CODE:       string;
  BR_NAME_EN:    string;
}

export interface UserModel {
  EMP_ID: number;
  USER_NAME: string;
  FULL_NAME_LA: string;
  FULL_NAME_EN: string;
  DOB: string;
  EMAIL: string;
  GENDER: string;
  MOBILE: null;
  PICTURE: null;
  EMP_STATUS: number;
  HIRE_DATE: string;
  POS_ID: number;
  POS_NAME: string;
  POS_NAME_EN: string;
  POS_ORDER: number;
  POS_DESC: string;
  TEAM_ID: number;
  TEAM_NAME: string;
  SECTION_ID: number;
  SEC_NAME: string;
  SEC_NAME_EN: string;
  SEC_LATITUDE: null;
  SEC_LONGITUDE: null;
  SEC_RADIUS: null;
  BRANCH_ID: number;
  BR_NAME: string;
  BR_LATITUDE: number;
  BR_LONGITUDE: number;
  BR_RADIUS: number;
  BR_CODE: string;
  BR_NAME_EN: string;
}

export interface EmployeeRoleModel {
  ROLE_ID:       string;
  ROLE_CODE:     string;
  PRO_ID:        string;
  EMP_ID:        number;
  USER_NAME:     string;
  FULL_NAME_LA:  string;
  FULL_NAME_EN:  string;
  DOB:           string;
  EMAIL:         string;
  GENDER:        string;
  MOBILE:        string;
  PICTURE:       null;
  EMP_STATUS:    number;
  HIRE_DATE:     string;
  POS_ID:        number;
  POS_NAME:      string;
  POS_NAME_EN:   string;
  POS_ORDER:     number;
  POS_DESC:      string;
  TEAM_ID:       number;
  TEAM_NAME:     string;
  SECTION_ID:    number;
  SEC_NAME:      string;
  SEC_NAME_EN:   string;
  SEC_LATITUDE:  null;
  SEC_LONGITUDE: null;
  SEC_RADIUS:    null;
  BRANCH_ID:     number;
  BR_NAME:       string;
  BR_LATITUDE:   number;
  BR_LONGITUDE:  number;
  BR_RADIUS:     number;
  BR_CODE:       string;
  BR_NAME_EN:    string;
}
