/* Add new privilege */
REM INSERTING into EMSARCH.AC_PRIVILEGES
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (54,'4113','Zatwierdzenie realizacji wniosku o udzielenie zamwienia publicznego');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (55,'5113','Wycofanie realizacji wniosku o udzielenie zamwienia publicznego');
REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,54);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,55);


