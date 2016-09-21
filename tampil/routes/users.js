var express = require('express');
var router = express.Router();

/* 
*GET studentlist. 
*/
router.get('/studentlist',function(req, res) {
	var db = req.db;
	db.collection('studentcollection').find().toArray(function(err, items) {
		res.json(items);
	});
});

/*
 * POST to addstudent.
 */
router.post('/addstudent', function(req, res) {
    var db = req.db;
    db.collection('studentcollection').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
* POST to updatestudent.
*/
router.put('/updatestudent', function(req, res, next) {
    var db = req.db;
    var studentToUpdate=req.params.id;
    db.collection('studentcollection').update({id:studentToUpdate},req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
* DELETE to deletestudent.
*/
router.delete('/deletestudent/:id', function(req, res) {
    var db = req.db;
    var studentToDelete = req.params.id;
    db.collection('studentcollection').removeById(studentToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
