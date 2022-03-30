/* Create the table of Public Procurement Protocol */
drop table emsadm.cor_pub_proc_protocol cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_protocol(
    id NUMBER(19,0) NOT NULL,
    status VARCHAR2(2) NOT NULL,
    email NUMBER(1),
    phone NUMBER(1),
    internet NUMBER(1),
    paper NUMBER(1),
    other NUMBER(1),
    other_desc_id NUMBER(19,0),
    renouncement NUMBER(1),
    non_comp_id NUMBER(19,0),
    received_offers_id NUMBER(19,0),
    just_choosing_off_id NUMBER(19,0),
    send_user_id NUMBER(19,0),
    accountant_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    contractor_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_prl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_prl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_acc_usr_fk FOREIGN KEY (accountant_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_chf_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_ctr_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id)

)TABLESPACE  ems_data;


COMMENT on COLUMN cor_pub_proc_protocol.id is 'Public procurement protocol PK';
COMMENT on COLUMN cor_pub_proc_protocol.status is 'Application protocol status';
COMMENT on COLUMN cor_pub_proc_protocol.email is 'Form price recognition - email';
COMMENT on COLUMN cor_pub_proc_protocol.phone is 'Form price recognition - phone';
COMMENT on COLUMN cor_pub_proc_protocol.internet is 'Form price recognition - internet';
COMMENT on COLUMN cor_pub_proc_protocol.paper is 'Form price recognition - paper';
COMMENT on COLUMN cor_pub_proc_protocol.other is 'Form price recognition - other';
COMMENT on COLUMN cor_pub_proc_protocol.other_desc_id is 'Form price recognition - other desc (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.renouncement is 'Form price recognition - renouncement';
COMMENT on COLUMN cor_pub_proc_protocol.non_comp_id is 'Justification of the non-competitive procedure (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.received_offers_id is 'Public Procurement application received offers (text)';
COMMENT on COLUMN cor_pub_proc_protocol.just_choosing_off_id is 'Public Procurement application justification purchase (text)';
COMMENT on COLUMN cor_pub_proc_protocol.send_user_id is 'Application send user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.accountant_accept_user_id is 'Application accountant accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.chief_accept_user_id is 'Application chief accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.contractor_id is 'Contractor FK (acc_contractors)';


drop sequence text_seq;
/
create sequence text_seq start with 1 increment by 1 nomaxvalue;
/