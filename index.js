'use strict';

var AWS = require('aws-sdk');
var Promise = require('promise');

var actions = {
  start: function (ec2, instanceId) {
    return new Promise(function (resolve, reject) {
      var params = {
        InstanceIds: [instanceId],
        DryRun: false
      };
      ec2.startInstances(params, function(err, data) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  stop: function (ec2, instanceId) {
    return new Promise(function (resolve, reject) {
      var params = {
        InstanceIds: [instanceId],
        DryRun: false
      };
      ec2.stopInstances(params, function(err, data) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
};

function describe(ec2, instanceId) {
  return new Promise(function (resolve, reject) {
    var params = {
      DryRun: false,
      InstanceIds: [instanceId]
    };
    ec2.describeInstances(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      var ip = data.Reservations[0].Instances[0].PublicIpAddress;
      var desc = '';
      data.Reservations[0].Instances[0].Tags.forEach(function (tag) {
        desc = desc + ' ' + tag.Key + '=' + tag.Value + ' / ';
      });
      return resolve({ip: ip, description: desc});
    });
  });
}

exports.handler = function (event, context, callback) {
  var p = actions[event.action];
  if (!p) {
    return callback('unknown action');
  }
  var from = 'StartOrStop';
  var msgAction = event.action.toUpperCase() + ': ' + event.instanceId;
  var ec2 = new AWS.EC2();
  return describe(ec2, event.instanceId).then(function (data) {
    msgAction = msgAction + ' - ' + data.ip + ' - ' + data.description;
    console.log('[INFO]', 'Attempting', msgAction);
  }).then(function () {
    console.log('[INFO]', 'Done', msgAction);
    return p(ec2, event.instanceId);
  }).then(function () {
    return callback();
  }).catch(function (err) {
    console.log('[ERROR]', JSON.stringify(err));
    return callback(err);
  });
};
