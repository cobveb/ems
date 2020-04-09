/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

/*Create the table of organization units*/
DROP TABLE emsadm.organization_units CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.organization_units
(
	code VARCHAR2(10) NOT NULL ,
	name VARCHAR2(120) NOT NULL ,
	short_name VARCHAR2(80) NOT NULL ,
	nip VARCHAR2(10),
	regon VARCHAR2(14),
	city VARCHAR2(30),
	zip_code VARCHAR2(8),
	street VARCHAR2(50),
	building VARCHAR2(5),
	phone varchar2(18),
	fax varchar2(18),
	email VARCHAR2(50) NOT NULL,
	active NUMBER(1) NOT NULL,
	coordinator NUMBER(1) NOT NULL,
	parent VARCHAR2(10),
    CONSTRAINT ou_pk PRIMARY KEY (code),
	CONSTRAINT ou_email_unq UNIQUE(email)
)
TABLESPACE ems_data;

-- Add comments to the columns
COMMENT on COLUMN organization_units.code is 'Unit code';
COMMENT on COLUMN organization_units.name is 'Unit name';
COMMENT on COLUMN organization_units.short_name is 'Unit short name';
COMMENT on COLUMN organization_units.nip is 'Unit NIP number (only for main institution unit)';
COMMENT on COLUMN organization_units.regon is 'Unit REGON number (only for main institution unit)';
COMMENT on COLUMN organization_units.city is 'City ​​name of the unit';
COMMENT on COLUMN organization_units.zip_code is 'Zipcode of the unit';
COMMENT on COLUMN organization_units.street is 'Street name of the unit';
COMMENT on COLUMN organization_units.building is 'Unit building number';
COMMENT on COLUMN organization_units.phone is 'Unit phone number';
COMMENT on COLUMN organization_units.fax is 'Unit fax number';
COMMENT on COLUMN organization_units.email is 'Unit email address';
COMMENT on COLUMN organization_units.active is 'Unit status 1 - active 0 - unactive';
COMMENT on COLUMN organization_units.coordinator is 'Unit coordinator 1 - yes 0 - no';
COMMENT on COLUMN organization_units.parent is 'Unit parent organization unit';

/*Grant permissions on table organization_units for the user emsarch*/
GRANT SELECT, REFERENCES ON emsadm.organization_units TO emsarch;
/

/*Close connection of user emsadm*/
disconnect;