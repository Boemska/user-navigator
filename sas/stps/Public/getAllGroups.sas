

filename response temp;
/* get list of libraries */
options noquotelenmax;
proc metadata in= '<GetMetadataObjects>
 <Reposid>$METAREPOSITORY</Reposid>
 <Type>IdentityGroup</Type>
 <NS>SAS</NS>
 <Flags>388</Flags>
 <Options>
 <Templates>
 <IdentityGroup Name="" Desc="" PublicType=""/>
 </Templates>
 <XMLSelect search="@PublicType=''UserGroup''"/>
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
  put "<TABLE-PATH syntax='XPath'>/GetMetadataObjects/Objects/IdentityGroup</TABLE-PATH>";
  put '<COLUMN name="groupuri">';
  put "<PATH syntax='XPath'>/GetMetadataObjects/Objects/IdentityGroup/@Id</PATH>";
  put "<TYPE>character</TYPE><DATATYPE>string</DATATYPE><LENGTH>32</LENGTH>";
  put '</COLUMN><COLUMN name="groupname">';
  put "<PATH syntax='XPath'>/GetMetadataObjects/Objects/IdentityGroup/@Name</PATH>";
  put "<TYPE>character</TYPE><DATATYPE>string</DATATYPE><LENGTH>256</LENGTH>";
  put '</COLUMN><COLUMN name="groupdesc">';
  put "<PATH syntax='XPath'>/GetMetadataObjects/Objects/IdentityGroup/@Desc</PATH>";
  put "<TYPE>character</TYPE><DATATYPE>string</DATATYPE><LENGTH>500</LENGTH>";
  put '</COLUMN></TABLE></SXLEMAP>';
run;
libname _XML_ xml xmlfileref=response xmlmap=sxlemap;

proc sort data= _XML_.SASObjects out=sasgroups;
  by groupname;
run;

%bafheader;
    %bafOutDataset(sasGroups, work, sasGroups);
%bafFooter;