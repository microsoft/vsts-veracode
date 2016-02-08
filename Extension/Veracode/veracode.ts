import tl = require('vsts-task-lib/task');
import path = require('path');

var onError = function(errMsg) {
    tl.error(errMsg);
    tl.exit(1);
}

var filepath = tl.getInput('filepath', true);
tl.debug('filepath: ' + filepath);

var veracodeAppProfile = tl.getInput('veracodeAppProfile', true);
tl.debug('veracodeAppProfile: ' + veracodeAppProfile);

var createProfile = tl.getInput('createProfile', true);
tl.debug('createProfile: ' + createProfile);

var username = tl.getInput('username', true);
tl.debug('username: ' + username);

var password = tl.getInput('password', true);

var version = tl.getInput('version', true);
tl.debug('version: ' + version);

var sandboxId = tl.getInput('sandboxId', false);
tl.debug('sandboxId: ' + sandboxId);

var optArgs = tl.getDelimitedInput('optargs', ' ', false);
tl.debug('optArgs: ' + optArgs);

var javaPath = tl.which('java');
if (!javaPath) {
   onError('java is not found in the path') 
}

var java = tl.createToolRunner('java');

var veracodeAPIWrapper = path.join(__dirname, "VeracodeJavaAPI.jar");

// Matching success message as Java API Wrapper always return exit code 0
var success = false;
var successMsgAutoscanTrue = "will be automatically submitted for scanning";
var successMsgAutoscanFalse = "successfully submitted for scanning";

var isDefined = function(data) {
	return data != 'undefined' && data != null; 
}

var successMsgIndex = function(msg) {
	var converted = msg.toString('binary');
    return Math.max(converted.indexOf(successMsgAutoscanTrue), 
		converted.indexOf(successMsgAutoscanFalse));
}

java.arg('-jar');
java.arg(veracodeAPIWrapper);

java.arg('-action');
java.arg('UploadAndScan');

java.arg('-appname');
java.arg(veracodeAppProfile);

java.arg('-createprofile');
java.arg(createProfile);

java.arg('-filepath');
java.arg(filepath);

java.arg('-version');
java.arg(version);

java.arg('-vuser');
java.arg(username);

java.arg('-vpassword');
java.arg(password);

if (sandboxId) {
    java.arg('-sandboxid');
    java.arg(sandboxId);
}

// any explicit arguments specifid by user
java.arg(optArgs);

java.on('stdout', function (data) {
	if (isDefined(data)) {
		success = successMsgIndex(data) > 0;
	}
});

java.exec()
.then(function(code) {
	tl.debug("code: "+code);
	if (success) {
		tl.exit(0);
	} else {
		onError("Veracode upload and scan failed.");
	}
})
.fail(function(err) {
	onError("Veracode upload and scan failed.");
}) 
