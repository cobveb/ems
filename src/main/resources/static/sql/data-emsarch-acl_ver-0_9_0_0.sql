insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (6,6,'Moduł Kadry','MODULE');

insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (72,'1116','Odczyt słowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (73,'2116','Modyfikacja pozycji słownika');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (74,'3116','Usuwanie pozycji słownika');

insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,72);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,73);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (6,74);
