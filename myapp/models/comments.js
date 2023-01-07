const con = require('../config/mysqlconn.js');

module.exports = {
    setToBoardComment: function (comment) {
        return new Promise((resovle, reject) => {

            con.getConnection((err, con) => {

                if (err) console.log(new Error(err));
                else {
                    let sql1 = 'INSERT INTO comment VALUES ?';
                    let sql2 = 'INSERT INTO user VALUES ?'

                    sql1 = mysql.format(sql1, [comment]);
                    sql2 = mysql.format(sql2, [comment.comment_id]);

                    con.query(
                        sql1 + sql2, [coment], (err, result) => {
                            if (err) reject(new Error(err));
                            else resovle(result);
                        }
                    );

                }
            });

        });
    },

    // getByboardComment: (req,res) => {
        
    // },

};