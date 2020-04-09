REM INSERTING into EMSARCH.AC_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (ac_privilege_seq.nextval,'0001','Uruchomienie modułu');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (ac_privilege_seq.nextval,'1001','Odczyt wszystkich wniosków');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (ac_privilege_seq.nextval,'2001','Modyfikacja wszystkich wniosków');
Insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (ac_privilege_seq.nextval,'3001','Usuwanie wszystkich wniosków');

REM INSERTING into EMSARCH.AC_OBJECTS
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (ac_objects_seq.nextval,'3','Moduł Wnioskodawca','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (ac_objects_seq.nextval,'2','Moduł Koordynator','MODULE');
Insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (ac_objects_seq.nextval,'1','Moduł Księgowy','MODULE');

REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
SET DEFINE OFF;
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,1);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,2);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,3);
Insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,4);


