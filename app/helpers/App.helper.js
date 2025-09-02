const ShortUniqueId = require('short-unique-id');

// Create an instance of ShortUniqueId
const uid = new ShortUniqueId({ length: 10, uppercase: true, dictionary: 'number' });

module.exports = {
    filterObj,
    defineLevel,
    getPagination,
    generateTrackingNumber,
    multipleOrderBySql,
    orderBySql
};

function orderBySql(field, reverse) {
    reverse = !reverse ? 'ASC' : 'DESC';

    return [[field, reverse]];
}

function multipleOrderBySql(order_by, order_type) {
    let order = [];

    if (order_by !== undefined && order_by !== '' &&
        order_type !== undefined && order_type !== '') {
        // Mendapatkan daftar nilai order_by dan order_type dari URL
        const order_by_values = Array.isArray(order_by) ? order_by : [order_by];
        const order_type_values = Array.isArray(order_type) ? order_type : [order_type];

        // Mengambil jumlah maksimum order_by yang akan diambil
        const maxOrders = Math.min(order_by_values.length, order_type_values.length);

        for (let i = 0; i < maxOrders; i++) {
            order.push(orderBySql(order_by_values[i], order_type_values[i] === 'desc' ? true : false));
        }
    }
    return order;
}


/**
 * @param {int} page
 * @param {int} size
 * @param {bool} isPagination
 * @returns {int, int}
 */
function getPagination(page, size, isPagination) {
    const limit = size ? +size : 10000000000;
    const offset = page == 0 ? 0 : page ? (page - 1) * limit : 0;

    return { limit, offset };
};

/**
 * @param {Object} objKu
 * @param {Array} filter
 * @returns string
 */
function filterObj(objKu, filter = []) {
    return Object.keys(objKu)
        .filter(key => filter.includes(key))
        .reduce((obj, key) => {
            obj[key] = objKu[key];
            return obj;
        }, {});
}


/**
 * @param {int} level
 * @returns string
 */
function defineLevel(level) {
    switch (level) {
        case 0:
            return "Admin";
        case 1:
            return "KCD";
        case 2:
            return "Bidang";
        case 3:
            return "Kepegum";
        case 4:
            return "Disdik";
        default:
            return "Attended Access!";
    }
}

/**
 * @param {string} isFor
 * @returns string
 */
function generateTrackingNumber(isFor = 'PLT') {
    // Generate a unique ID using the ShortUniqueId package
    const uniqueId = uid.rnd();
    const trackingNumber = `${isFor}-${uniqueId}`;
  
    return trackingNumber;
}