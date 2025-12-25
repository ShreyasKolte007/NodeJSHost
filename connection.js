var mysql2 = require("mysql2");
var util = require("util");

var connection = mysql2.createConnection({
    host:"ba1oy1au6gmhk2dvkffs-mysql.services.clever-cloud.com",
    user:"uuxnoj8u5wkzoomm",
    password:"C0w4cKyKRCyRGApxF5dz",
    database:"ba1oy1au6gmhk2dvkffs"
})

const exe = util.promisify(connection.query).bind(connection);

module.exports = exe;