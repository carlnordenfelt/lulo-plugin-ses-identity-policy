'use strict';

var aws = require('aws-sdk');
var ses = new aws.SES({ apiVersion: '2010-12-01'});

var pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.Identity) {
        throw new Error('Missing required property Identity');
    }
    if (!event.ResourceProperties.Policy) {
        throw new Error('Missing required property Policy');
    }
    if (!event.ResourceProperties.PolicyName) {
        throw new Error('Missing required property PolicyName');
    }
};

pub.create = function (event, _context, callback) {
    var params = event.ResourceProperties;
    delete params.ServiceToken;
    ses.putIdentityPolicy(params, function (error) {
        return callback(error);
    });
};

pub.update = function (event, context, callback) {
    pub.create(event, context, callback);
};

pub.delete = function (event, _context, callback) {
    var params = event.ResourceProperties;
    delete params.ServiceToken;
    delete params.Policy;
    ses.deleteIdentityPolicy(params, function(error) {
        return callback(error);
    });
};

module.exports = pub;
