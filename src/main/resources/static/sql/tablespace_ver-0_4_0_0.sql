/*Create tablespace for application text*/
CREATE TABLESPACE ems_texts
	DATAFILE
	SIZE 200M
	autoextend on next 200M maxsize unlimited
	ONLINE
;