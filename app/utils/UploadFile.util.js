const sftpClient = require('ssh2-sftp-client');
const path_main = require('path');
const fs = require('fs');
var mime = require('mime-types');
var FormData = require('form-data');
const axios = require('axios');
const ShortUniqueId = require('short-unique-id');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const { uploadFileMinio } = require('../middlewares/UploadMinio.middleware');

// SFTP Upload File PPDB SLB
const sftpConfig = {
    host: process.env.HOST_SFTP,
    port: process.env.PORT_SFTP,
    username: process.env.USERNAME_SFTP,
    password: process.env.PASSWORD_SFTP,
    readyTimeout: 20000,
    retries: 3,
};

module.exports = {
    putFiles,
    putFilesMinio,
    deleteFiles,
    moveToDeleted,
    deleteFilesMinio,
    downloadFileS3
}

/**
 * Upload files to Minio
 * @param {Object} _file - Single file or array of files to be uploaded
 * @param {Number} jenisFileId - Id of jenis_file table
 * @param {String} _dir - Directory where the file will be uploaded
 * @param {Object} _data - Additional data to be stored in the database
 * @returns {Promise} - Resolves with an array of uploaded file names
 */

async function putFilesMinio(_file, jenisFileId, _dir, _data) {
    const uid = new ShortUniqueId({ length: 10 });
    let _tempName = [];
    let _alternateUrl = [];
    var fileList = [];

    if (!Array.isArray(_file)) {
        fileList.push(_file);
    } else {
        fileList = _file;
    }

    return new Promise(function (resolve, reject) {
        Promise.all(
            fileList.map(async (args) => {
                var ext = mime.extension(args.mimetype);
                const _name = _data.fileName + uid.rnd() + '-' + Date.now() + '.' + ext;
                // return await uploadFileMinio(args.tempFilePath, _dir + _name);
                const formData = new FormData();
                formData.append('attachment', fs.createReadStream(args.tempFilePath));
                formData.append('name', _dir + _name);
                formData.append('bucket', process.env.BUCKET_MINIO);

                return await axios({
                    method: "post",
                    url: process.env.URL_UPLOAD_MINIO,
                    data: formData,
                    headers: {
                        'Authorization': 'Bearer ' + process.env.TOKEN_DOWNLOAD_MINIO,
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        'x-api-key': process.env.SECRET_KEY_URL_MINIO,
                        'x-access-key': process.env.ACCESS_KEY_MINIO,
                        'x-secret-minio': process.env.SECRET_KEY_MINIO
                    },
                }).then(async () => {
                    await axios({
                        method: "get",
                        url: process.env.URL_DOWNLOAD_MINIO,
                        params: {
                            file_name: _dir + _name,
                            bucket: process.env.BUCKET_MINIO,
                            expiry: 0
                        },
                        headers: {
                            'Authorization': 'Bearer ' + process.env.TOKEN_DOWNLOAD_MINIO,
                            'Accept': 'application/json',
                            'x-api-key': process.env.SECRET_KEY_URL_MINIO,
                            'x-access-key': process.env.ACCESS_KEY_MINIO,
                            'x-secret-minio': process.env.SECRET_KEY_MINIO
                        }
                    }).then((res_get) => {
                        _tempName.push(_name)
                        _alternateUrl.push(res_get.data.data.url_file || '');
                    }).catch((err) => {
                        reject(err);
                    })
                }).catch((err) => {
                    reject(err);
                })
            })
        )
            .then(() => {
                return Promise.all(
                    fileList.map((x, key) => {
                        const data = {
                            jenis_file_id: jenisFileId,
                            filename: _tempName[key],
                            originalname: x.name,
                            size: x.size,
                            encoding: x.encoding,
                            path: _dir + _tempName[key],
                            mimetype: x.mimetype,
                            id_registration: _data?.id_registration,
                            id_disaster: _data?.id_disaster,
                            id_user: _data?.id_user,
                            nisn: null,
                            keterangan: _data?.keterangan,
                            nama_dokumen: _data?.nama_dokumen,
                            nomor_dokumen: _data?.nomor_dokumen,
                            tanggal_dokumen: _data?.tanggal_dokumen,
                            alternative_url: _alternateUrl[key] || null
                        }
                        return new initModels(sequelize).master_file.create(data).catch((err) => {
                            reject(err);
                        })
                    })
                )
            })
            .then(() => {
                // Step 3: Remove temp files
                return Promise.all(
                    fileList.map((x) => {
                        return new Promise((resolve, reject) => {
                            fs.unlink(x.tempFilePath, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    console.log(x.tempFilePath + ' was deleted');
                                    resolve();
                                }
                            });
                        });
                    })
                );
            })
            .then(() => {
                // All steps completed successfully
                resolve(_tempName);
            })
            .catch((error) => {
                // Any error in any step will be caught here
                reject(error);
            });
    });
};

async function putFiles(_file, jenisFileId, idParent, keterangan, _dir, idTrack, fileName = 'berkas_kcd-', _plt) {
    const sftp = new sftpClient();
    const uid = new ShortUniqueId({ length: 10 });
    let _tempName = [];
    var fileList = [];

    if (!Array.isArray(_file)) {
        fileList.push(_file);
    } else {
        fileList = _file;
    }

    return new Promise(function (resolve, reject) {
        sftp
            .connect(sftpConfig)
            .then(() => {
                return sftp.mkdir(_dir, true);
            })
            .then(() => {
                return Promise.all(
                    fileList.map((args) => {
                        var ext = mime.extension(args.mimetype);
                        const _name = fileName + uid.rnd() + '-' + Date.now() + '.' + ext;
                        _tempName.push(_name)
                        return sftp.fastPut(path_main.join(key.__pathRoot, args.tempFilePath), _dir + _name);
                    })
                );
            })
            .then(() => {
                return Promise.all(
                    fileList.map((x, key) => {
                        const data = {
                            filename: _tempName[key],
                            originalname: x.name,
                            size: x.size,
                            encoding: x.encoding,
                            path: _dir + _tempName[key],
                            mimetype: x.mimetype,
                            keterangan: keterangan,
                            jenis_file_id: jenisFileId,
                            id_plt: idParent ?? null,
                            id_track: idTrack ?? null,
                            nama_dokumen: _plt?.nama_dokumen,
                            nomor_dokumen: _plt?.nomor_dokumen,
                            tanggal_dokumen: _plt?.tanggal_dokumen,
                            keterangan_dokumen: _plt?.keterangan_dokumen,
                        }
                        return new initModels(sequelize).file_master.create(data);
                    })
                );
            })
            .then(() => {
                return Promise.all(
                    fileList.map((x, key) => {
                        console.log(x.tempFilePath + ' added')
                        fs.unlink(x.tempFilePath, (err) => {
                            if (err) throw err;
                            console.log(x.tempFilePath + ' was deleted');
                        });
                    })
                );
            })
            .then(() => sftp.end())
            .then(resolve)
            .catch(reject);
    });
};

async function deleteFilesMinio(fileList, _dir) {
    return new Promise(async function (resolve, reject) {
        return await axios({
            method: "delete",
            url: process.env.URL_DELETE_MINIO,
            data: {
                list_file: fileList,
                bucket: process.env.BUCKET_MINIO,
                expiry: 0
            },
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN_DOWNLOAD_MINIO,
                'Accept': 'application/json',
                'x-api-key': process.env.SECRET_KEY_URL_MINIO,
                'x-access-key': process.env.ACCESS_KEY_MINIO,
                'x-secret-minio': process.env.SECRET_KEY_MINIO
            }
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};

async function downloadFileS3(nameFile, localFilePath, originalname) {
    return new Promise(async function (resolve, reject) {
        await axios({
            method: "get",
            url: process.env.URL_DOWNLOAD_MINIO,
            params: {
                file_name: nameFile,
                bucket: process.env.BUCKET_MINIO,
                expiry: 0
            },
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN_DOWNLOAD_MINIO,
                'Accept': 'application/json',
                'x-api-key': process.env.SECRET_KEY_URL_MINIO,
                'x-access-key': process.env.ACCESS_KEY_MINIO,
                'x-secret-minio': process.env.SECRET_KEY_MINIO
            }
        })
            .then(async (res_get) => {
                await axios({
                    method: "get",
                    url: res_get.data.data.url_file,
                    responseType: 'stream'
                })
                .then(async (response) => {
                    const writer = fs.createWriteStream(localFilePath);
                    response.data.pipe(writer);
        
                    writer.on('finish', () => resolve());
                    writer.on('error', reject);
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

async function deleteFiles(fileList, _dir) {
    const sftp = new sftpClient();
    const uid = new ShortUniqueId({ length: 10 });
    let _tempName = [];

    return new Promise(function (resolve, reject) {
        sftp
            .connect(sftpConfig)
            .then(() => {
                return Promise.all(
                    fileList.map((args) => {
                        return sftp.delete(_dir + args.filename);
                    })
                );
            })
            .then(() => sftp.end())
            .then(resolve)
            .catch(reject);
    });
};

async function moveToDeleted(fileList, _dir) {
    const sftp = new sftpClient();
    const uid = new ShortUniqueId({ length: 10 });
    let _tempName = [];

    return new Promise(function (resolve, reject) {
        sftp
            .connect(sftpConfig)
            .then(() => {
                return Promise.all(
                    fileList.map((args) => {
                        return sftp.rcopy(args.path, '/deleted/' + args.filename);
                    })
                );
            })
            .then(() => {
                return Promise.all(
                    fileList.map((x, key) => {
                        return new initModels(sequelize).file_master.update({
                            path: '/deleted/' + x.filename
                        }, {
                            where: {
                                id_plt: x.id_plt
                            }
                        });
                    })
                );
            })
            .then(() => sftp.end())
            .then(resolve)
            .catch(reject);
    });
}