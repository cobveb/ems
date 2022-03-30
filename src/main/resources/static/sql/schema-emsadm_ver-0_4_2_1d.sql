/* Add column public procurement application cancel user  */
alter table emsadm.cor_pub_proc_application add(
  cancel_user_id NUMBER(19,0) CONSTRAINT cor_pub_proc_apl_can_usr_fk REFERENCES emsarch.users(id)
);

COMMENT on COLUMN cor_pub_proc_application.cancel_user_id is 'Application cancel user FK (users)';
/