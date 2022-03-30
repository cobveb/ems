/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                     HELP                                                    		   */
/*---------------------------------------------------------------------------------------------------------------------*/

/*List database datafiles*/
SELECT * FROM DBA_DATA_FILES;

/*List database tablespace*/
SELECT * FROM DBA_TABLESPACES;

/*Drop tablespace with datafiles*/
DROP TABLESPACE %tablespace_name% INCLUDING CONTENTS AND DATAFILES;

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   END HELP                                                          */
/*---------------------------------------------------------------------------------------------------------------------*/

/*Create tablespace for application users*/
CREATE TABLESPACE ems_users
	DATAFILE
	SIZE 50M
	autoextend on next 50M maxsize unlimited
	ONLINE
;

/*Create tablespace for application architecture*/
CREATE TABLESPACE ems_architecture
	DATAFILE
	SIZE 50M
	autoextend on next 50M maxsize unlimited
	ONLINE
;

/*Create tablespace for application data*/
CREATE TABLESPACE ems_data
	DATAFILE
	SIZE 200M
	autoextend on next 200M maxsize unlimited
	ONLINE
;

/*Create tablespace for application dictionaries*/
CREATE TABLESPACE ems_dictionaries
	DATAFILE
	SIZE 50M
	autoextend on next 50M maxsize unlimited
	ONLINE
;

/*Create tablespace for application dictionaries*/
CREATE TABLESPACE ems_access_control
	DATAFILE
	SIZE 50M
	autoextend on next 50M maxsize unlimited
	ONLINE
;

/*Create tablespace for application text*/
CREATE TABLESPACE ems_texts
	DATAFILE
	SIZE 200M
	autoextend on next 200M maxsize unlimited
	ONLINE
;