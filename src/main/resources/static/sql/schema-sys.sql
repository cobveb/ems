/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   HELP                                                              */
/*---------------------------------------------------------------------------------------------------------------------*/

/*List users database*/
SELECT * FROM ALL_USERS

/* Check setup accounts for user like SYS */
select username,account_status,expiry_date,profile from dba_users where username like 'SYS%';

/* Check password setup in default profile */
SELECT * FROM dba_profiles WHERE profile = 'DEFAULT' AND resource_type = 'PASSWORD';


/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                  END  HELP                                              								           */
/*--------------------------------------------------------------------------------------------------------------------*/

/* Disable password life time for database user */
alter profile "DEFAULT" limit password_life_time unlimited;

/* Delete database system administrator - emsadm - if exist*/
DROP USER emsadm CASCADE;

/*Create a database system  administrator user - emsadm*/
CREATE USER emsadm IDENTIFIED BY emsadm
  DEFAULT TABLESPACE ems_users;

/*Grant privileges to the database system administrator*/
GRANT
    CONNECT, RESOURCE,
    CREATE PROFILE, ALTER PROFILE, DROP PROFILE,
    CREATE ROLE, DROP ANY ROLE, GRANT ANY ROLE,
    CREATE USER, BECOME USER, ALTER USER, DROP USER,
    CREATE PUBLIC SYNONYM
TO emsadm WITH ADMIN OPTION;

/* Delete database system architecture user - sysarch - if exist*/
DROP USER emsarch CASCADE;

/*Create a database system architecture user - sysarch*/
CREATE USER emsarch IDENTIFIED BY emsarch
  DEFAULT TABLESPACE ems_users;

/*Grant privileges to the database system administrator*/
GRANT
    CONNECT, RESOURCE
TO emsarch;
