export interface ProjectListModel {
  PRO_ID: string;
  PRO_NAME_LA: string;
  PRO_NAME_EN: string;
  ADDRESS: string;
  PROTOCOL: string;
  HOST: string;
  PORT: string;
  PRO_STATUS: string;
  CREATED_BY: string;
  CREATED_AT: string;
  PRO_TYPE: string;
  PRO_ICON: string;
  GROUP_ID: number;
  GROUP_NAME: string;
  GROUP_ORDER: number;
}

export interface ProjectGroupModel {
  GROUP_ID: number;
  GROUP_NAME: string;
  GROUP_ORDER: number;
  GROUP_STATUS: string;
  CREATED_BY: string;
  CREATED_AT: string;
}

export interface ProjectManagerModel {
  ID: number
  PRO_ID: string
  USER_NAME: string
  MN_TYPE: string
  MN_STATUS: string
  CREATED_BY: string
  CREATED_AT: string
  EMP_ID: number
  FULL_NAME_LA: string
  FULL_NAME_EN: string
  EMAIL: string
  MOBILE: string
  PICTURE: string
  POS_NAME: string
  POS_NAME_EN: string
  POS_ORDER: number
  POS_DESC: string
  TEAM_NAME: string
  SEC_NAME: string
  SEC_NAME_EN: string
  BR_NAME: string
  BR_CODE: string
  BR_NAME_EN: string
}
