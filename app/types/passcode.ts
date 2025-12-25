export interface PasscodeInfoModel {
    ID: number
    USER_NAME: string
    PUREPOSE: string
    MAX_ATTEMPTS: number
    ATTEMPTS_USED: number
    IS_LOCKED: number
    IS_USED: number
    CREATED_BY: string
    CREATED_AT: string
    UPDATED_AT: string
    PASSCODE_STATUS: string
    FULL_NAME_LA: string
    FULL_NAME_EN: string
    PICTURE: string
    POS_NAME: string
    POS_NAME_EN: string
    POS_DESC: string
    TEAM_NAME: string
    SEC_NAME: string
    SEC_NAME_EN: string
    BR_NAME: string
    BR_CODE: string
    BR_NAME_EN: string
  }

  export interface PasscodeTypeModel {
    TYPE_CODE: string
    TYPE_NAME: string
    TYPE_STATUS: string
  }