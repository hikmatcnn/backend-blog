const { query, body, validationResult, param, header } = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'check_token': {
            return [
                body('token', 'token harus ada').notEmpty(),
            ]
        }
        case 'set_status_registrant': {
            return [
                body('id_registration', 'id_registration harus ada').notEmpty(),
                body('status', 'status harus ada').notEmpty().isIn(['fit', 'register', 'accepted', 'revoked', 'rejected']).withMessage('status harus fit / register / accepted / rejected'),
                body().custom((_val) => {
                    const status = _val.status;

                    if (status === 'rejected') {
                        if (!_val.status_reason) {
                            throw new Error('alasan tidak diterima harus ada');
                        }
                        if (_val.is_rejected !== true) {
                            throw new Error('is_rejected harus true');
                        }
                    }

                    return true;
                }),
            ]
        }
        case 'create_school_damaged': {
            return [
                body('school_name', 'school_name harus ada').notEmpty(),
                body('school_npsn', 'school_npsn harus ada').notEmpty(),
                body('school_address', 'school_address harus ada').notEmpty(),
                body('address_code', 'address_code harus ada').notEmpty(),
                body('school_province', 'school_province harus ada').notEmpty(),
                body('school_city', 'school_city harus ada').notEmpty(),
                body('school_district', 'school_district harus ada').notEmpty(),
                body('school_subdistrict', 'school_subdistrict harus ada').notEmpty(),
                // body('disaster_topic', 'disaster_topic harus ada').notEmpty(),
                body('disaster_description', 'disaster_description harus ada').notEmpty(),
            ]
        }
        case 'update_school_damaged': {
            return [
                body('id_disaster', 'id_disaster harus ada').notEmpty(),
                body('school_name', 'school_name harus ada').notEmpty(),
                body('school_npsn', 'school_npsn harus ada').notEmpty(),
                body('school_address', 'school_address harus ada').notEmpty(),
                body('address_code', 'address_code harus ada').notEmpty(),
                body('school_province', 'school_province harus ada').notEmpty(),
                body('school_city', 'school_city harus ada').notEmpty(),
                body('school_district', 'school_district harus ada').notEmpty(),
                body('school_subdistrict', 'school_subdistrict harus ada').notEmpty(),
                // body('disaster_topic', 'disaster_topic harus ada').notEmpty(),
                body('disaster_description', 'disaster_description harus ada').notEmpty(),
            ]
        }
        case 'update_school_verified': {
            return [
                body('id_disaster', 'id_disaster harus ada').notEmpty(),
                body('is_verified', 'is_verified harus ada').notEmpty().isBoolean().withMessage('is_verified harus true / false'),
            ]
        }
        case 'get_address_city': {
            return [
                query('code', 'code harus ada').notEmpty(),
            ]
        }
        case 'get_list_registrant': {
            return [
                query('target_school_npsn', 'target_school_npsn harus ada').notEmpty(),
            ]
        }
        case 'upload_file_school': {
            return [
                body('id_disaster', 'id_disaster harus ada').notEmpty(),
            ]
        }
        case 'download_file': {
            return [
                param('idFile', 'idFile harus ada').notEmpty(),
            ]
        }
        case 'get_detail_disaster': {
            return [
                param('idDisaster', 'idDisaster harus ada').notEmpty().isUUID().withMessage('harus UUID'),
            ]
        }
        case 'check_auth': {
            return [
                body('email_or_username', 'email harus diinput').notEmpty(),
                body('password', 'password harus diinput').notEmpty(),
            ]
        }
        
        case 'check_update': {
            return [
                body('email', 'username -or').optional(),
                body('password', 'password -or').notEmpty(),
                body('old_password', 'old_password -or').notEmpty(),
            ]
        }
    }
}

exports.checkFileAndSize = (req, res, next) => {
    const maxSize = 5 * 1024 * 1024; // Max 5MB

    try {
        if (!req.files) {
            res.status(422).json({
                errors: [{
                    msg: 'File harus diupload'
                }]
            })
            return;
        }
        if (req.files && Array.isArray(req.files.attachment)) {
            for (const file of req.files.attachment) {
                if (file.size > maxSize) {
                    return res.status(422).json({
                        errors: [{
                            msg: `Ukuran file ${file.originalname} tidak boleh melebihi 4MB.`
                        }]
                    });
                }
            }
        } else if (req.files && req.files.attachment && req.files.attachment.size > maxSize) {
            // Handle the case for single file uploads (if files aren't in an array)
            return res.status(422).json({
                errors: [{
                    msg: `Ukuran file tidak boleh melebihi 4MB.`
                }]
            });
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

exports.checkFileSize = (req, res, next) => {
    const maxSize = 4 * 1024 * 1024; // 4MB in bytes, adjust as needed

    try {
        if (!req.files) {
            res.status(422).json({
                errors: [{
                    msg: 'File harus diupload'
                }]
            })
            return;
        }
        if (req.files && Array.isArray(req.files.attachment)) {
            for (const file of req.files.attachment) {
                if (file.size > maxSize) {
                    return res.status(422).json({
                        errors: [{
                            msg: `Ukuran file ${file.originalname} tidak boleh melebihi 4MB.`
                        }]
                    });
                }
            }
        } else if (req.files && req.files.attachment && req.files.attachment.size > maxSize) {
            // Handle the case for single file uploads (if files aren't in an array)
            return res.status(422).json({
                errors: [{
                    msg: `Ukuran file tidak boleh melebihi 4MB.`
                }]
            });
        }
        return next();

    } catch (err) {
        return next(err);
    }
};

exports.closeRoute = (req, res, next) => {
    return res.status(403).json({
        message: 'Sudah Di Tutup!'
    });
}

exports.verify = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                errors: errors.array()
            })
            return;
        } else {
            return next();
        }
    } catch (err) {
        return next(err);
    }
}