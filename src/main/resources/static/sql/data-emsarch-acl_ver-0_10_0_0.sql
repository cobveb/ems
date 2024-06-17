insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (8,8,'Moduł ASI','MODULE');

insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (78,'1118','Odczyt uprawnień pracowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (79,'2118','Modyfikacja uprawnień pracowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (80,'3118','Usuwanie uprawnień pracowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (81,'1128','Odczyt słowników');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (82,'2128','Modyfikacja pozycji słownika');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (83,'3128','Usuwanie pozycji słownika');

insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,78);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,79);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,80);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,81);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,82);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (8,83);

