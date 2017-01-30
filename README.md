# lulo SES Identity

lulo SES Identity manages [AWS SES Identities](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/sending-authorization-overview.html).

lulo SES Identity is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
$ npm install lulo-plugin-ses-identity-policy --save
```

## Usage
### Properties
* Identity: Required. The identity the policy applies to. Either the name or the ARN.
* Policy: Required. The policy, JSON format.
* PolicyName: Required. Name of the policy. 

See the [AWS SDK Documentation for SES::putIdentityPolicy](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#putIdentityPolicy-property) for further details.

### Return Values

N/A

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "ses:DeleteIdentityPolicy",
       "ses:PutIdentityPolicy"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
