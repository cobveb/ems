insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (75,'1126','Odczyt pracowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (76,'2126','Modyfikacja danych pracownika');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (77,'3126','Usuwanie pracownika');

insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,75);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,76);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,77);
