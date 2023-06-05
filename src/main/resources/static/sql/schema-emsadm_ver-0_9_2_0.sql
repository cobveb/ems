/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of HR employees */
drop table emsadm.hr_employees cascade constraints purge;
/
create TABLE emsadm.hr_employees(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(15) NOT NULL,
    surname VARCHAR2(80) NOT NULL,
    hr_number VARCHAR2(20),
    comments_id NUMBER(19,0),
    CONSTRAINT hr_employee_pk PRIMARY KEY(id),
    CONSTRAINT hr_employee_comments_fk FOREIGN KEY (comments_id) REFERENCES emsadm.texts(id)
)TABLESPACE ems_data;

COMMENT on COLUMN hr_employees.id is 'Employee PK';
COMMENT on COLUMN hr_employees.name is 'Employee name';
COMMENT on COLUMN hr_employees.surname is 'Employee surname';
COMMENT on COLUMN hr_employees.hr_number is 'Employee HR number';
COMMENT on COLUMN hr_employees.comments_id is 'Employee comments FK (texts)';

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

-- Create sequence of table HR places
drop sequence hr_employee_seq;
/
create sequence hr_employee_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/