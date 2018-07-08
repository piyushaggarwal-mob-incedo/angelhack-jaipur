#!/bin/sh
cd lambda
zip -r ../index.zip .
cd ..

export AWS_PROFILE=default
aws lambda update-function-code --function-name AngelHack --zip-file fileb://index.zip

echo $PWD

