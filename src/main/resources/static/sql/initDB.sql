SET ECHO OFF
SET LINESIZE 32767
SET HEADING ON
SET HEADSEP OFF
SET WRAP OFF

SPOOL D:\Projekty\ems\src\main\resources\static\sql\initDB.log
PROMPT (1/4) connecting user emsarch
CONN emsarch/emsarch
PROMPT (1/4) start execute emsarch schema script
@D:\Projekty\ems\src\main\resources\static\sql\schema-emsarch.sql
PROMPT (1/4) stop execute emsarch schema script
PROMPT (2/4) start inserting data into emsarch schema
@D:\Projekty\ems\src\main\resources\static\sql\data-emsarch.sql
PROMPT (2/4) stop inserting data into emsarch schema
PROMPT (3/4) start execute emsarch schema acl
@D:\Projekty\ems\src\main\resources\static\sql\data-emsarch.sql
PROMPT (3/4) stop execute emsarch schema acl
disconnect
CONN emsadm/emsadm
PROMPT (4/4) start execute emsadm schema script
@D:\Projekty\ems\src\main\resources\static\sql\schema-emsadm.sql
PROMPT (4/4) stop execute emsadm schema script
disconnect

SPOOL OFF
EXIT