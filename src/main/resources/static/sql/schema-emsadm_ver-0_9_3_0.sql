/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of HR employee employments */
drop table emsadm.hr_emp_employments cascade constraints purge;
/
create TABLE emsadm.hr_emp_employments(
    id NUMBER(19,0) NOT NULL,
    emp_type VARCHAR(3) NOT NULL,
    emp_number VARCHAR2(120) NOT NULL,
    emp_date DATE,
    date_from DATE NOT NULL,
    date_to DATE,
    status VARCHAR2(2),
    is_active NUMBER(1),
    is_process NUMBER(1),
    is_statement NUMBER(1),
    is_authorization NUMBER(1),
    comments_id NUMBER(19,0),
    employee_id NUMBER(19,0) NOT NULL,
    CONSTRAINT hr_emp_employments_pk PRIMARY KEY(id),
    CONSTRAINT hr_emp_employments_comments_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id),
    CONSTRAINT hr_employee_employments_fk FOREIGN KEY (employee_id) REFERENCES emsadm.hr_employees(id)
)TABLESPACE ems_data;

COMMENT on COLUMN hr_emp_employments.id is 'Employee PK';
COMMENT on COLUMN hr_emp_employments.emp_type is 'Employment type';
COMMENT on COLUMN hr_emp_employments.emp_number is 'Employment number';
COMMENT on COLUMN hr_emp_employments.emp_date is 'Employment on date';
COMMENT on COLUMN hr_emp_employments.date_from is 'Employment from date';
COMMENT on COLUMN hr_emp_employments.date_to is 'Employment to date';
COMMENT on COLUMN hr_emp_employments.status is 'Employment IODO status';
COMMENT on COLUMN hr_emp_employments.is_active is 'Employment is active';
COMMENT on COLUMN hr_emp_employments.is_process is 'Whether employment processes personal data';
COMMENT on COLUMN hr_emp_employments.is_statement is 'Whether a declaration of processing personal data is required';
COMMENT on COLUMN hr_emp_employments.is_authorization is 'Whether authorization to process personal data is required';
COMMENT on COLUMN hr_emp_employments.comments_id is 'Employee comments FK (texts)';
COMMENT on COLUMN hr_emp_employments.employee_id is 'Employee employment FK (hr_employee)';

/* Create the table of HR employee employment statements */
drop table emsadm.hr_emp_eml_statements cascade constraints purge;
/
create TABLE emsadm.hr_emp_eml_statements(
    id NUMBER(19,0) NOT NULL,
     is_active NUMBER(1),
     sta_date DATE NOT NULL,
     date_from DATE NOT NULL,
     date_to DATE,
     verify_date DATE NOT NULL,
     comments_id NUMBER(19,0),
     employment_id NUMBER(19,0) NOT NULL,
     CONSTRAINT hr_emp_eml_statements_pk PRIMARY KEY(id),
     CONSTRAINT hr_emp_eml_statements_comments_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id),
     CONSTRAINT hr_employment_statements_fk FOREIGN KEY (employment_id) REFERENCES emsadm.hr_emp_employments(id)
) TABLESPACE ems_data;

COMMENT on COLUMN hr_emp_eml_statements.id is 'Statement PK';
COMMENT on COLUMN hr_emp_eml_statements.is_active is 'Statement is active';
COMMENT on COLUMN hr_emp_eml_statements.sta_date is 'Statement on date';
COMMENT on COLUMN hr_emp_eml_statements.date_from is 'Statement from date';
COMMENT on COLUMN hr_emp_eml_statements.date_to is 'Statement to date';
COMMENT on COLUMN hr_emp_eml_statements.verify_date is 'Statement verification date';
COMMENT on COLUMN hr_emp_eml_statements.comments_id is 'Statement comments FK (texts)';
COMMENT on COLUMN hr_emp_eml_statements.employment_id is 'Employment FK (hr_employment)';

/* Create the table of HR employee employment authorizations */
drop table emsadm.hr_emp_eml_authorizations cascade constraints purge;
/
create TABLE emsadm.hr_emp_eml_authorizations(
    id NUMBER(19,0) NOT NULL,
     is_active NUMBER(1),
     auth_date DATE NOT NULL,
     date_from DATE NOT NULL,
     date_to DATE,
     verify_date DATE NOT NULL,
     proc_basis_id NUMBER(19,0) NOT NULL,
     comments_id NUMBER(19,0),
     employment_id NUMBER(19,0) NOT NULL,
     CONSTRAINT hr_emp_eml_authorizations_pk PRIMARY KEY(id),
     CONSTRAINT hr_emp_eml_authorizations_proc_basis_fk FOREIGN KEY (proc_basis_id) REFERENCES emsadm.iod_reg_pos_cpdo(id),
     CONSTRAINT hr_emp_eml_authorizations_comments_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id),
     CONSTRAINT hr_employment_authorizations_fk FOREIGN KEY (employment_id) REFERENCES emsadm.hr_emp_employments(id)
) TABLESPACE ems_data;

COMMENT on COLUMN hr_emp_eml_authorizations.id is 'Authorization PK';
COMMENT on COLUMN hr_emp_eml_authorizations.is_active is 'Authorization is active';
COMMENT on COLUMN hr_emp_eml_authorizations.auth_date is 'Authorization on date';
COMMENT on COLUMN hr_emp_eml_authorizations.date_from is 'Authorization from date';
COMMENT on COLUMN hr_emp_eml_authorizations.date_to is 'Authorization to date';
COMMENT on COLUMN hr_emp_eml_authorizations.verify_date is 'Authorization verification date';
COMMENT on COLUMN hr_emp_eml_authorizations.proc_basis_id is 'Authorization processing basis FK (iod_reg_pos_cpdo)';
COMMENT on COLUMN hr_emp_eml_authorizations.comments_id is 'Authorization comments FK (texts)';
COMMENT on COLUMN hr_emp_eml_authorizations.employment_id is 'Employment FK (hr_employment)';

/* Create the table of HR employee employment workplaces */
drop table emsadm.hr_emp_eml_workplaces cascade constraints purge;
/
create TABLE emsadm.hr_emp_eml_workplaces(
    id NUMBER(19,0) NOT NULL,
     is_active NUMBER(1),
     date_from DATE NOT NULL,
     date_to DATE,
     place_id NUMBER(19,0) NOT NULL,
     workplace_id NUMBER(19,0) NOT NULL,
     comments_id NUMBER(19,0),
     employment_id NUMBER(19,0) NOT NULL,
     CONSTRAINT hr_emp_eml_workplaces_pk PRIMARY KEY(id),
     CONSTRAINT hr_emp_eml_workplaces_place_fk FOREIGN KEY (place_id) REFERENCES emsadm.hr_places(id),
     CONSTRAINT hr_emp_eml_workplaces_workplace_fk FOREIGN KEY (workplace_id) REFERENCES emsadm.hr_places(id),
     CONSTRAINT hr_emp_eml_workplaces_comments_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id),
     CONSTRAINT hr_employment_workplaces_fk FOREIGN KEY (employment_id) REFERENCES emsadm.hr_emp_employments(id)
) TABLESPACE ems_data;

COMMENT on COLUMN hr_emp_eml_workplaces.id is 'Employment workplace PK';
COMMENT on COLUMN hr_emp_eml_workplaces.is_active is 'Employment workplace is active';
COMMENT on COLUMN hr_emp_eml_workplaces.date_from is 'Employment workplace from date';
COMMENT on COLUMN hr_emp_eml_workplaces.date_to is 'Employment workplace to date';
COMMENT on COLUMN hr_emp_eml_workplaces.place_id is 'Employment workplace place FK (hr_places)';
COMMENT on COLUMN hr_emp_eml_workplaces.workplace_id is 'Employment workplace FK (hr_places)';
COMMENT on COLUMN hr_emp_eml_workplaces.comments_id is 'Employment workplace comments FK (texts)';
COMMENT on COLUMN hr_emp_eml_workplaces.employment_id is 'Employment FK (hr_employment)';
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

-- Create sequence of table HR employee employments
drop sequence hr_emp_employment_seq;
/
create sequence hr_emp_employment_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/

-- Create sequence of table HR employee employment statements
drop sequence hr_emp_eml_statements_seq;
/
create sequence hr_emp_eml_statements_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/

-- Create sequence of table HR employee employment authorizations
drop sequence hr_emp_eml_authorizations_seq;
/
create sequence hr_emp_eml_authorizations_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/

-- Create sequence of table HR employee employment workplace
drop sequence hr_emp_eml_workplace_seq;
/
create sequence hr_emp_eml_workplace_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/