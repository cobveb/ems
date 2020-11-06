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
COMMENT on COLUMN organization_units.city is 'City name of the unit';
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

/*Create the table of Application on module Applicant*/
DROP TABLE emsadm.application CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.application (
    id NUMBER(19,0) NOT NULL,
    app_number VARCHAR2(22) NOT NULL,
    applicant_id VARCHAR(10) NOT NULL,
    coordinator_id VARCHAR(10) NOT NULL,
    status VARCHAR(2) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    CONSTRAINT application_pk PRIMARY KEY(id),
    CONSTRAINT application_number_unq UNIQUE(app_number),
    CONSTRAINT application_coordinator_fk FOREIGN KEY (coordinator_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT application_applicant_fk FOREIGN KEY (applicant_id) REFERENCES emsadm.organization_units(code)
)
TABLESPACE ems_data;

COMMENT on COLUMN application.id is 'Applicaton ID';
COMMENT on COLUMN application.app_number is 'Applicaton uniq number';
COMMENT on COLUMN application.applicant_id is 'Applicant ID (Organization Unit)';
COMMENT on COLUMN application.coordinator_id is 'Coordinator ID (Organization Unit)';
COMMENT on COLUMN application.status is 'Applicaton status';
COMMENT on COLUMN application.create_date is 'Applicaton create date';
COMMENT on COLUMN application.send_date is 'Applicaton date send to coordinator';

/*Create the table of Application position on module Applicant*/
DROP TABLE emsadm.application_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.application_positions (
    id NUMBER(19,0) NOT NULL,
    application_id NUMBER(19,0) NOT NULL,
    unit_id NUMBER(19,0) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    quantity NUMBER(19,0) NOT NULL,
    status VARCHAR(2) NOT NULL,
    description VARCHAR(200),
    rejection_reason VARCHAR(200),
    CONSTRAINT application_positions_pk PRIMARY KEY(id),
    CONSTRAINT application_positions_fk FOREIGN KEY (application_id) REFERENCES emsadm.application(id),
    CONSTRAINT application_positions_unit_fk FOREIGN KEY (unit_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN application_positions.id is 'Appilcation positions ID';
COMMENT on COLUMN application_positions.application_id is 'Appilcation ID';
COMMENT on COLUMN application_positions.unit_id is 'Dictionary JEDMIAR item ID';
COMMENT on COLUMN application_positions.name is 'Application position name';
COMMENT on COLUMN application_positions.quantity is 'Application position quantity';
COMMENT on COLUMN application_positions.status is 'Application position status';
COMMENT on COLUMN application_positions.description is 'Application position description';
COMMENT on COLUMN application_positions.rejection_reason is 'Application position rejection reason';

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			    */
/*-------------------------------------------------------------------------------------------------------------------- */
-- Create sequence of table application
DROP SEQUENCE application_seq;
/
CREATE SEQUENCE application_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/

DROP SEQUENCE application_pos_seq;
/
CREATE SEQUENCE application_pos_seq START WITH 2 INCREMENT BY 1 NOMAXVALUE;
/

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   PACKAGES                                            			    */
/*-------------------------------------------------------------------------------------------------------------------- */

/* Create package Application management*/
CREATE OR REPLACE PACKAGE application_mgmt AS
    PROCEDURE generate_number(applicant IN VARCHAR2, new_number OUT VARCHAR2);
END application_mgmt;
/
CREATE OR REPLACE PACKAGE BODY application_mgmt AS
    PROCEDURE generate_number(applicant IN VARCHAR2, new_number OUT VARCHAR2)
        AS
            last_application_number emsadm.application.app_number%TYPE;
            last_number NUMBER;
            first_day Date;
            last_day Date;
            year VARCHAR2(4);
        BEGIN

            SELECT TRUNC (SYSDATE , 'YEAR')
            INTO first_day
            FROM DUAL;

            SELECT ADD_MONTHS(TRUNC (SYSDATE, 'YEAR'), 12) - 1
            INTO last_day
            FROM DUAL;

            SELECT app_number
            INTO last_application_number
            FROM (SELECT *
                    FROM application
                        WHERE application.applicant_id = applicant AND
                            application.create_date BETWEEN first_day AND last_day
                                ORDER BY application.id DESC)
            WHERE ROWNUM <= 1;

            SELECT EXTRACT(YEAR FROM sysdate)
            INTO year
            FROM dual;

            last_number:=TO_NUMBER(SUBSTR(last_application_number, 0, INSTR(last_application_number, '/')-1))+1;

            new_number := last_number || '/' || applicant || '/' || year;

        END;

END application_mgmt;
/
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TRIGGERS                                            			    */
/*-------------------------------------------------------------------------------------------------------------------- */
CREATE OR REPLACE TRIGGER trg_app_number_gen
    BEFORE INSERT
        ON application
            FOR EACH ROW
                DECLARE
                    out_application application.id%TYPE;
                BEGIN
                    :new.app_number := application_mgmt.generate_number(:new.applicant_id);
                END;
/

/*Close connection of user emsadm*/
disconnect;