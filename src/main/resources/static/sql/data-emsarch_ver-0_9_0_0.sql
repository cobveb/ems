insert into EMSARCH.MODULES (ID,CODE,NAME) values (6,'hr','Kadry');

insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slHrGrZaw', 'Grupy zawodowe', 'U');
insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slHrLoc', 'Lokalizacje', 'A');

insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'adm','Administracja','1','slHrLoc');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ceg','Ceglana','1','slHrLoc');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'med','Medyków','1','slHrLoc');



