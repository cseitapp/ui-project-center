

export interface BranchModel {
    BR_ID:      number;
    BR_NAME:    string;
    BR_NAME_EN: string;
    SUB_BR_ID:  number;
    BR_CODE:    string;
    BR_ORDER:   null;
}

export interface SectionModel {
    SECTION_ID:      number;
    SEC_NAME:    string;
    BRANCH_ID:   number;
    UNIT:        null;
    SEC_NAME_EN: string;
}
export interface SectionDirectorModel {
    USER_NAME:    string;
    FULL_NAME_LA: string;
    FULL_NAME_EN: string;
    SECTION_ID:   number;
    SEC_NAME:     string;
    SEC_NAME_EN:  string;
}

export interface TeamModel {
    TEAM_ID:    number;
    TEAM_NAME:  string;
    SECTION_ID: number;
}

export interface PositionModel {
    POS_ID:        number;
    POS_NAME:      string;
    POS_NAME_EN:   string;
    POS_ORDER:     number;
    ORG_TYPE_ID:   number;
    ORG_TYPE_NAME: string;
}

export interface OrgManagementModel {
    USER_NAME: string
    BR_ID_GROUP: any
    BR_CODE_GROUP: any
    SECTION_GROUP: any
    TEAM_GROUP: any
    POS_GROUP: any
    USER_GROUP:any
  }

  export interface OrgManagementListModel {
    USER_NAME: string
    EMP_ID: number
    FULL_NAME_LA: string
    FULL_NAME_EN: string
    PICTURE: string
    EMP_STATUS: number
    POS_NAME: string
    POS_NAME_EN: string
    POS_DESC: string
    TEAM_NAME: string
    SEC_NAME: string
    SEC_NAME_EN: string
    SEC_LATITUDE: any
    BR_NAME: string
    BR_CODE: string
    BR_NAME_EN: string
  }

  export interface OrgManagementDetailModel {
    ID: number
    USER_NAME: string
    BRANCH_ID: any
    BR_CODE: any
    SECTION_ID: any
    TEAM_ID: any
    POS_ID: any
    SP_USER: any
  }
  

  
  