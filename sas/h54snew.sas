/************************************************************************/
/*            Parser and Generator for v1 of the Adapter                */
/*                                                                      */
/************************************************************************/
* options mprint mlogic;
%global h54starget;
%macro checkEnvironment;
  * set this to whatever your test harness is configured to ;
  %let batchOutFile=__STDERR__;

  %if %sysevalf(&sysver<9.4) %then %do;
    /* need a better way to determine processmode for earlier SAS verions */
    /* https://stackoverflow.com/questions/48464813/determining-server-context-workspace-server-vs-stored-process-server */
    %global sysprocessmode;
    %if %symexist(_program) %then %let sysprocessmode=Stored Process Server;
    %else %let sysprocessmode = SAS Batch Mode;
  %end;

  %if (&sysprocessmode = SAS Batch Mode ) %then %do;
    %let h54starget=&batchOutFile.;
  %end;
  %else %do;
    %let h54starget=_WEBOUT;
  %end;
  %PUT h54s ==> TARGET is  &h54starget.;
%mend;

%checkEnvironment;

%macro bafGetDatasets;
  /*
  _WEBIN_NAME has the name of each parameter for the counterpart spec
  _WEBIN_FILE_COUNT has the total number of files. If 1 then we need no suffix
  */
  %if %symexist(_webin_file_count) = 0 %then %do;
    %return;
  %end;

  %put h54s ==> WEBIN FILE COUNT IS &_WEBIN_FILE_COUNT.;

  /*
  bafpn is the index of a file described as FILE
  bafxn is the index of a file described as XML
  global vars initialised
  */
  %global bafpn;
  %global bafxn;
  %let bafpn=;
  %let bafxn=;

  /* baftn is the index of the file (table) being iterated over */
  %do files = 1 %to &_WEBIN_FILE_COUNT;
    %if &_WEBIN_FILE_COUNT = 1 %then %let baftn=;
    %else %do;
      %let baftn=&files.;
    %end;

    /* references to file and spec */
    %let thisobj=&&_WEBIN_name&baftn;
    %let testspec=&&&&&&_WEBIN_name&baftn.;

    %put h54s ==> Evaluating filename &&&&_WEBIN_name&baftn;
    /* if a spec comes back as a FILE then it is not a table */
    %if (%UPCASE("&&&&&&_WEBIN_name&baftn.") eq "FILE") %then %do;
      %if (%UPCASE("&&&&_WEBIN_name&baftn.") eq "MYFILE") %then %do;
        %let bafpn=&baftn.;
        %put Found MYFILE (program) as input number &baftn.;
      %end;
      %else %if (%UPCASE("&&&&_WEBIN_name&baftn.") eq "XML") %then %do;
        %let bafxn=&baftn.;
        %put Found XML (meta query) as input number &baftn.;
      %end;
    %end;
    %else %do;

      /* build data step length and input statements for this input table */
      data _null_;
        length spec $32767;
        length lendef $50;
        length lenspec $50;
        length varname $32;
        spec=symget(symget(cats("_WEBIN_NAME","&baftn.")));
        colcount=countw(spec, '|');

        do c=1 to colcount;
          lenspec=scan(spec, c, '|');
          varname=upcase(scan(lenspec,1,','));
          select (scan(lenspec, 2, ','));
              when ('num') do;
                * lendef=cat(varname, ' 8.');
                indef=varname!!':best16.';
              end;
              when ('string') do;
                * lendef=cat(varname, " $", scan(lenspec, 3, ','));
                indef=cats(varname,':$',scan(lenspec, 3, ','),'.');
              end;
          end;


          * length statement specification here ;
          lname=cats('lens', c);
          * call symputx(lname, lendef, 'L');

          * input statement specification here ;

          pname=cats('cols', c);
          call symputx(pname, indef, 'L');
          output;
        end;
        call symputx('totalcol', colcount);
      run;

      /* parse the actual input data */

  %put h54s ==> === START DESERIALISING TABLE &&_WEBIN_name&baftn. === ;
      data "&&_WEBIN_name&baftn."n;
        INFILE &&_WEBIN_FILEREF&baftn. LRECL=32767 recfm=v dsd;
        /*length %do j=1 %to &totalcol.;
        &&lens&j.
        %end;*/
        ;
        input %do j=1 %to &totalcol.;
        &&cols&j.
        %end;
        ;
      run;
  %put h54s ==> === FINISH DESERIALISING TABLE &&_WEBIN_name&baftn. === ;

    %end;
  %end;

  %put h54s ==> === SUMMARY OF DESERIALISED INPUT TABLES === ;
    proc sql noprint;
    %do files = 1 %to &_WEBIN_FILE_COUNT;
      %if &_WEBIN_FILE_COUNT = 1 %then %let baftn=;
      %else %let baftn=&files.;
      %if &baftn ne &bafpn and &baftn ne &bafxn %then %do;
        describe table "&&_WEBIN_name&baftn."n;
      %end;
    %end;
    %put h54s ==> === END SUMMARY ===;
    quit;

%mend;

%macro bafOutDataset(outputas, outlib, outdsn);

  data _null_;
    file _webout;
    put '"' "&outputas." '" : ';
  run;
  options validvarname=upcase;
  proc json out=_webout pretty;
    export &outlib..&outdsn. /  nosastags;
  run;

  data _null_;
    file _webout;
    put ',';
  run;
%mend;

%macro bafOutSingleMacro(objectName,singleValue);
* keep quiet in the log;
  %hfsQuietenDown;
* Note: Use this with care, not best practice. Not quoted, so always quote string JS variables.
        It is risky outputting macro vars raw. I personally would not do it.
;
  data _null_;
    file &h54starget.;
    put '"' "&objectName." '" : "' "&singleValue." '",' ;
  run;
* Come back ;
%hfsQuietenUp;
%mend;

%macro bafHeader();

  data _null_;
    file &h54starget.;
    * uncomment these if working with v8 SAS/IntrNet broker ;
    *put "Content-type: text/html";
    *put;
    %if %symExist(_debug) %then %do;
      %if &_debug = 131 %then %do;
      put "--h54s-data-start--";
      %end;
    %end;
    put '{';
  run;
%mend;

%macro bafFooter();
  %if (%symexist(usermessage) = 0) %then %do;
    %let usermessage = blank;
  %end;

  %if (%symexist(logmessage) = 0) %then %do;
    %let logmessage = blank;
  %end;

  %if (%symexist(h54src) = 0) %then %do;
    %let h54src = success;
  %end;

  data _null_;
    file &h54starget.;
    sasdatetime=round(datetime(),1);
    put '"usermessage" : "' "&usermessage." '",';
    put '"logmessage" : "' "&logmessage." '",';
    put '"requestingUser" : "' "&_metauser." '",';
    put '"requestingPerson" : "' "&_metaperson." '",';
    put '"executingPid" : ' "&sysjobid." ',';
    put '"sasDatetime" : ' sasdatetime ',';
    put '"status" : "' "&h54src." '"}';
    put ;
  run;
  %if %symExist(_debug) %then %do;
    %if &_debug = 131 %then %do;
      data _null_;
        file _webout;
        put "--h54s-data-end--";
      run;
      proc options ;run;
    %end;
  %end;
%mend;

%macro bafExecuteMetadata(fileref);

filename xmlmeta "%sysfunc(pathname(&fileref.))";
%put Assigned XMLMETA as "%sysfunc(pathname(&fileref.))";
data _null_;
  file _webout;
  %if %symExist(_debug) %then %do;
    %if &_debug = 131 %then %do;
      put "--h54s-xml-start--";
    %end;
  %end;
  put '<H54SXML>';
run;



%put filename listing: ;
filename _all_ list;

 proc metadata
   in=XMLMETA
   out=_webout
   ;
 run;

 filename xmlmeta clear;

data _null_;
  file _webout;
  put '</H54SXML>';
  %if %symExist(_debug) %then %do;
    %if &_debug = 131 %then %do;
      put "--h54s-xml-end--";
    %end;
  %end;
run;
%mend;
