const { Client } = require('minio');
const path     = require('path');

module.exports = {
    uploadFileMinio
};
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const minioClient = new Client({
    endPoint: process.env.ENDPOINT_MINIO, //'10.201.54.9',
    port: 9000,
    accessKey: process.env.ACCESS_KEY_MINIO,
    secretKey: process.env.SECRET_KEY_MINIO,
    useSSL: true, // Ensure this is true if you're connecting over HTTPS
});

async function uploadFileMinio(sourceNameFile = '', destinationFileName = '') {
    const sourceFile = path.join(key.__pathRoot + '/' + sourceNameFile)

    // Destination bucket
    const bucket = process.env.BUCKET_MINIO || 'web-plt-gtk';

    // Destination object name
    const destinationObject = destinationFileName;

    // Check if the bucket exists
    // If it doesn't, create it
    const exists = await minioClient.bucketExists(bucket)
    if (exists) {
        console.log('Bucket ' + bucket + ' exists.')
    }

    await minioClient.fPutObject(bucket, destinationObject, sourceFile)

    // Generate a pre-signed URL for the uploaded object
    return await minioClient.presignedGetObject(bucket, destinationObject)
    .then((a) => {
        console.log('Presigned URL:', a);
        return a;
    }).catch((err) => {
        console.error(err);
        throw err;
    });
}