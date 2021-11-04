insert into EMSARCH.DICTIONARIES (CODE,NAME,TYPE) values ('slKatPlInw', 'Kategorie pozycji w planie inwestycyjnym', 'U');

insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'inw','Inwestycje','1','slKatPlInw');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ap14e','Aparatura i sprzet medyczny o wartości netto nabycia przekraczającej 14 000 EURO ale nieprzekraczającej równowartości 70 000 EURO w przeliczeniu na PLN','1','slKatPlInw');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'ap70e','Aparatura medyczna i sprzęt medyczny, której wartość netto nabycia przekracza kwotę 70 000 EURO w przeliczeniu na PLN','1','slKatPlInw');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'poz','Pozostałe','1','slKatPlInw');
insert into EMSARCH.DICTIONARY_ITEMS (ID,CODE,NAME,IS_ACTIVE,DICTIONARY_CODE) values (dict_item_seq.nextval,'sysTeInf','Systemy teleinformatyczne','1','slKatPlInw');
