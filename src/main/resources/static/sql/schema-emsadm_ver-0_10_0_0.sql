/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of ASI entitlement system dictionary */
drop table emsadm.asi_entitlement_system cascade constraints purge;
/
create TABLE emsadm.asi_entitlement_system(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(100 CHAR) NOT NULL,
    is_active NUMBER(1),
    desc_id NUMBER(19,0),
    CONSTRAINT asi_entitlement_system_pk PRIMARY KEY(id),
    CONSTRAINT asi_entitlement_system_fk FOREIGN KEY (desc_id) REFERENCES emsadm.texts(id)
)TABLESPACE ems_data;

COMMENT on COLUMN asi_entitlement_system.id is 'Entitlement system PK';
COMMENT on COLUMN asi_entitlement_system.name is 'Entitlement system name';
COMMENT on COLUMN asi_entitlement_system.is_active is 'Entitlement system is active';
COMMENT on COLUMN asi_entitlement_system.desc_id is 'Entitlement system description FK (texts)';

/
/* Create the table of ASI entitlement system permission */
drop table emsadm.asi_ent_sys_permission cascade constraints purge;
/
create TABLE emsadm.asi_ent_sys_permission(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(100 CHAR) NOT NULL,
    is_active NUMBER(1),
    ent_sys_id NUMBER(19,0),
    desc_id NUMBER(19,0),
    CONSTRAINT asi_ent_sys_perm_pk PRIMARY KEY(id),
    CONSTRAINT asi_ent_sys_fk FOREIGN KEY (ent_sys_id) REFERENCES emsadm.asi_entitlement_system(id),
    CONSTRAINT asi_ent_sys_perm_desc_fk FOREIGN KEY (desc_id) REFERENCES emsadm.texts(id)
)TABLESPACE ems_data;

COMMENT on COLUMN asi_ent_sys_permission.id is 'Entitlement system permission PK';
COMMENT on COLUMN asi_ent_sys_permission.name is 'Entitlement system name';
COMMENT on COLUMN asi_ent_sys_permission.is_active is 'Entitlement system is active';
COMMENT on COLUMN asi_ent_sys_permission.ent_sys_id is 'Entitlement system FK (asi_entitlement_system)';
COMMENT on COLUMN asi_ent_sys_permission.desc_id is 'Entitlement system description FK (texts)';
/
/* Create the table of ASI employee entitlement */
drop table emsadm.asi_emp_entitlement cascade constraints purge;
/
create TABLE emsadm.asi_emp_entitlement(
    id NUMBER(19,0) NOT NULL,
    created_at TIMESTAMP (6),
	updated_at TIMESTAMP (6),
	created_by NUMBER(19,0),
	updated_by NUMBER(19,0),
	username VARCHAR2(50 CHAR),
	date_from DATE NOT NULL,
	date_to DATE,
	date_withdrawal DATE,
	ent_sys_id NUMBER(19,0),
    comments_id NUMBER(19,0),
    employee_id NUMBER(19,0) NOT NULL,
    employment_id NUMBER(19,0) NOT NULL,
    CONSTRAINT asi_emp_ent_pk PRIMARY KEY(id),
    CONSTRAINT asi_emp_ent_sys_fk FOREIGN KEY (ent_sys_id) REFERENCES emsadm.asi_entitlement_system(id),
    CONSTRAINT asi_emp_fk FOREIGN KEY (employee_id) REFERENCES emsadm.hr_employees(id),
    CONSTRAINT asi_emp_empl_fk FOREIGN KEY (employment_id) REFERENCES emsadm.hr_emp_employments(id),
    CONSTRAINT asi_emp_ent_desc_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id)
)TABLESPACE ems_data;

COMMENT on COLUMN asi_emp_entitlement.id is 'Employee entitlement PK';
COMMENT on COLUMN asi_emp_entitlement.created_at is 'Entitlement create date';
COMMENT on COLUMN asi_emp_entitlement.updated_at is 'Entitlement update date';
COMMENT on COLUMN asi_emp_entitlement.created_by is 'Entitlement create user name';
COMMENT on COLUMN asi_emp_entitlement.updated_by is 'Entitlement update user name';
COMMENT on COLUMN asi_emp_entitlement.username is 'Username in entitlement system';
COMMENT on COLUMN asi_emp_entitlement.date_from is 'Entitlement date from';
COMMENT on COLUMN asi_emp_entitlement.date_to is 'Entitlement date to';
COMMENT on COLUMN asi_emp_entitlement.date_withdrawal is 'Entitlement date withdrawal';
COMMENT on COLUMN asi_emp_entitlement.comments_id is 'Entitlement comments FK (texts)';
COMMENT on COLUMN asi_emp_entitlement.ent_sys_id is 'Entitlement system FK (asi_entitlement_system)';
COMMENT on COLUMN asi_emp_entitlement.employee_id is 'Entitlement employee FK (hr_emp_employments)';
COMMENT on COLUMN asi_emp_entitlement.employment_id is 'Entitlement employment FK (hr_emp_employments)';
/
/* Create the table of ASI employee entitlement permissions */
drop table emsadm.asi_emp_ent_permission cascade constraints purge;
/
create TABLE emsadm.asi_emp_ent_permission(
    id NUMBER(19,0) NOT NULL,
    sys_perm_id NUMBER(19,0) NOT NULL,
    entitlement_id number(19,0) NOT Null,
    CONSTRAINT asi_emp_ent_perm_pk PRIMARY KEY(id),
    CONSTRAINT asi_emp_ent_sys_perm_fk FOREIGN KEY (sys_perm_id) REFERENCES emsadm.asi_ent_sys_permission(id),
    CONSTRAINT asi_emp_ent_fk FOREIGN KEY (entitlement_id) REFERENCES emsadm.asi_emp_entitlement(id)
)TABLESPACE ems_data;

COMMENT on COLUMN asi_emp_ent_permission.id is 'Employee entitlement permission PK';
COMMENT on COLUMN asi_emp_ent_permission.sys_perm_id is 'Entitlement system permission FK (asi_ent_sys_permission)';
COMMENT on COLUMN asi_emp_ent_permission.entitlement_id is 'Employee entitlement FK (asi_emp_entitlement)';

-- Create table witch join permission workplaces
DROP TABLE emsadm.asi_ent_perm_workplace CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.asi_ent_perm_workplace
(
    permission_id NUMBER(19,0) NOT NULL,
    workplace_id NUMBER(19,0) NOT NULL,
    CONSTRAINT asi_ent_perm_workplace_unq UNIQUE(permission_id, workplace_id)

)TABLESPACE ems_data;

COMMENT on COLUMN asi_ent_perm_workplace.permission_id is 'Employee entitlement permission FK (asi_emp_entitlement)';
COMMENT on COLUMN asi_ent_perm_workplace.workplace_id is 'Employee entitlement permission workplace FK (hr_places)';
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/
-- Create sequence of table ASI entitlement system
drop sequence asi_entitlement_sys_seq;
/
create sequence asi_entitlement_sys_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table ASI entitlement system permission
drop sequence asi_ent_sys_perm_seq;
/
create sequence asi_ent_sys_perm_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table ASI employee entitlement
drop sequence asi_emp_entitlement_seq;
/
create sequence asi_emp_entitlement_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table ASI employee entitlement permission
drop sequence asi_emp_ent_perm_seq;
/
create sequence asi_emp_ent_perm_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
