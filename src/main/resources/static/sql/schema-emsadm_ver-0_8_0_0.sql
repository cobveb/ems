/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of registers */
drop table emsadm.registers cascade constraints purge;
/
create TABLE emsadm.registers(
    id NUMBER(19,0) NOT NULL,
    code VARCHAR2(10) NOT NULL,
    name VARCHAR2(300) NOT NULL,
    upd_date DATE,
    upd_user_id NUMBER(19,0),
    CONSTRAINT registers_pk PRIMARY KEY(id),
    CONSTRAINT registers_upd_user_fk FOREIGN KEY (upd_user_id) REFERENCES emsarch.users(id)
)TABLESPACE ems_data;

COMMENT on COLUMN registers.id is 'IodRegister PK';
COMMENT on COLUMN registers.code is 'IodRegister code';
COMMENT on COLUMN registers.name is 'IodRegister name';
COMMENT on COLUMN registers.upd_date is 'IodRegister update date';
COMMENT on COLUMN registers.upd_user_id is 'IodRegister update user ID (FK -> Users)';
/

/* Create the table of register positions */
drop table emsadm.register_positions cascade constraints purge;
/
create TABLE emsadm.register_positions(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(300) NOT NULL,
    register_id NUMBER(19,0),
    CONSTRAINT reg_pos_pk PRIMARY KEY(id),
    CONSTRAINT reg_pos_fk FOREIGN KEY (register_id) REFERENCES emsadm.registers(id)
)TABLESPACE ems_data;

COMMENT on COLUMN register_positions.id is 'IodRegister position PK';
COMMENT on COLUMN register_positions.name is 'IodRegister poistion name';
COMMENT on COLUMN register_positions.register_id is 'IodRegister ID (FK -> Registers)';
/

/* Create the table of iod register cpdo positions */
drop table emsadm.iod_reg_pos_cpdo cascade constraints purge;
/
create TABLE emsadm.iod_reg_pos_cpdo(
    id NUMBER(19,0) NOT NULL,
    ou_id NUMBER(19,0),
    purpose_proc_id NUMBER(19,0),
    cat_people_id NUMBER(19,0),
    data_cat_id NUMBER(19,0),
    legal_basis_id NUMBER(19,0),
    date_source_id NUMBER(19,0),
    cat_rem_date_id NUMBER(19,0),
    co_adm_name_id NUMBER(19,0),
    processor_name_id NUMBER(19,0),
    recipient_cat_id NUMBER(19,0),
    sys_soft_name_id NUMBER(19,0),
    sec_measures_id NUMBER(19,0),
    dpia_id NUMBER(19,0),
    third_country_id NUMBER(19,0),
    third_country_doc_id NUMBER(19,0),
    comments_id NUMBER(19,0),
    CONSTRAINT reg_pos_cpdo_pk PRIMARY KEY(id)
)TABLESPACE ems_data;

COMMENT on COLUMN iod_reg_pos_cpdo.id is 'IodRegister position PK';
COMMENT on COLUMN iod_reg_pos_cpdo.ou_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.purpose_proc_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.cat_people_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.data_cat_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.legal_basis_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.date_source_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.cat_rem_date_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.co_adm_name_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.processor_name_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.recipient_cat_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.sys_soft_name_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.sec_measures_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.dpia_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.third_country_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.third_country_doc_id is 'Organization units (text)';
COMMENT on COLUMN iod_reg_pos_cpdo.comments_id is 'Comments (text)';
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

-- Create sequence of table registers
drop sequence register_seq;
/
create sequence register_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/

-- Create sequence of table registers positions
drop sequence reg_pos_seq;
/
create sequence reg_pos_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/