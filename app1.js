/**
 * Created by blu on 8/17/15.
 */
var Promise = require("bluebird");
var couchbase = require("couchbase");

var cluster = new couchbase.Cluster('127.0.0.1:8091');

var bucket;
Promise.fromNode(function (callback) {
    bucket = cluster.openBucket('beer-sample', callback);
}).then(function () {
    bucket = Promise.promisifyAll(bucket);
    bucket.getAsync("aass_brewery-juleol").then(function (result) {
        var doc = result.value;
        console.log(doc.name + ', ABV: ' + doc.abv);
        console.log(doc.name + ', comment: ' + doc.comment);
        return result;
    }).then(function (result) {
        var doc = result.value;
        doc.comment = "Random beer from Norway" + new Date();

        return bucket.replaceAsync('aass_brewery-juleol', doc).then(function () {
            process.exit(0);
        });
    });
});
