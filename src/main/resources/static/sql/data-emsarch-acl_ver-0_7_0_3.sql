REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (64,'1144','Odczyt umów koordynatorów');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (65,'1244','Odczyt faktur koordynatorów');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,64);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,65);
