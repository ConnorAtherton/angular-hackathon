var api = {

  createSecurityGroup: function (ec2, callback) {
    var params = {
      Description: 'Bitnamo shared security group',
      GroupName: 'Bitnamo-security-group'
    };

    ec2.createSecurityGroup(params, function (err, data) {
      if (err) {
        return err.code === 'InvalidGroup.Duplicate' ?
          callback(null, null, params.GroupName) : callback(err, null, null);
      }

      console.log('Data returned from createSecurityGroup', data);

      api.addSecurityRules(ec2, data.GroupId, function (err, securityGroupId) {
        if (err) return callback(err, null, null);
        return callback(null, securityGroupId, null);
      });
    });
  },

  addSecurityRules: function (ec2, securityGroupId, callback) {
    console.log('Adding security rules to ', securityGroupId);

    //
    // Need to set IP permission on the group, or the server
    // won't respond to any request. Just add SSH and HTTP
    // for now.
    //
    var params = {
      GroupId: securityGroupId,
      IpPermissions: [{
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{
          CidrIp: "0.0.0.0/0"
        }]
      }, {
        IpProtocol: "tcp",
        FromPort: 80,
        ToPort: 80,
        IpRanges: [{
          CidrIp: "0.0.0.0/0"
        }]
      }]
    };

    ec2.authorizeSecurityGroupIngress(params, function (err, data) {
      if (err) return callback(err, null);
      return callback(null, securityGroupId);
    });
  }

}

module.exports = api;
