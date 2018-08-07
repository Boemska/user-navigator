filename response temp;
/* get list of libraries */
proc metadata in= '<GetMetadataObjects>
 <Reposid>$METAREPOSITORY</Reposid>
 <Type>Person</Type>
 <NS>SAS</NS>
 <Flags>0</Flags>
 <Options>
 <Templates>
 <Person Name=""/>
 </Templates>
 </Options>
 </GetMetadataObjects>'
  out=response;
run;

/* write the response to the log for debugging
data _null_;
  infile response lrecl=1048576;
  input;
  put _infile_;
run;
*/

/* create an XML map to read the response */
filename sxlemap temp;
data _null_;
  file sxlemap;
  put '<SXLEMAP version="1.2" name="SASObjects"><TABLE name="SASObjects">';
  put "<TABLE-PATH syntax='XPath'>/GetMetadataObjects/Objects/Person</TABLE-PATH>";
  put '<COLUMN name="memberuri">';
  put "<PATH syntax='XPath'>/GetMetadataObjects/Objects/Person/@Id</PATH>";
  put "<TYPE>character</TYPE><DATATYPE>string</DATATYPE><LENGTH>32</LENGTH>";
  put '</COLUMN><COLUMN name="membername">';
  put "<PATH syntax='XPath'>/GetMetadataObjects/Objects/Person/@Name</PATH>";
  put "<TYPE>character</TYPE><DATATYPE>string</DATATYPE><LENGTH>256</LENGTH>";
  put '</COLUMN></TABLE></SXLEMAP>';
run;
libname _XML_ xml xmlfileref=response xmlmap=sxlemap;

proc sort data= _XML_.SASObjects out=sasmembers;
  by membername;
run;

%bafheader;
    %bafOutDataset(sasMembers, work, sasMembers);
%bafFooter;
