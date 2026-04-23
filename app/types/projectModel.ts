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
