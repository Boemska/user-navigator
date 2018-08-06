

data sasMembers ;
  attrib uriGrp uriMem GroupId GroupName Group_or_Role MemberName MemberType
    MemberUpdated membercreated emailuri length=$64
    GroupDesc   email        length=$256
    rcGrp rcMem rc i j  length=3;
  call missing (of _all_);
  drop uriGrp uriMem rcGrp rcMem rc i j;
  set iwant;
  i=1;
  * Grab the URI for the first Group ;
  rcGrp=metadata_getnobj(groupid,i,uriGrp);

  * If Group found, enter do loop ;
  if rcGrp>0 then do;
    call missing (rcMem,uriMem,GroupId,GroupName,Group_or_Role
      ,MemberName,MemberType);
    * get group info ;
    rc = metadata_getattr(uriGrp,"Id",GroupId);
    rc = metadata_getattr(uriGrp,"Name",GroupName);
    rc = metadata_getattr(uriGrp,"PublicType",Group_or_Role);
    rc = metadata_getattr(uriGrp,"Desc",GroupDesc);
    j=1;
    do while (metadata_getnasn(uriGrp,"MemberIdentities",j,uriMem) > 0);
      call missing (MemberName,MemberType);
      rc = metadata_getattr(uriMem,"Name",MemberName);
      rc = metadata_getattr(uriMem,"PublicType",MemberType);
      rc=metadata_getattr(uriMem, "MetadataCreated", MemberCreated);
      rc=metadata_getattr(uriMem, "MetadataUpdated", MemberUpdated);
      emailrc=metadata_getnasn(uriMem,"EmailAddresses",1,emailuri);
      if (emailrc>0) then rc=metadata_getattr(emailuri,"Address",email);
      output;
      j+1;
    call missing(email,emailuri);
    end;
  end;
  if _n_=1 then delete;
run;

%bafheader;
    %bafOutDataset(sasMembers, work, sasMembers);
%bafFooter;
