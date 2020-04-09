/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

-- Create the table of applications authorization tokens
DROP TABLE emsarch.tokens CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.tokens
(
    token VARCHAR2(255 CHAR) NOT NULL,
    expiration_date_time TIMESTAMP (6),
	user_id NUMBER(19,0) NOT NULL,
	CONSTRAINT token_pk PRIMARY KEY(token)
) TABLESPACE ems_architecture;
/
GRANT SELECT, INSERT, DELETE ON emsarch.tokens TO emsadm;
/

-- Create the table of applications roles
DROP TABLE emsarch.roles CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.roles
(
    id NUMBER(19,0) NOT NULL,
	name VARCHAR2(30) NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY(id),
    CONSTRAINT role_name_unq UNIQUE(name)
)TABLESPACE ems_architecture
/
GRANT SELECT, INSERT ON emsarch.roles TO emsadm;
/

-- Create the table of application users
DROP TABLE emsarch.users CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.users
   (
    id NUMBER(19,0) NOT NULL,
	created_at TIMESTAMP (6),
	updated_at TIMESTAMP (6),
	created_by NUMBER(19,0),
	updated_by NUMBER(19,0),
	name VARCHAR2(20 CHAR),
	password VARCHAR2(100 CHAR),
	last_password_change TIMESTAMP (6),
	surname VARCHAR2(30 CHAR),
	username VARCHAR2(20 CHAR),
	is_active NUMBER(1) DEFAULT 1 NOT NULL,
	is_locked NUMBER(1) DEFAULT 0 NOT NULL,
	is_expired NUMBER(1) DEFAULT 0 NOT NULL,
	is_credentials_expired NUMBER(1) DEFAULT 0 NOT NULL,
	ou VARCHAR2(10) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY(id),
    CONSTRAINT user_username_unq UNIQUE(username)
    CONSTRAINT user_organization_unit_fk FOREIGN KEY (ou) REFERENCES emsadm.organization_units(code)
) TABLESPACE ems_architecture;
/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.users TO emsadm;
/

-- Create table witch join user role
DROP TABLE emsarch.user_roles CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.user_roles
(
    user_id NUMBER(19,0) NOT NULL,
    role_id NUMBER(19,0) NOT NULL,
    CONSTRAINT user_roles_pk PRIMARY KEY(user_id, role_id)
)TABLESPACE ems_architecture ;
/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.user_roles TO emsadm;
/

-- Create the table of application modules
DROP TABLE emsarch.modules CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.modules
(
	id NUMBER(19,0)  NOT NULL,
	code VARCHAR2(20) NOT NULL ,
	name VARCHAR2(60) NOT NULL,
	CONSTRAINT module_pk PRIMARY KEY(id),
	CONSTRAINT module_code_unq UNIQUE(code)
)
TABLESPACE ems_architecture;

-- Add comments to the columns

COMMENT on COLUMN modules.id  is 'Module ID';
COMMENT on COLUMN modules.code  is 'Uniqe module code';
COMMENT on COLUMN modules.name  is 'Module name';

/*Grant permissions on table modules for the user sysadm*/
GRANT SELECT, INSERT ON emsarch.modules TO emsadm;
/

-- Create the table of application dictionaries
DROP TABLE emsarch.dictionaries CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.dictionaries
(
    code VARCHAR2(10) NOT NULL ,
	name VARCHAR2(120) NOT NULL ,
	type VARCHAR2(1) NOT NULL,
	CONSTRAINT dictionary_pk PRIMARY KEY (code)
)
TABLESPACE ems_dictionaries;

--- Add comments to the columns

COMMENT on COLUMN dictionaries.code is 'Dictionary code';
COMMENT on COLUMN dictionaries.name is 'Dictionary name';
COMMENT on COLUMN dictionaries.type is 'Dictionary type: (u) user, (a) administrator, (s) system';
/
/*Grant permissions on table dictionaries for the user sysadm*/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.dictionaries TO emsadm;

-- Create the table of application dictionary items
DROP TABLE emsarch.dictionary_items CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.dictionary_items
(
    code VARCHAR2(10) NOT NULL ,
	name VARCHAR2(120) NOT NULL ,
	dictionary_code VARCHAR2(10) NOT NULL,
	CONSTRAINT dictionary_items_pk PRIMARY KEY (code),
	CONSTRAINT dictionary_items_fk FOREIGN KEY (dictionary_code) REFERENCES emsarch.dictionaries(code)
)
TABLESPACE ems_dictionaries;

--- Add comments to the columns

COMMENT on COLUMN dictionary_items.code is 'Dictionary item code';
COMMENT on COLUMN dictionary_items.name is 'Dictionary item name';
COMMENT on COLUMN dictionary_items.dictionary_code is 'Dictionary code foregin key';
/
/*Grant permissions on table dictionaries for the user sysadm*/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.dictionary_items TO emsadm;

-- Create the table of application parameter
DROP TABLE emsarch.parameters CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.parameters
(
    code VARCHAR2(20) NOT NULL ,
    category VARCHAR2(20) NOT NULL ,
    section VARCHAR2(20) NOT NULL ,
	name VARCHAR2(120) NOT NULL ,
	description VARCHAR2(200) NOT NULL,
	value_type VARCHAR2(1) NOT NULL ,
	value VARCHAR2(120) NULL,
	CONSTRAINT parameter_pk PRIMARY KEY (code)
)
TABLESPACE ems_architecture;

--- Add comments to the columns

COMMENT on COLUMN parameters.code is 'Parameter code';
COMMENT on COLUMN parameters.category is 'Parameter category: system, user';
COMMENT on COLUMN parameters.section is 'Parameter section in category';
COMMENT on COLUMN parameters.name is 'Parameter name';
COMMENT on COLUMN parameters.description is 'Parameter description';
COMMENT on COLUMN parameters.value_type is 'N - numeric, C - character, B - Boolean ';
COMMENT on COLUMN parameters.value is 'Parameter value';
/
/*Grant permissions on table parameters for the user sysadm*/
GRANT SELECT, UPDATE ON emsarch.parameters TO emsadm;
/

-- Create the table of applications user groups
DROP TABLE emsarch.groups CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.groups
(
    id NUMBER(19,0) NOT NULL,
	code VARCHAR2(20) NOT NULL,
	name VARCHAR2(30) NOT NULL,
    CONSTRAINT groups_pk PRIMARY KEY(id),
    CONSTRAINT groups_unq UNIQUE(code)
)TABLESPACE ems_architecture;

--- Add comments to the columns
COMMENT on COLUMN groups.id is 'User group Id';
COMMENT on COLUMN groups.code is 'User group code';
COMMENT on COLUMN groups.name is 'User group name';
/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.groups TO emsadm;
/

-- Create table witch join user groups
DROP TABLE emsarch.user_groups CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.user_groups
(
    user_id NUMBER(19,0) NOT NULL,
    group_id NUMBER(19,0) NOT NULL,
    CONSTRAINT user_groups_unq UNIQUE(user_id, group_id)

)TABLESPACE ems_architecture ;
/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.user_groups TO emsadm;
/


/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			    */
/*-------------------------------------------------------------------------------------------------------------------- */
-- Create sequence of table roles
DROP SEQUENCE role_seq;
/
CREATE SEQUENCE role_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.role_seq TO emsadm;
/
-- Create sequence of table user
DROP SEQUENCE user_seq;
/
CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.user_seq TO emsadm;
/
-- Create sequence of table modules
DROP SEQUENCE module_seq;
/
CREATE SEQUENCE module_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.module_seq TO emsadm;
/
-- Create sequence of table user groups
DROP SEQUENCE groups_seq;
/
CREATE SEQUENCE groups_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.groups_seq TO emsadm;
/
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TRIGGERS                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

-- Trigger responsible for postponing information about the user's last password change.
CREATE OR REPLACE TRIGGER trg_user_password_change
    BEFORE INSERT OR UPDATE
        OF password ON users
            FOR EACH ROW
                BEGIN
                    :new.last_password_change := SYSDATE;
                END;
/
