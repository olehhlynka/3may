import { getFetchRequest } from '@swarmion/serverless-contracts';
import { getImageUploadUrlContract } from '@3may/contracts';
import { UploadInfo } from '../types.ts';

export const getUploadImageUrl = async (
  imageName: string,
  isProfileImage: boolean = false,
  token: string | null = null,
) => {
  const { body } = await getFetchRequest(getImageUploadUrlContract, fetch, {
    baseUrl: import.meta.env.VITE_SWARMION_API_URL,
    pathParameters: {
      fileName: imageName,
    },
    queryStringParameters: {
      profile: isProfileImage ? 'true' : 'false',
    },
    // @ts-expect-error headers are not defined
    headers: {
      Authorization: token,
    },
  });

  if ('url' in body) {
    return body;
  }
};

export const uploadImage = (data: UploadInfo, file: File) => {
  const formData = new FormData();

  formData.append('key', data.presignedPost.fields.key);
  formData.append('bucket', data.presignedPost.fields.bucket);
  formData.append(
    'X-Amz-Algorithm',
    data.presignedPost.fields['X-Amz-Algorithm'],
  );
  formData.append(
    'X-Amz-Credential',
    data.presignedPost.fields['X-Amz-Credential'],
  );
  formData.append('X-Amz-Date', data.presignedPost.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    data.presignedPost.fields['X-Amz-Security-Token'],
  );
  formData.append(
    'X-Amz-Signature',
    data.presignedPost.fields['X-Amz-Signature'],
  );
  formData.append('Policy', data.presignedPost.fields.Policy);
  formData.append('file', file);

  return fetch(data.presignedPost.url, {
    method: 'POST',
    body: formData,
  });
};
