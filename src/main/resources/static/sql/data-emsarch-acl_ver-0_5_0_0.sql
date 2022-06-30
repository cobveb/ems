REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (58,'1142','Odczyt faktur');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (59,'2142','Modyfikacja faktury');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (60,'3142','Usuwanie faktury');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (61,'1242','Odczyt umów');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (62,'2242','Modyfikacja umowy');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (63,'3242','Usuwanie umowy');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,58);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,59);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,60);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,61);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,62);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,63);