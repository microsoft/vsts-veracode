# vsts-veracode
Veracode security scanning build extension for Visual Studio Team Services

## Prerequisite:

1. Please manually download Veracode JAVA API Client, name it `VeracodeJavaAPI.jar`, and save it in `Extension/Veracode` folder.  
1. Please update the `publisher` field in `Extension/extension-manifest.json` file
1. This package requires `node` and `npm`

## To compile, please run:
1. npm update
1. gulp

The vsix package will be produced in `_package`, and it can be uploaded to Visual Studio Team Services market place for sharing. 
