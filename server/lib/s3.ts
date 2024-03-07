import aws from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

export const getS3SignedURL = async (
  fileName: string,
  fileType: string,
  userId: string
) => {
  const region = process.env.REGION;
  const bucketName = process.env.BUCKET_NAME;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4',
  });

  const name = fileName + userId + '.' + fileType;

  const params = {
    Bucket: bucketName,
    Key: name,
    Expires: 3 * 60,
  };
  return await s3.getSignedUrlPromise('putObject', params);
};
