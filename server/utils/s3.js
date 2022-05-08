const aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

exports.getS3SignedURL = async (fileName, fileType, userId) => {
  const region = process.env.REGION;
  const bucketName = process.env.BUCKET_NAME;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });

  const name = fileName + "." + fileType + userId;

  const params = {
    Bucket: bucketName,
    Key: name,
    Expires: 3 * 60,
  };
  console.log(params);
  return await s3.getSignedUrlPromise("putObject", params);
};
