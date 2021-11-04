SET ECHO OFF
SET LINESIZE 32767
SET HEADING ON
SET HEADSEP OFF
SET WRAP OFF

SPOOL D:\Projekty\ems\src\main\resources\static\sql\initDB.log
PROMPT (1/5) connecting user emsarch
CONN emsarch/emsarch
PROMPT (1/5) start execute emsarch schema script
@D:\Projekty\ems\src\main\resources\static\sql\schema-emsarch.sql
PROMPT (1/5) stop execute emsarch schema script
PROMPT (2/5) start inserting data into emsarch schema
@D:\Projekty\ems\src\main\resources\static\sql\data-emsarch.sql
PROMPT (2/5) stop inserting data into emsarch schema
PROMPT (3/5) start execute emsarch schema acl
@D:\Projekty\ems\src\main\resources\static\sql\schema-emsarch-acl.sql
PROMPT (3/5) stop execute emsarch schema acl
PROMPT (4/5) start inserting data into emsarch schema acl
@D:\Projekty\ems\src\main\resources\static\sql\data-emsarch-acl.sql
PROMPT (4/5) stop inserting data into emsarch schema acl
disconnect
CONN emsadm/emsadm
PROMPT (5/5) start execute emsadm schema script
@D:\Projekty\ems\src\main\resources\static\sql\schema-emsadm.sql
PROMPT (5/5) stop execute emsadm schema script
disconnect

SPOOL OFF
EXIT