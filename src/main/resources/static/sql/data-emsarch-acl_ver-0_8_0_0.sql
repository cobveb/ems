insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (7,7,'Moduł IODO','MODULE');

insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (69,'1117','Odczyt rejestrów');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (70,'2117','Modyfikacja rejestru / pozycji rejestru');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (71,'3117','Usuwanie pozycji rejestru');

insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (7,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (7,69);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (7,70);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (7,71);
