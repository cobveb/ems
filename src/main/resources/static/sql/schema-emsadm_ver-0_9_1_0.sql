
/* Add column type, group to hr places table  */
alter table emsadm.hr_places add(
    place_type VARCHAR(2) default 'PL' NOT NULL,
    group_id NUMBER(19,0) CONSTRAINT hr_place_group_fk REFERENCES emsarch.dictionary_items(id)  ,
);

COMMENT on COLUMN hr_places.place_type is 'Type place or workplace';
COMMENT on COLUMN hr_places.group_id is 'Place group FK (dictionary_items -> slHrGrZaw)';
/

alter table emsadm.hr_places
    modify location_id null;
/