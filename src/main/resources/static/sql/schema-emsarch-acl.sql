-- Create the table of applications privileges
DROP TABLE emsarch.ac_privileges CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsarch.ac_privileges(
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
CREATE TABLE emsarch.ac_objects(
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
CREATE TABLE emsarch.ac_object_privileges(
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
CREATE TABLE emsarch.ac_permissions(
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

-- Create sequence of table access control permissions
DROP SEQUENCE ac_permissions_seq;
/
CREATE SEQUENCE ac_permissions_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/
GRANT SELECT ON emsarch.ac_permissions_seq TO emsadm;