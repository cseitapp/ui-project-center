export interface UserRoleModel {
  ID: number;
  USER_NAME: string;
  ROLE_ID: string;
  ROLE_NAME_LA: string;
  ROLE_NAME_EN: string;
  ROLE_CODE: string;
  ROLE_ORDER: number;
  PRO_ID: string;
  IS_DEFAULT: any;
  EMP_ID: number;
  FULL_NAME_LA: string;
  FULL_NAME_EN: string;
  PICTURE: string;
  EMP_STATUS: number;
  POS_NAME: string;
  POS_NAME_EN: string;
  POS_DESC: string;
  TEAM_NAME: string;
  SEC_NAME: string;
  SEC_NAME_EN: string;
  BR_NAME: string;
  BR_CODE: string;
  BR_NAME_EN: string;
}

export interface RoleModel {
  ROLE_ID: string;
  ROLE_NAME_LA: string;
  ROLE_NAME_EN: string;
  CREATED_BY: string;
  CREATED_AT: string;
  MODIFIED_BY: any;
  MODIFIED_AT: any;
  ROLE_CODE: string;
  ROLE_ORDER: number;
  PRO_ID: string;
  IS_DEFAULT: any;
}
