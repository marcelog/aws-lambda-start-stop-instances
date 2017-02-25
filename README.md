# About
This is the example code that goes with the article at [http://marcelog.github.io/articles/aws_lambda_start_stop_ec2_instance.html](http://marcelog.github.io/articles/aws_lambda_start_stop_ec2_instance.html).

This Lambda code is used to start and stop EC2 instances.

See the article mentioned above for the details.

Cheers :)

# Using it
```
$ npm install
$ zip -r ec2_start_stop.zip *
```

Read the article for the details.

```json
{
  "action": "start",
  "instanceId": "i-xxxx"
}
```

Action can be one of `stop` or `start`.

# License
The source code is released under Apache 2 License.

Check [LICENSE](https://github.com/marcelog/aws-lambda-start-stop-instances/blob/master/LICENSE) file for more information.
