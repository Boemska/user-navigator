
data sasMembers sasgroups;
  attrib uriGrp uriMem roleId roleName Group_or_Role MemberName MemberType MemberUpdated membercreated emailuri length=$64
    roleDesc     email      length=$256
    rcGrp rcMem rc i j  length=3;
  call missing (of _all_);
  drop uriGrp uriMem rcGrp rcMem rc i j;
  set iwant;
  i=1;
  * Grab the URI for the first Group ;
  rcGrp=metadata_getnobj(roleid,i,uriGrp);

  * If Group found, enter do loop ;
  if rcGrp>0 then do;
    call missing (rcMem,uriMem,roleId,roleName,Group_or_Role
      ,MemberName,MemberType,roleDesc);
    * get group info ;
    rc = metadata_getattr(uriGrp,"Id",roleId);
    rc = metadata_getattr(uriGrp,"Name",roleName);
    rc = metadata_getattr(uriGrp,"PublicType",Group_or_Role);
    rc = metadata_getattr(uriGrp,"Desc",roleDesc);
    j=1;
    if Group_or_Role='Role' then do while
      (metadata_getnasn(uriGrp,"MemberIdentities",j,uriMem) > 0);
      call missing (MemberName,MemberType);
      call missing(email,emailuri);
      rc = metadata_getattr(uriMem,"Name",MemberName);
      rc = metadata_getattr(uriMem,"PublicType",MemberType);
      rc=metadata_getattr(uriMem, "MetadataCreated", MemberCreated);
      rc=metadata_getattr(uriMem, "MetadataUpdated", MemberUpdated);
      emailrc=metadata_getnasn(uriMem,"EmailAddresses",1,emailuri);
      if (emailrc>0) then rc=metadata_getattr(emailuri,"Address",email);
      if membertype='UserGroup' then output sasgroups;
      else output sasmembers;
      j+1;
    end;
  end;

  if _n_=1 then delete; /* no roles so don't send empty row */
  keep membertype membername MemberCreated MemberUpdated email;
run;

%bafheader;
    %bafOutDataset(sasGroups, work, sasGroups);
    %bafOutDataset(sasMembers, work, sasMembers);
%bafFooter;