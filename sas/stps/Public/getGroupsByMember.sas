data groups
    roles(rename=(groupuri=roleuri groupname=rolename groupdesc=roledesc)) ;
  length uri groupuri groupname groupdesc publictype str $256;
  call missing(of _all_);
  set iwant;
  str=cats("omsobj:Person?@Name='",username,"'");
  rc=metadata_getnobj(str,1,uri);
  if rc<=0 then do;
    putlog "WARNING: rc=" rc  username " not found "
    ", or there was an error reading the repository.";
    stop;
  end;


  a=1;
  grpassn=metadata_getnasn(uri,"IdentityGroups",a,groupuri);
  if grpassn in (-3,-4) then do;
    putlog "WARNING: No groups found for ";
  end;
  else do while (grpassn > 0);
    rc=metadata_getattr(groupuri, "Name", groupname);
    rc=metadata_getattr(groupuri, "Desc", groupdesc);
    rc=metadata_getattr(groupuri, "PublicType", PublicType);
    a+1;
    if PublicType = 'Role' then output roles;
    else output groups;
    grpassn=metadata_getnasn(uri,"IdentityGroups",a,groupuri);
  end;
  keep groupuri groupname groupdesc;
  if _n_=1 then delete; /* no content so don't send empty row */
run;

data emails;
  keep email type;
  length emailuri email type uri str $256;
  call missing(of _all_);
  set iwant;
  str=cats("omsobj:Person?@Name='",username,"'");
  rc=metadata_getnobj(str,1,uri);
  if rc<=0 then do;
    putlog "WARNING: rc=" rc  username " not found "
    ", or there was an error reading the repository.";
    putlog str= username=;
    stop;
  end;

  /* credit https://seleritysas.com/data-step-view-of-email-addresses-in-sas-metadata/ */
  emailrc=1;email_count=1;
  do while(emailrc>0);
    /* Get Email from Person */
    emailrc=metadata_getnasn(uri,"EmailAddresses",email_count,emailuri);
    arc=1;
    if (emailrc>0) then do;
      arc=metadata_getattr(emailuri,"Address",email);
      arc=metadata_getattr(emailuri,"EmailType",type);
    end;
    if (arc=0) then output emails;
    email_count=email_count+1;
  end;
run;

%bafheader;
    %bafOutDataset(emails, work, emails);
    %bafOutDataset(groups, work, groups);
    %bafOutDataset(roles, work, roles);
%bafFooter;