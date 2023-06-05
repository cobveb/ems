/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of HR places */
drop table emsadm.hr_places cascade constraints purge;
/
create TABLE emsadm.hr_places(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(300) NOT NULL,
    active NUMBER(1),
    place_type VARCHAR(2) default 'PL' NOT NULL,
    location_id NUMBER(19,0),
    group_id NUMBER(19,0),
    CONSTRAINT hr_places_pk PRIMARY KEY(id),
    CONSTRAINT hr_place_location_fk FOREIGN KEY (location_id) REFERENCES emsarch.dictionary_items(id),
    CONSTRAINT hr_place_group_fk FOREIGN KEY (group_id) REFERENCES  emsarch.dictionary_items(id)
)TABLESPACE ems_data;

COMMENT on COLUMN hr_places.id is 'Place contractors PK';
COMMENT on COLUMN hr_places.name is 'Place name';
COMMENT on COLUMN hr_places.active is 'Is place active';
COMMENT on COLUMN hr_places.place_type is 'Type place or workplace';
COMMENT on COLUMN hr_places.location_id is 'Place location FK (dictionary_items -> slHrLoc)';
COMMENT on COLUMN hr_places.group_id is 'Place group FK (dictionary_items -> slHrGrZaw)';

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

-- Create sequence of table HR places
drop sequence hr_place_seq;
/
create sequence hr_place_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/