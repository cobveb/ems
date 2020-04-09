-- Create the table for Spring ACL

-- Table ACL_SID identify any principle or authority in the system
DROP TABLE emsarch.acl_sid CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE acl_sid (
	id NUMBER(38) NOT NULL PRIMARY KEY,
	principal NUMBER(1) NOT NULL CHECK (principal in (0, 1)),
	sid NVARCHAR2(100) NOT NULL,
	CONSTRAINT unique_acl_sid UNIQUE (sid, principal)
) TABLESPACE ems_access_control;

--- Add comments to the columns
COMMENT on COLUMN acl_sid.principal is '0 or 1, to indicate that the corresponding SID is a principal or an authority (role)';
COMMENT on COLUMN acl_sid.sid is 'Username or role name';
/
--GRANT SELECT, UPDATE, DELETE ON emsarch.acl_sid TO emsadm;
/
-- Table ACL_CLASS store class name of the domain object
DROP TABLE emsarch.acl_class CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE acl_class (
	id NUMBER(38) NOT NULL PRIMARY KEY,
	class NVARCHAR2(100) NOT NULL,
	CONSTRAINT uk_acl_class UNIQUE (class)
) TABLESPACE ems_access_control;

--- Add comments to the columns
COMMENT on COLUMN acl_class.class is 'Class name of secured domain objects';
/
--GRANT SELECT, UPDATE, DELETE ON emsarch.acl_class TO emsadm;
/

-- Table ACL_OBJECT_IDENTITY stores information for each unique domain object
DROP TABLE emsarch.acl_object_identity CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE acl_object_identity (
	id NUMBER(38) NOT NULL PRIMARY KEY,
	object_id_class NUMBER(38) NOT NULL,
	object_id_identity NVARCHAR2(36) NOT NULL,
	parent_object NUMBER(38),
	owner_sid NUMBER(38),
	entries_inheriting NUMBER(1) NOT NULL CHECK (entries_inheriting in (0, 1)),
	CONSTRAINT uk_acl_object_identity UNIQUE (object_id_class, object_id_identity),
	CONSTRAINT fk_acl_object_identity_parent FOREIGN KEY (parent_object) REFERENCES acl_object_identity (id),
	CONSTRAINT fk_acl_object_identity_class FOREIGN KEY (object_id_class) REFERENCES acl_class (id),
	CONSTRAINT fk_acl_object_identity_owner FOREIGN KEY (owner_sid) REFERENCES acl_sid (id)
) TABLESPACE ems_access_control;

--- Add comments to the columns
COMMENT on COLUMN acl_object_identity.object_id_class is 'define the domain object class, links to ACL_CLASS table';
COMMENT on COLUMN acl_object_identity.object_id_identity is 'domain objects can be stored in many tables. Hence, this field store the target object primary key in source table';
COMMENT on COLUMN acl_object_identity.parent_object is 'specify parent of this Object Identity within this table';
COMMENT on COLUMN acl_object_identity.owner_sid is 'ID of the object owner, links to ACL_SID table';
COMMENT on COLUMN acl_object_identity.entries_inheriting is 'whether ACL Entries of this object inherits from the parent object (ACL Entries are defined in ACL_ENTRY table)';
/
--GRANT SELECT, UPDATE, DELETE ON emsarch.acl_object_identity TO emsadm;
/

-- Table ACL_ENTRY store individual permission assigns to each SID on an Object Identity
DROP TABLE emsarch.acl_entry CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE acl_entry (
	id NUMBER(38) NOT NULL PRIMARY KEY,
	acl_object_identity NUMBER(38) NOT NULL,
	ace_order INTEGER NOT NULL,
	sid NUMBER(38) NOT NULL,
	mask INTEGER NOT NULL,
	granting NUMBER(1) NOT NULL CHECK (granting in (0, 1)),
	audit_success NUMBER(1) NOT NULL CHECK (audit_success in (0, 1)),
	audit_failure NUMBER(1) NOT NULL CHECK (audit_failure in (0, 1)),
	CONSTRAINT unique_acl_entry UNIQUE (acl_object_identity, ace_order),
	CONSTRAINT fk_acl_entry_object FOREIGN KEY (acl_object_identity) REFERENCES acl_object_identity (id),
	CONSTRAINT fk_acl_entry_acl FOREIGN KEY (sid) REFERENCES acl_sid (id)
) TABLESPACE ems_access_control;

--- Add comments to the columns
COMMENT on COLUMN acl_entry.acl_object_identity is 'specify the object identity, links to ACL_OBJECT_IDENTITY table';
COMMENT on COLUMN acl_entry.ace_order is 'the order of current entry in the ACL entries list of corresponding Object Identity';
COMMENT on COLUMN acl_entry.sid is 'the target SID which the permission is granted to or denied from, links to ACL_SID table';
COMMENT on COLUMN acl_entry.mask is 'the integer bit mask that represents the actual permission being granted or denied';
COMMENT on COLUMN acl_entry.granting is 'value 1 means granting, value 0 means denying';
COMMENT on COLUMN acl_entry.audit_success is 'for auditing purpose';
COMMENT on COLUMN acl_entry.audit_failure is 'for auditing purpose';

/
--GRANT SELECT, UPDATE, DELETE ON emsarch.acl_entry TO emsadm;
/

-- Create sequence for Spring ACL tables
DROP SEQUENCE acl_sid_sequence;
/
CREATE SEQUENCE acl_sid_sequence START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
--GRANT SELECT ON emsarch.acl_sid_sequence TO emsadm;
/
DROP SEQUENCE acl_class_sequence;
/
CREATE SEQUENCE acl_class_sequence START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
--GRANT SELECT ON emsarch.acl_class_sequence TO emsadm;
/
DROP SEQUENCE acl_object_identity_sequence;
/
CREATE SEQUENCE acl_object_identity_sequence START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
--GRANT SELECT ON emsarch.acl_object_identity_sequence TO emsadm;
/
DROP SEQUENCE acl_entry_sequence;
/
CREATE SEQUENCE acl_entry_sequence START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
--GRANT SELECT ON emsarch.acl_entry_sequence TO emsadm;
/

-- Trigger for Spring ACL
CREATE OR REPLACE TRIGGER acl_sid_id_trigger
	BEFORE INSERT ON acl_sid
	FOR EACH ROW
BEGIN
	SELECT acl_sid_sequence.nextval INTO :new.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER acl_class_id_trigger
	BEFORE INSERT ON acl_class
	FOR EACH ROW
BEGIN
	SELECT acl_class_sequence.nextval INTO :new.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER acl_object_identity_id_trigger
	BEFORE INSERT ON acl_object_identity
	FOR EACH ROW
BEGIN
	SELECT acl_object_identity_sequence.nextval INTO :new.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER acl_entry_id_trigger
	BEFORE INSERT ON acl_entry
	FOR EACH ROW
BEGIN
	SELECT acl_entry_sequence.nextval INTO :new.id FROM dual;
END;
/
------------------------
--- Custom structure ---
------------------------
-- Create the table of applications privileges
DROP TABLE emsarch.ac_privileges CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_privileges
(
    id NUMBER(19,0) NOT NULL,
	code VARCHAR2(30) NOT NULL,
	name VARCHAR2(100) NOT NULL,
    CONSTRAINT privilege_pk PRIMARY KEY(id),
    CONSTRAINT privilege_code_unq UNIQUE(code)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_privileges.id is 'Privilege ID';
COMMENT on COLUMN ac_privileges.code is 'Privilege uniq code (first char 0 - run , 1 - read, 2 - edit, 3 - delete)';
COMMENT on COLUMN ac_privileges.name is 'Privilege name';
/
GRANT SELECT ON emsarch.ac_privileges TO emsadm;
/

-- Create the table of applications access control objects
DROP TABLE emsarch.ac_objects CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_objects
(
    id NUMBER(19,0) NOT NULL,
    domain_model_id NUMBER(19,0) NOT NULL,
	name VARCHAR2(100) NOT NULL,
	domain_model_class VARCHAR2(30) NOT NULL,
    CONSTRAINT ac_objects_pk PRIMARY KEY(id),
    CONSTRAINT ac_objects_unq UNIQUE (domain_model_id, domain_model_class)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_objects.id is 'Access control Object ID';
COMMENT on COLUMN ac_objects.domain_model_id is 'Access control domain model primary key';
COMMENT on COLUMN ac_objects.name is 'Access control object name';
COMMENT on COLUMN ac_objects.domain_model_class is 'Access control domain model object class name ';
/
GRANT SELECT ON emsarch.ac_objects TO emsadm;
/

-- Create table witch join access control object and privilege
DROP TABLE emsarch.ac_object_privileges CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_object_privileges
(
    ac_object_id NUMBER(19,0) NOT NULL,
    ac_privilege_id NUMBER(19,0) NOT NULL,
    CONSTRAINT ac_object_privileges_pk PRIMARY KEY(ac_object_id, ac_privilege_id),
    CONSTRAINT ac_obj_pri_ac_object_fk FOREIGN KEY (ac_object_id) REFERENCES ac_objects (id),
    CONSTRAINT ac_obj_pri_ac_privileges_fk FOREIGN KEY (ac_privilege_id) REFERENCES ac_privileges (id)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_object_privileges.ac_object_id is 'Access control Object ID';
COMMENT on COLUMN ac_object_privileges.ac_privilege_id is 'Access control privilege ID';

/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.ac_object_privileges TO emsadm;
/

-- Create the table of applications access control permission
DROP TABLE emsarch.ac_permissions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_permissions
(
    id NUMBER(19,0) NOT NULL,
    ac_object_id NUMBER(19,0) NOT NULL,
	ac_privilege_id NUMBER(19,0) NOT NULL,
	user_id NUMBER(19,0),
	group_id NUMBER(19,0),
    CONSTRAINT ac_permissions_pk PRIMARY KEY(id),
    CONSTRAINT ac_per_ac_object_fk FOREIGN KEY (ac_object_id) REFERENCES ac_objects (id),
    CONSTRAINT ac_per_ac_privileges_fk FOREIGN KEY (ac_privilege_id) REFERENCES ac_privileges (id),
    CONSTRAINT ac_per_user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT ac_per_group_fk FOREIGN KEY (group_id) REFERENCES groups (id),
    CONSTRAINT ac_permission_unq UNIQUE (ac_object_id, ac_privilege_id, group_id, user_id)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_permissions.id is 'Permission ID';
COMMENT on COLUMN ac_permissions.ac_object_id is 'Access control Object ID';
COMMENT on COLUMN ac_permissions.ac_privilege_id is 'Access control Privilege ID';
/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.ac_permissions TO emsadm;
/

-- Create table witch join access control object and privilege to the user - na chwilę obecną używana tabela ac_sid_permission
/*DROP TABLE emsarch.ac_user_permissions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_user_permissions
(
    ac_user_id NUMBER(19,0) NOT NULL,
    ac_permission_id NUMBER(19,0) NOT NULL,
    CONSTRAINT ac_user_permissions_pk PRIMARY KEY(ac_user_id, ac_permission_id),
    CONSTRAINT ac_user_permissions_fk FOREIGN KEY (ac_permission_id) REFERENCES ac_permissions (id)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_user_permissions.ac_user_id is 'Access control user ID';
COMMENT on COLUMN ac_user_permissions.ac_permission_id is 'Access control privilege ID';

/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.ac_user_permissions TO emsadm;
/*/
-- Create table witch join access control object and privilege to the group - na chwilę obecną używana tabela ac_sid_permission
/*DROP TABLE emsarch.ac_group_permissions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_group_permissions
(
    ac_group_id NUMBER(19,0) NOT NULL,
    ac_permission_id NUMBER(19,0) NOT NULL,
    CONSTRAINT ac_group_permissions_pk PRIMARY KEY(ac_group_id, ac_permission_id),
    CONSTRAINT ac_group_permissions_fk FOREIGN KEY (ac_permission_id) REFERENCES ac_permissions (id)
)TABLESPACE ems_access_control;

--- Add comments to the columns

COMMENT on COLUMN ac_group_permissions.ac_group_id is 'Access control group ID';
COMMENT on COLUMN ac_group_permissions.ac_permission_id is 'Access control privilege ID';

/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.ac_group_permissions TO emsadm;
/*/

-- Create table witch join access control object and privilege to the sid (user or group)
DROP TABLE emsarch.ac_sid_permissions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_sid_permissions
(
    ac_user_id NUMBER(19,0),
    ac_group_id NUMBER(19,0),
    ac_permission_id NUMBER(19,0) NOT NULL,
    --CONSTRAINT ac_sid_permissions_pk PRIMARY KEY(ac_user_id, ac_group_id, ac_permission_id),
    CONSTRAINT ac_sid_permissions_fk FOREIGN KEY (ac_permission_id) REFERENCES ac_permissions (id)
)TABLESPACE ems_access_control;

--- Add comments to the columns
COMMENT on COLUMN ac_sid_permissions.ac_user_id is 'Access control user ID';
COMMENT on COLUMN ac_sid_permissions.ac_group_id is 'Access control group ID';
COMMENT on COLUMN ac_group_permissions.ac_permission_id is 'Access control privilege ID';

/
GRANT SELECT, INSERT, UPDATE, DELETE ON emsarch.ac_sid_permissions TO emsadm;
/

-- Create sequence of table ac_privileges
DROP SEQUENCE ac_privilege_seq;
/
CREATE SEQUENCE ac_privilege_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.ac_privilege_seq TO emsadm;
/

-- Create sequence of table access control object
DROP SEQUENCE ac_objects_seq;
/
CREATE SEQUENCE ac_objects_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.ac_objects_seq TO emsadm;

-- Create sequence of table access control permissions
DROP SEQUENCE ac_permissions_seq;
/
CREATE SEQUENCE ac_permissions_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.ac_permissions_seq TO emsadm;