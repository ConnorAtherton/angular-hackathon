var AWS = require('aws-sdk');
var _ = require('lodash');
var Key = require('./bitnami/Key');
var SecurityGroup = require('./bitnami/SecurityGroup');
var ec2;
var globalUser;
var globalOptions;

var init = function (user, options) {
  globalUser = user;
  globalOptions = options;
  var account = user.accounts[0];
  console.log('Intiing in bitnami');

  // var keys = getUserKeys(user);
  if (account === undefined ||
     !(account.accessKey && account.secretAccessKey)) {
    return 'error';
  }

  AWS.config.update({
    accessKeyId: user.accounts[0].accessKey,
    secretAccessKey: user.accounts[0].secretAccessKey,
    region: 'us-east-1', // TODO - Make this configurable
    maxRetries: '15'
  });

  // these instances will be shared by all methods
  ec2 = new AWS.EC2();
}

function launchInstanceSetup (callback) {
  console.log('Launch Instance Setup');
  // use groupId for a newly created security group
  // or group name if the group has already been created.
  SecurityGroup.createSecurityGroup(ec2, function (err, groupId, groupName) {
    if (err) return console.log(err);
    console.log('Using this security group to launch server - ', groupId, groupName);
    Key.createKeyPair(ec2, globalUser, function (err, keyName) {
      if(err) return callback(err, null);
      launchInstance(groupId, groupName, keyName, function (err, instanceId) {
        if (err) return console.log(err);
        return callback(null, instanceId);
      });
    });
  });
}

function launchInstance(groupId, groupName, keyName, callback) {
  console.log('Security Group data: ', (groupId || groupName));

  var params = {
    ImageId: 'ami-d5556dbc',
    InstanceType: 't1.micro',
    MinCount: 1,
    MaxCount: 1,
    Monitoring: {
      Enabled: true
    },
    KeyName: keyName
  };

  if(groupName) {
    params.SecurityGroups = [groupName];
  } else {
    params.SecurityGroupIds = [groupId];
  }

  ec2.runInstances(params, function(err, data) {
    console.log('launching the instance now...');
    if (err) return callback(err, null);
    console.log("Created instance ", data.Instances[0].InstanceId);
    // Now we need to add a tag so we can display the
    // server name on the console page
    createNameTag(data.Instances[0].InstanceId, function (err, success) {
      if (err) return callback(err, null);
      return callback(null, data.Instances[0].InstanceId);
    });
  });
}

function createNameTag(instanceId, callback) {
  var params = {
    Resources : [
      instanceId
    ],
    Tags: [{
      Key: 'BitnamoDemoName',
      Value: globalOptions.name
    }]
  }

  ec2.createTags(params, function (err, success) {
    if (err) return callback(err, null);
    return callback(null, success);
  });
}

// function stopInstance(instanceId, callback) {

//   var params = {
//     InstanceIds: [instanceId],
//   };

//   ec2.stopInstances(params, function (err, data) {
//     if (err) {
//       return callback(err, null);
//     } else {
//       return callback(null, data);
//     };
//   });
// }

// function checkInstanceStatus(instanceId, callback) {

//   var params = {
//     InstanceIds: [instanceId],
//   };

//   ec2.describeInstanceStatus(params, function(err, data) {
//     if (err) {
//       return callback(err, null);
//     } else {
//       return callback(null, data);
//     };
//   });
// };

// function getPublicDNS(instanceId, callback) {
//   console.log('Getting the public DNS for ', instanceId);

//   var params = {
//     InstanceIds: [instanceId],
//   };

//   ec2.describeInstances(params, function(err, data) {
//     if (err) {
//       return callback(err, null);
//     } else {
//       return callback(null, data);
//     };
//   });
// }

function getAllInstances(callback) {
  ec2.describeInstances({}, function (err, res) {
    if (err) return callback(err, null);
    return callback(null, transformInstances(res.Reservations));
  });
}

function transformInstances(originalFormat) {
  return _.pluck(originalFormat, 'Instances')
    .map(function(array) { return array[0]; })
    .map(function(obj) {
      var tag = _.filter(obj.Tags, function (obj) {
        return obj.Key = 'BitnamoDemoName';
      });
      tag = tag.length > 0 ? tag[0].Value : ' no name yet ';
      obj.InstanceName = tag;
      return obj;
    });
}


exports.init = init;
exports.launchInstance = launchInstanceSetup;
exports.getAllInstances = getAllInstances;
// exports.stopInstance = stopInstance;
// exports.checkInstanceStatus = checkInstanceStatus;
// exports.getPublicDNS = getPublicDNS;
