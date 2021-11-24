REM INSERTING into EMSARCH.AC_PRIVILEGES
SET DEFINE OFF;
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (1,'0001','Uruchomienie modułu');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (2,'1011','Odczyt wniosków w ramach jednostki organizacyjnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (3,'2011','Modyfikacja wniosków w ramach jednostki organizacyjnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (4,'3011','Usuwanie wniosków w ramach jednostki organizacyjnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (5,'4011','Wysłanie wniosku');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (6,'5011','Wycofanie wysłanego wniosku');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (7,'1014','Odczyt słownika rodzajów kosztów');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (8,'2014','Modyfikacja rodzaju kosztu');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (9,'3014','Usuwanie rodzaju kosztu');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (10,'1022','Odczyt planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (11,'2022','Modyfikacja planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (12,'3022','Usuwanie planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (13,'4022','Wysłanie planu do jednstki nardzędnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (14,'5022','Wycofanie wysłanego planu do jednstki nardzędnej');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (15,'1024','Odczyt planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (16,'2024','Akceptacja pozycji planu koordynatora');
--TODO Niewykozystywana opcja zatwierdzanie na poziomie planu instytucji
--insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (17,'3024','Zatwierdzenie planu koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (18,'1013','Odczyt planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (19,'2013','Zatwierdzenie planu koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (20,'1015','Odczyt planów koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (21,'2015','Zatwierdzenie planu koordynatora Dyrektor pionu');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (22,'3015','Zatwierdzenie planu koordynatora Dyrektor naczelny');
--TODO Niewykozystywana opcja zatwierdzanie na poziomie planu instytucji
--insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (23,'4024','Wycofanie zatwierdzonego planu koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (24,'1034','Odczyt planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (25,'2034','Akceptacja pozycji w planie instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (26,'3034','Zatwierdzenie planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (27,'4034','Wycofanie zatwierdzonego planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (28,'4015','Zgłaszanie uwag do pozycji planu Koordynatora');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (29,'1025','Odczyt planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (30,'2025','Zatwierdzenie planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (31,'3025','Wycofanie planu instytucji');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (32,'5015','Zatwierdzenie planu koordynatora Dyrektor Ekonmiczny');
insert into EMSARCH.AC_PRIVILEGES (ID,CODE,NAME) values (33,'6015','Wycofanie planu koordynatora');

REM INSERTING into EMSARCH.AC_OBJECTS
SET DEFINE OFF;
insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (1,5,'Moduł Wnioskodawca','MODULE');
insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (2,4,'Moduł Koordynator','MODULE');
insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (3,3,'Moduł Zamówienia Publiczne','MODULE');
insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (4,2,'Moduł Księgowy','MODULE');
insert into EMSARCH.AC_OBJECTS (ID,domain_model_id,NAME,domain_model_class) values (5,1,'Moduł Dyrektor','MODULE');

REM INSERTING into EMSARCH.AC_OBJECT_PRIVILEGES
SET DEFINE OFF;
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,1);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,2);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,3);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,4);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,5);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (1,6);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,7);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,8);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,9);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,15);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,16);
--TODO Niewykozystywana opcja zatwierdzanie na poziomie planu instytucji
--insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,17);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,10);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,11);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,12);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,13);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (2,14);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,18);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (3,19);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,20);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,21);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,22);
--TODO Niewykozystywana opcja zatwierdzanie na poziomie planu instytucji
--insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,23);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,24);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,25);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,26);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (4,27);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,28);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,29);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,30);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,31);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,32);
insert into EMSARCH.AC_OBJECT_PRIVILEGES (ac_object_id,ac_privilege_id) values (5,33);


