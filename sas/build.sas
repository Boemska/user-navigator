/**
  @file
  @brief Creates the SPK for user navigator
  @details Takes source code and updates the (existing) STPs for usernavigator.
    The STPs are always registered first with AppFactory for unit testing,
    then updated using this build script.  Contributors can import an existing
    SPK and then run this script (with the appropriate LOC_XXX params).

  Dependencies:
   - macrocore library
   - X CMD enabled
   - WM permissions on meta folder target

  @param loc_swa location of connection profile for export tool
  @param loc_deploy location in metadata to which to deploy the generated SPK.
    This is used to verify that the SPK was correctly generated.

  @version 9.4
  @author Allan Bowe
  @copyright GNU GENERAL PUBLIC LICENSE v3

**/


/* params */
%let loc_repo=/pub/apps/user-navigator; /* source code */
%let loc_meta=/Apps/UserNavigator; /* metadata location for the built SPK */
%let loc_h54=/pub/apps/user-navigator/sas/h54snew.sas; /* h54s adapter loc */
%let loc_build=/pub/builds/usernav; /* physical location for build artefacts */
%let loc_core=/pub/programs/macrocore; /* location of macrocore library */
%let loc_swa=~/.SASAppData/MetadataServerProfiles/apps.swa;
%let loc_deploy=/Tests/UserNavigator;

/*
  macro from core library
  https://github.com/Boemska/macrocore/blob/master/meta/mm_updatestpsourcecode.sas
*/
options insert=(sasautos=("&loc_core/base"));
options insert=(sasautos=("&loc_core/meta"));

%let uid=%mf_uid();
%let build_dir=&loc_build/&uid;
%let deploy_dir=&loc_deploy/&uid;

%mf_mkdir(&build_dir);

proc printto log="&build_dir/sasbuild.log";
run;

options noquotelenmax;

%macro add_file(src=,stp=,h54=);
  filename source temp;
  /* first - add adapter */
  data _null_;
    file source;
    if _n_=1 then put '/** Begin Adapter code **/';
    infile "&h54" end=eof;
    input;  put _infile_;
    if eof then do;
      put '%bafgetdatasets;';
      put '/***  End Adapter Code ***/';
    end;
  run;

  /* now - add source code */
  data _null_;
    file source mod;
    if _n_=1 then do;
      put '/** Begin source file Code **/';
    end;
    infile "&src" end=eof;
    input;  put _infile_;
    if eof then do;
      put '/***  End source file Code ***/';
    end;
  run;

  /* now update the actual stp */
  %mm_updatestpsourcecode(stp=&stp,stpcode=source, mdebug=1)

%mend;

%add_file(src=&loc_repo/sas/stps/Public/getAllGroups.sas
  ,stp=&loc_meta/Public/getAllGroups
  ,h54=&loc_h54)

%add_file(src=&loc_repo/sas/stps/Public/getAllMembers.sas
  ,stp=&loc_meta/Public/getAllMembers
  ,h54=&loc_h54)

%add_file(src=&loc_repo/sas/stps/Public/getAllRoles.sas
  ,stp=&loc_meta/Public/getAllRoles
  ,h54=&loc_h54)

%add_file(src=&loc_repo/sas/stps/Public/getGroupsByMember.sas
  ,stp=&loc_meta/Public/getGroupsByMember
  ,h54=&loc_h54)

%add_file(src=&loc_repo/sas/stps/Public/getMembersByGroup.sas
  ,stp=&loc_meta/Public/getMembersByGroup
  ,h54=&loc_h54)

%add_file(src=&loc_repo/sas/stps/Public/getMembersByRole.sas
  ,stp=&loc_meta/Public/getMembersByRole
  ,h54=&loc_h54)


/**
 * Now export the SPK
 */

ods package(ProdOutput) open nopf;
options notes source2 mprint;


data _null_;
  call symputx('host',getoption('metaserver'));
  call symputx('port',getoption('metaport'));
  call symputx('user',getoption('metauser'));
  call symputx('pass',getoption('metapass'));
  length init $200;
  if "&sysscp"="WIN" then do;
    init='C: & ';
    dlm='&';
  end;
  else do;
    init=" ";
    dlm=';';
  end;
  call symputx('init',init);
  call symputx('dlm',dlm);
run;
%put &=host &=port &=user &=pass;

/* get location of BatchExport metadata tool */
data _null_;
   h="%sysget(SASROOT)";
   h2=substr(h,1,index(h,"SASFoundation")-2);
   call symputx("platform_object_path"
    ,cats(h2,"/SASPlatformObjectFramework/&sysver"));
run;
%put Batch tool located at: &platform_object_path;

%let connx_string= -host &host -port &port -user &user -password ""&pass"";

%let connx_string= -profile &loc_swa;

data _null_;
  infile "&init cd ""&platform_object_path"" %trim(
    ) &dlm ./ExportPackage &connx_string -disableX11 %trim(
    )-package ""&build_dir/import.spk"" %trim(
    )-objects ""&loc_meta(Folder)"" %trim(
    )-types ""StoredProcess"" %trim(
    )-log ""&build_dir/spkexport.log"" 2>&1"
    pipe lrecl=10000;
  input;
  list;
run;


/**
 * We now have a generated SPK, lets deploy it to make sure it works ok
 */

/* first, make folder */
data _null_;
  infile "&init cd ""&platform_object_path/tools"" %trim(
    ) &dlm ./sas-make-folder &connx_string  %trim(
    ) ""&deploy_dir"" -makeFullPath 2>&1"
    pipe lrecl=10000;
  input;
  list;
run;

/* now, import to that folder */
data _null_;
  infile "&init cd ""&platform_object_path"" %trim(
    ) &dlm ./ImportPackage &connx_string -disableX11 %trim(
    )-package ""&build_dir/import.spk"" %trim(
    )-target ""&deploy_dir(Folder)"" %trim(
    )-log ""&build_dir/spkimport.log"" 2>&1"
    pipe lrecl=10000;
  input;
  list;
run;

/* create the config file for web frontend */
data _null_;
  file "&build_dir/h54sConfig.json";
  string='{"metadataRoot":"'!!"&deploy_dir"!!'/UserNavigator"}';
  put string;
run;


/* show log */
proc printto log=log;
run;

data _null_;
  infile "&build_dir/sasbuild.log";
  input;
  putlog _infile_;
run;

data _null_;
  infile "&build_dir/spkexport.log";
  input;
  putlog _infile_;
run;


/*
filename response temp;
options noquotelenmax;
proc metadata in= "<GetMetadata>
 <Reposid>$METAREPOSITORY</Reposid>
 <Metadata><ClassifierMap id=""@Id='&stpid'""</Metadata>
 <NS>SAS</NS>
 <Flags>2</Flags>
 <Options>
 <XMLSelect search=""@Id='&stpid'""/>
 </Options>
 </GetMetadata>"
  out=response;
run; */