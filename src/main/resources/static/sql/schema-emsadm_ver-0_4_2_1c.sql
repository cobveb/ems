ALTER TABLE emsadm.cor_pub_proc_protocol ADD public_accept_user_id NUMBER(19,0);

COMMENT on COLUMN cor_pub_proc_protocol.public_accept_user_id is 'Application public procurement accept user FK (users)';
/