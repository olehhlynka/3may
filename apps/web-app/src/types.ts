export interface UploadInfo {
  url: string;
  presignedPost: {
    url: string;
    fields: {
      key: string;
      acl: string;
      bucket: string;
      'X-Amz-Algorithm': string;
      'X-Amz-Credential': string;
      'X-Amz-Date': string;
      'X-Amz-Security-Token': string;
      'X-Amz-Signature': string;
      Policy: string;
    };
  };
}