#!/bin/bash
####################################################################
# PROJECT: User Naviator                                           #
####################################################################
WORKSPACE_ID="626f7f4b"
AUTHTOKEN="9471a807f8d54a76b"
FEATURE_BRANCH="master"
PROJECT_FOLDER="user-navigator_repo"
BUILD_FOLDER="usernavigator_clientbuild"
GIT_PROJECT="git@github.com:Boemska/user-navigator.git"
SCRLOC="/tmp/usernavigator"
BUILDSTP="/Apps/utilities/metadata/buildUserNavigator"
BUILDSERVER="https://apps.boemskats.com/SASStoredProcess/do"
#GIT_BUILD="<link_to_git>"
####################################################################
echo
echo  [ buildScript ]

# get SAS creds for running the build STP
echo -n What is your SAS username?
read USERNAME

echo -n What is your SAS password?
read PASSWORD

cd $SCRLOC
rm -rf ./tmp
mkdir tmp
cd tmp

echo ---------------------------------------------------------------
echo  Perform SAS Build
echo ---------------------------------------------------------------
# Build & deploy SAS services, downloading SPK and config file
curl -v -L -k -b cookiefile -c cookiefile \
  -d "_program=$BUILDSTP&_username=$USERNAME&_password=$PASSWORD" \
  $BUILDSERVER --output SAS.zip
unzip SAS.zip

# Copy SPK and config file to client build
mkdir $SCRLOC/tmp/$BUILD_FOLDER
mkdir $SCRLOC/tmp/$BUILD_FOLDER/sas
cp $SCRLOC/tmp/contents/import.spk $SCRLOC/tmp/$BUILD_FOLDER/sas


echo ---------------------------------------------------------------
echo  Git Clone
echo ---------------------------------------------------------------
git clone $GIT_PROJECT $SCRLOC/tmp/$PROJECT_FOLDER
cd $SCRLOC/tmp/$PROJECT_FOLDER
git checkout $FEATURE_BRANCH

echo ---------------------------------------------------------------
echo "NPM Install && Versioning"
echo ---------------------------------------------------------------
npm install

echo ---------------------------------------------------------------
echo Build repo
echo ---------------------------------------------------------------
ng build --prod --aot --base-href ./


echo ---------------------------------------------------------------
echo Copy build files across to client build repo
echo ---------------------------------------------------------------
mkdir $SCRLOC/tmp/$BUILD_FOLDER/web
#git clone $GIT_BUILD $SCRLOC/tmp/$BUILD_FOLDER/
cd $SCRLOC/tmp/$BUILD_FOLDER/web
cp -a $SCRLOC/tmp/$PROJECT_FOLDER/dist/. $SCRLOC/tmp/$BUILD_FOLDER/web
cp $SCRLOC/tmp/$PROJECT_FOLDER/build/h54sConfig.json \
    $SCRLOC/tmp/$BUILD_FOLDER/web/h54sConfig.json

echo ---------------------------------------------------------------
echo Deploy to Boemska test repo
echo ---------------------------------------------------------------

mkdir $SCRLOC/tmp/test
cp -a $SCRLOC/tmp/$PROJECT_FOLDER/dist/. $SCRLOC/tmp/test
cp $SCRLOC/tmp/contents//h54sConfig.json $SCRLOC/tmp/test/h54sConfig.json
rsync -avz --exclude .git/ --exclude .gitignore --del $SCRLOC/tmp/test/* \
    $USERNAME@apps.boemskats.com:/pub/ht/builds/usernavigator

#echo ---------------------------------------------------------------
#echo Git Commit - commit build files to build repo
#echo ---------------------------------------------------------------
#git add .
#echo Enter Commit Message:
#read MSG
#git commit -am"$MSG"
#git push
#cd ..
#rm -rf ./$BUILD_FOLDER

echo ---------------------------------------------------------------
echo Deploy to Boemska AppFactory with Developer friendly build
echo ---------------------------------------------------------------
cd $SCRLOC/tmp/$PROJECT_FOLDER
rm -rf $SCRLOC/tmp/$PROJECT_FOLDER/dist
ng build --prod --aot --base-href /apps/repo/dev/$WORKSPACE_ID/
cp $SCRLOC/tmp/$PROJECT_FOLDER/build/boemska_h54sConfig.json \
    ./dist/h54sConfig.json
cd ./dist

echo ---------------------------------------------------------------
echo Sending to Work-Space
echo ---------------------------------------------------------------
bap-sync --serverUrl https://apps.boemskats.com/apps/ --repoUrl repo/dev/ \
    --workspaceID $WORKSPACE_ID --authToken $AUTHTOKEN --excludes node_modules
cd $SRCLOC

echo ---------------------------------------------------------------
echo Finish
echo ---------------------------------------------------------------
