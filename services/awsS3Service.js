import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
import {AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY} from "../config";

const randomBytes = promisify(crypto.randomBytes);

const region = "us-east-1";
const bucketName = "desi-in-videsi";
const accessKeyId = AWS_ACCESS_KEY_ID;
const secretAccessKey = AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
});

async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString("hex");
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60,
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
};

export default generateUploadURL;