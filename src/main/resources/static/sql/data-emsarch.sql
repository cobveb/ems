
REM INSERTING into EMSARCH.MODULES
SET DEFINE OFF;
insert into EMSARCH.MODULES (ID,CODE,NAME) values (1,'director','Dyrektor');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (2,'accountant','Ksi�gowy');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (3,'public','Zamówienia publiczne');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (4,'coordinator','Koordynator');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (5,'applicant','Wnioskodawca');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (6,'hr','Kadry');
insert into EMSARCH.MODULES (ID,CODE,NAME) values (7,'administrator','Administrator');
REM INSERTING into EMSARCH.GROUPS
insert into EMSARCH.GROUPS (ID,CODE,NAME) values (groups_seq.nextval,'admin','Administratorzy');
REM INSERTING into EMSARCH.USERS
SET DEFINE OFF;
insert into EMSARCH.USERS (ID,CREATED_AT,UPDATED_AT,CREATED_BY,UPDATED_BY,NAME,PASSWORD,SURNAME,USERNAME) values (user_seq.nextval,to_timestamp('19/05/01 04:12:16,588344000','RR/MM/DD HH24:MI:SSXFF'),to_timestamp('19/05/01 04:12:16,588344000','RR/MM/DD HH24:MI:SSXFF'),null,null,'User','$2a$10$/ymH1SVrQkQ78TJl.s0ShuwvawFQGJ0fGNksn4kE2/wVHzSK5SXd2','Name','user');
insert into EMSARCH.USERS (ID,CREATED_AT,UPDATED_AT,CREATED_BY,UPDATED_BY,NAME,PASSWORD,SURNAME,USERNAME,OU) values (user_seq.nextval,to_timestamp('21/09/19 08:40:16,662541000','RR/MM/DD HH24:MI:SSXFF'),to_timestamp('21/09/19 08:40:16,662541000','RR/MM/DD HH24:MI:SSXFF'),null,null,'Administrator','$2a$10$z0cmw4Oywh6C0IBnrQ6hku9BIxG5.0WltxYc.rY2nEHrLL4DUf7xe','Administrator','administrator', null);
REM INSERTING into EMSARCH.USER_GROUPS
SET DEFINE OFF;
insert into EMSARCH.USER_GROUPS (USER_ID,GROUP_ID) values ('1','1');
REM INSERTING into EMSARCH.DICTIONARIES
SET DEFINE OFF;
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('jedMiar', 'Jednostki miary', 'A');
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('dicFunSour', 'Źródła finansowania', 'U');
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slAsortGr', 'Grupy Asortymentowe', 'U');
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slTryUdzZp', 'Tryb udzielenia zamówienia', 'U');
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slKatPlInw', 'Kategorie pozycji w planie inwestycyjnym', 'U');
REM INSERTING into jedMiar - EMSARCH.DICTIONARY_ITEMS
SET DEFINE OFF;
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'szt', 'sztuka', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'opa', 'opakowanie', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'g', 'gram', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'kg', 'kilorgam', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'cm', 'centymetr', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m', 'metr', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'km', 'kilometr', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ml', 'mililitr', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'l', 'litr', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'dm3', 'dm3', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m3', 'm3', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'cm2', 'cm2', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'m2', 'm2', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'kpl', 'komplet', 1, 'jedMiar');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ustawa', 'poza ustawą', 1, 'slTryUdzZp');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'strona','ogłoszenie na stronie','1','slTryUdzZp');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'przetarg','przetarg nieograniczony','1','slTryUdzZp');
REM INSERTING into dicFunSour - EMSARCH.DICTIONARY_ITEMS
SET DEFINE OFF;
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ue', 'UE', 1, 'dicFunSour');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'wlasne', 'Własne', 1, 'dicFunSour');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'inne', 'Inne', 1, 'dicFunSour');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'mz', 'MZ', 1, 'dicFunSour');
REM INSERTING into EMSARCH.PARAMETERS
SET DEFINE OFF;
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minDigits','System','Password','Minimalna liczba cyfr w haśle','Minimalna liczba cyfr w haśle. Domyślna wartość: 1','N','');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minLowercase','System','Password','Minimalna liczba małych liter w haśle','Minimalna liczba małych liter w haśle. Domyślna wartość: 1','N','');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minUppercase','System','Password','Minimalna liczba dużych liter w haśle','Minimalna liczba dużych liter w haśle. Domyślna wartość: 1','N','');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minSpecialChar','System','Password','Minimalna liczba znaków specjalnych w haśle','Minimalna liczba znak�w specjalnych w haśle. Domyślna wartość: 1','N','');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('minCharLength','System','Password','Minimalna ilość znaków w haśle','Minimalna ilość znaków w haśle. Domyślna wartość: 8','N','');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('passValidPeriod','System','Password','Okres ważności hasła','Okres waśności hasła (liczba dni), po którym nastąpi wymuszenie zmiany hasła przez użytkownika.','N','30');
insert into EMSARCH.PARAMETERS (CODE,CATEGORY,SECTION,NAME,DESCRIPTION,VALUE_TYPE,VALUE) values ('euro','Moduł','Zamówienia','Aktualny kurs Euro','Obowiązujący kurs euro dla zamówień publicznych','C','4,2693');