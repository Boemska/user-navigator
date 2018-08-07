#!/bin/bash
####################################################################
# PROJECT: User Naviator                                           #
####################################################################
WORKSPACE_ID="626f7f4b"
AUTHTOKEN="9471a807f8d54a76b"
FEATURE_BRANCH="master"
PROJECT_FOLDER="user-navigator"
BUILD_FOLDER="usernavigator_build"
GIT_PROJECT="git@github.com:Boemska/user-navigator.git"
SCRLOC="/tmp/usernavigator"
#GIT_BUILD="<link_to_git>"
####################################################################

cd $SCRLOC
rm -rf ./tmp
mkdir tmp

echo
echo  [ buildScript ]

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

# This is where we should run the SAS build and obtain the relevant
# h54s config file
cp $SCRLOC/tmp/$PROJECT_FOLDER/build/h54sConfig.json $SCRLOC/tmp/$PROJECT_FOLDER/dist/h54sConfig.json

echo ---------------------------------------------------------------
echo Copy build files across to build repo
echo ---------------------------------------------------------------
mkdir $SCRLOC/tmp/$BUILD_FOLDER
#git clone $GIT_BUILD $SCRLOC/tmp/$BUILD_FOLDER/
cd $SCRLOC/tmp/$BUILD_FOLDER/
find . -path ./.git -prune -o -exec rm -rf {} \; 2> /dev/null
cp -a $SCRLOC/tmp/$PROJECT_FOLDER/dist/. $SCRLOC/tmp/$BUILD_FOLDER/

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
echo Build - Boemska
echo ---------------------------------------------------------------
cd $SCRLOC/tmp/$PROJECT_FOLDER
rm -rf $SCRLOC/tmp/$PROJECT_FOLDER/dist/.
ng build --prod --aot --base-href /apps/repo/dev/$WORKSPACE_ID/
cp $SCRLOC/tmp/$PROJECT_FOLDER/build/boemska_h54sConfig.json ./dist/h54sConfig.json
cd ./dist

echo ---------------------------------------------------------------
echo Sending to Work-Space
echo ---------------------------------------------------------------
bap-sync --serverUrl https://apps.boemskats.com/apps/ --repoUrl repo/dev/ --workspaceID $WORKSPACE_ID --authToken $AUTHTOKEN --excludes node_modules
cd $SRCLOC

echo ---------------------------------------------------------------
echo Finish
echo ---------------------------------------------------------------
