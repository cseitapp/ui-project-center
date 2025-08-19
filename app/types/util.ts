export interface CodeAndTextModel {
  CODE: string;
  TEXT: string;
  CLASS?: string;
  ICON?: string;
}

export interface FileInfoModel {
  name: string;
  type: number;
  size: number;
  rawModifiedAt: string;
}
