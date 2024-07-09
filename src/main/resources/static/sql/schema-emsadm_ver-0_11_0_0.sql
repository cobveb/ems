/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of ASI dictionary registers*/
drop table emsadm.asi_dict_registers cascade constraints purge;
/
create TABLE emsadm.asi_dict_registers(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(150 CHAR) NOT NULL,
    is_active NUMBER(1),
    description VARCHAR(500 CHAR),
    base_type_id NUMBER(19,0),
    CONSTRAINT asi_dict_register_pk PRIMARY KEY(id),
    CONSTRAINT asi_dict_reg_type_fk FOREIGN KEY (base_type_id) REFERENCES emsarch.dictionary_items(id)
)TABLESPACE ems_data;

COMMENT on COLUMN asi_dict_registers.id is 'Dictionary register PK';
COMMENT on COLUMN asi_dict_registers.name is 'Dictionary register name';
COMMENT on COLUMN asi_dict_registers.is_active is 'Dictionary register is active';
COMMENT on COLUMN asi_dict_registers.description is 'Dictionary register description';
COMMENT on COLUMN asi_dict_registers.base_type_id is 'Dictionary register base type FK (dictionary_items -> slAsRegPod)';
/

/* Add register column that includes the entitlement system */
alter table emsadm.asi_entitlement_system add(
  register_id NUMBER(19,0) CONSTRAINT asi_entitlement_system__register_fk REFERENCES emsadm.asi_dict_registers(id)
);

COMMENT on COLUMN asi_entitlement_system.register_id is 'Register includes the entitlement system FK (asi_dict_registers)';
/

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/
-- Create sequence of table ASI dictionary registers
drop sequence asi_dict_reg_seq;
/
create sequence asi_dict_reg_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/

