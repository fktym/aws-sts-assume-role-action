const {STS} = require('aws-sdk');
const core = require('@actions/core');

const assumeRole = async () => {
  try {
    console.log("Start Assume Role")
    const accessKeyId = core.getInput('access-key-id');
    const secretAccessKey = core.getInput('secret-access-key');
    const roleArn = core.getInput('role-arn');
    const externalId = core.getInput('external-id')
    const durationSeconds = core.getInput('duration-seconds');
    const sessionName = core.getInput('session-name');

    const sts = new STS({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const res = await sts.assumeRole({
      RoleArn: roleArn,
      ExternalId: externalId,
      DurationSeconds: durationSeconds,
      RoleSessionName: sessionName,
    }).promise()

    const credentials = res.Credentials
    core.exportVariable('AWS_ACCESS_KEY_ID', credentials.AccessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY', credentials.SecretAccessKey);
    core.exportVariable('AWS_SESSION_TOKEN', credentials.SessionToken);
  } catch (error) {
    core.error(error);
    throw new Error(error);
  }
}

const main = async () => {
  try {
    await assumeRole();
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
