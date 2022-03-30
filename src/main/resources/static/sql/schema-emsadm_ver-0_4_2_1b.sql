ALTER TABLE emsadm.cor_pub_proc_protocol ADD contractor_desc_id NUMBER(19,0);

COMMENT on COLUMN cor_pub_proc_protocol.contractor_desc_id is 'Contractor description (Text)';
/