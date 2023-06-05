REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (67,'1033','Dodawanie pozycji do słownika');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (68,'2033','Usuwanie pozycji ze słownika');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,67);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,68);