/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

/*-----------------------------------------Tables Module ADMINISTRATOR-------------------------------------------------*/

/*Create the table of organization units*/
DROP TABLE emsadm.organization_units CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.organization_units
(
	code VARCHAR2(10) NOT NULL ,
	name VARCHAR2(120) NOT NULL ,
	short_name VARCHAR2(80) NOT NULL ,
	role VARCHAR2(10),
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
	parent VARCHAR2(10),
	director_id VARCHAR2(10),
    CONSTRAINT ou_pk PRIMARY KEY (code),
	CONSTRAINT ou_email_unq UNIQUE(email),
	CONSTRAINT ou_director_fk FOREIGN KEY (director_id) REFERENCES emsadm.organization_units(code),
)
TABLESPACE ems_data;

-- Add comments to the columns
COMMENT on COLUMN organization_units.code is 'Unit code';
COMMENT on COLUMN organization_units.name is 'Unit name';
COMMENT on COLUMN organization_units.role is 'Unit additional role (chief, director, coordinator)';
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
COMMENT on COLUMN organization_units.director_id is 'Director unit for coordinator';

/*Grant permissions on table organization_units for the user emsarch*/
GRANT SELECT, REFERENCES ON emsadm.organization_units TO emsarch;
/

/*-----------------------------------------Tables Module APPLICANT----------------------------------------------------*/

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

/*-----------------------------------------Tables Module ACCOUNTANT----------------------------------------------------*/

/*Create the table of CostsType on module Accountant*/
DROP TABLE emsadm.acc_costs_type CASCADE CONSTRAINTS PURGE;
/

CREATE TABLE emsadm.acc_costs_type (
    id NUMBER(19,0) NOT NULL,
    cost_number VARCHAR(12) NOT NULL,
    name VARCHAR(200) NOT NULL,
    active NUMBER(1) DEFAULT 1 NOT NULL,
	CONSTRAINT acc_costs_type_pk PRIMARY KEY(id),
    CONSTRAINT acc_costs_type_number_unq UNIQUE(cost_number)
)
TABLESPACE ems_data;

COMMENT on COLUMN acc_costs_type.id is 'Cost Type ID';
COMMENT on COLUMN acc_costs_type.cost_number is 'Cost Type uniq number';
COMMENT on COLUMN acc_costs_type.name is 'Cost Type name';
COMMENT on COLUMN acc_costs_type.active is 'Cost Type status 1 - active 0 - inactive';

/*Create the table of CostsType on module Accountant*/
DROP TABLE emsadm.acc_cost_years CASCADE CONSTRAINTS PURGE;
/

CREATE TABLE emsadm.acc_cost_years (
    id NUMBER(19,0) NOT NULL,
    year NUMBER(4) NOT NULL,
    cost_type_id NUMBER(19,0) NOT NULL,
	CONSTRAINT acc_cost_years_pk PRIMARY KEY(id),
	CONSTRAINT acc_cost_years_unq UNIQUE(year, cost_type_id),
	CONSTRAINT acc_cost_type_fk FOREIGN KEY (cost_type_id) REFERENCES acc_costs_type(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN acc_cost_years.id is 'Cost Year ID';
COMMENT on COLUMN acc_cost_years.year is 'Number representing full year';
COMMENT on COLUMN acc_cost_years.cost_type_id is 'Cost Type ID';

/*Create the table of Costs Year Coordinators on module Accountant*/
DROP TABLE emsadm.acc_cost_years_coordinators CASCADE CONSTRAINTS PURGE;
/

CREATE TABLE emsadm.acc_cost_years_coordinators (
    cost_year_id NUMBER(19,0) NOT NULL,
    coordinator_id VARCHAR2(10) NOT NULL,
    CONSTRAINT acc_cost_years_coordinators_pk PRIMARY KEY(cost_year_id, coordinator_id),
    CONSTRAINT acc_cost_years_year_fk FOREIGN KEY (cost_year_id) REFERENCES acc_cost_years(id),
    CONSTRAINT acc_cost_years_coordinator_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code)

)
TABLESPACE ems_data;

COMMENT on COLUMN acc_cost_years_coordinators.cost_year_id is 'Cost Year ID';
COMMENT on COLUMN acc_cost_years_coordinators.coordinator_id is 'Organization Units Coordinator ID';

/*-----------------------------------------Tables Module COORDINATOR----------------------------------------------------*/

/*Create the table of Plans on module Coordinator*/
DROP TABLE emsadm.cor_plans CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_plans(
    id NUMBER(19,0) NOT NULL,
    year INTEGER NULL,
    status VARCHAR(2) NOT NULL,
    plan_type VARCHAR(3) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    coordinator_id VARCHAR2(10) NOT NULL,
    send_user_id NUMBER(19,0),
    plant_accept_user_id NUMBER(19,0),
    director_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
	CONSTRAINT cor_plan_pk PRIMARY KEY(id),
	CONSTRAINT cor_plan_coordinator_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code),
	CONSTRAINT cor_plan_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_accept_usr_fk FOREIGN KEY (plan_accept_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_dir_accept_usr_fk FOREIGN KEY (director_accept_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_chf_accept_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_plan_year_type_cor_unq UNIQUE(year, plan_type, coordinator_id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_plans.id is 'Plan ID';
COMMENT on COLUMN cor_plans.year is 'Year of the plan validity';
COMMENT on COLUMN cor_plans.status is 'Plan status';
COMMENT on COLUMN cor_plans.plan_type is 'Plan type in (FIN, INW, PZP)';
COMMENT on COLUMN cor_plans.create_date is 'Plan create date';
COMMENT on COLUMN cor_plans.send_user_id is 'Plan send user (Users)';
COMMENT on COLUMN cor_plans.send_date is 'Plan send date';
COMMENT on COLUMN cor_plans.coordinator_id is 'Coordinator ID (Organization Unit)';
COMMENT on COLUMN cor_plans.send_user_id is 'Plan send user (Users)';
COMMENT on COLUMN cor_plans.plan_accept_user_id is 'Plan accountant / procuements accept user (Users)';
COMMENT on COLUMN cor_plans.director_accept_user_id is 'Plan director accept user (Users)';
COMMENT on COLUMN cor_plans.chief_accept_user_id is 'Plan chief accept user (Users)';


/*Create the table of Plans Positions on module Coordinator*/
DROP TABLE emsadm.cor_plan_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_plan_positions(
    id NUMBER(19,0) NOT NULL,
    status VARCHAR(2) NOT NULL,
    am_req_net NUMBER(20,5),
    am_req_gross NUMBER(20,5),
    am_awa_net NUMBER(20,5),
    am_awa_gross NUMBER(20,5),
    am_rea_net NUMBER(20,5),
    am_rea_gross NUMBER(20,5),
    vat NUMBER(3,2) NOT NULL,
    plan_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_plan_pos_fk FOREIGN KEY (plan_id) REFERENCES emsadm.cor_plans(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_plan_positions.id is 'Position ID';
COMMENT on COLUMN cor_plan_positions.status is 'Position status in (ZP,WY,ZA,PR,RE,ZR)';
COMMENT on COLUMN cor_plan_positions.am_req_net is 'Position amount requested net';
COMMENT on COLUMN cor_plan_positions.am_req_gross is 'Position amount requested gross';
COMMENT on COLUMN cor_plan_positions.am_awa_net is 'Position amount awared net';
COMMENT on COLUMN cor_plan_positions.am_awa_gross is 'Position amount awared gross';
COMMENT on COLUMN cor_plan_positions.am_rea_net is 'Position amount realized net';
COMMENT on COLUMN cor_plan_positions.am_rea_gross is 'Position amount realized gross';
COMMENT on COLUMN cor_plan_positions.plan_id is 'Plan ID foregin key cor_plans';

/*Create the table of Plans Positions Financial on module Coordinator*/
DROP TABLE emsadm.cor_financial_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_financial_positions(
    id NUMBER(19,0) NOT NULL,
    cost_type_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_fin_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_pos_fk FOREIGN KEY (id) REFERENCES emsadm.cor_plan_positions(id),
	CONSTRAINT cor_fin_pos_cost_fk FOREIGN KEY (cost_type_id) REFERENCES emsadm.acc_costs_type(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_financial_positions.id is 'Financial position ID PK and FK';
COMMENT on COLUMN cor_financial_positions.cost_type_id is 'Position Cost Type ID';
/

/*Create the table of Plans Positions Public Procurement on module Coordinator*/
DROP TABLE emsadm.cor_pub_procurement_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_procurement_positions(
    id NUMBER(19,0) NOT NULL,
    order_type VARCHAR(3) NOT NULL,
    initiation_term VARCHAR(20) NOT NULL,
    euro_ex_rate NUMBER(5,4),
    estimation_type VARCHAR(5) NOT NULL,
    am_inferred_net NUMBER(20,5),
    am_inferred_gross NUMBER(20,5),
    assortment_id NUMBER(19,0) NOT NULL,
    mode_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_pub_proc_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_pub_proc_pos_fk FOREIGN KEY (id) REFERENCES emsadm.cor_plan_positions(id),
	CONSTRAINT cor_pub_proc_assort_gr_fk FOREIGN KEY (assortment_id) REFERENCES emsarch.dictionary_items(id),
	CONSTRAINT cor_pub_proc_mode_fk FOREIGN KEY (mode_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_procurement_positions.id is 'Financial position ID PK and FK';
COMMENT on COLUMN cor_pub_procurement_positions.order_type is 'Position order type';
COMMENT on COLUMN cor_pub_procurement_positions.initiation_term is 'Position initiation term';
COMMENT on COLUMN cor_pub_procurement_positions.assortment_id is 'Position assortment group (FK -> slAsortGr)';
COMMENT on COLUMN cor_pub_procurement_positions.estimation_type is 'Position estimation type';
COMMENT on COLUMN cor_pub_procurement_positions.am_inferred_net is 'Value net of submitted applications for public procurement';
COMMENT on COLUMN cor_pub_procurement_positions.am_inferred_gross is 'Value gross of submitted applications for public procurement';
COMMENT on COLUMN cor_pub_procurement_positions.euro_ex_rate is 'Position euro exchange rate';
COMMENT on COLUMN cor_pub_procurement_positions.mode_id is 'Position order mode (FK -> slTrybUdzZp)';
/


/*Create the table of Plans Positions Investment on module Coordinator*/
DROP TABLE emsadm.cor_investment_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_investment_positions(
    id NUMBER(19,0) NOT NULL,
    task VARCHAR(120) NOT NULL,
    application VARCHAR(200),
    substantiation VARCHAR(200),
	CONSTRAINT cor_inv_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_inv_fk FOREIGN KEY (id) REFERENCES emsadm.cor_plan_positions(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_investment_positions.id is 'Investment position ID PK and FK';
COMMENT on COLUMN cor_investment_positions.task is 'Position task name';
COMMENT on COLUMN cor_investment_positions.application is 'Position application';
COMMENT on COLUMN cor_investment_positions.substantiation is 'Position substantiation';

/*Create the table of Plans Sub Positions on module Coordinator*/
DROP TABLE emsadm.cor_plan_sub_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_plan_sub_positions(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(120) NOT NULL,
    am_net NUMBER(20,5) NOT NULL,
    am_gross NUMBER(20,5) NOT NULL,
    comments VARCHAR(200),
    plan_position_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_plan_sub_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_plan_sub_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_plan_sub_positions.id is 'Sub Position ID PK and FK';
COMMENT on COLUMN cor_plan_sub_positions.am_net is 'Position amount requested net';
COMMENT on COLUMN cor_plan_sub_positions.comments is 'Position comments';
COMMENT on COLUMN cor_plan_sub_positions.plan_position_id is 'Plan Position ID foregin key -> cor_plan_position';

/*Create the table of Plans Positions Financial on module Coordinator*/
DROP TABLE emsadm.cor_financial_sub_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_financial_sub_positions(
    id NUMBER(19,0) NOT NULL,
    quantity NUMBER(8,0) NOT NULL,
    unit_price NUMBER(20,5) NOT NULL,
    unit_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_fin_sub_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_fin_sub_pos_fk FOREIGN KEY (id) REFERENCES emsadm.cor_plan_sub_positions(id),
	CONSTRAINT cor_fin_sub_pos_unit_fk FOREIGN KEY (unit_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_financial_sub_positions.id is 'Financial position ID PK and FK';
COMMENT on COLUMN cor_financial_sub_positions.quantity is 'Position quantity';
COMMENT on COLUMN cor_financial_sub_positions.unit_price is 'Position unit price';
COMMENT on COLUMN cor_financial_sub_positions.unit_id is 'Position quantity Unit ID';
/

/*Create the table of Plans Positions Public Procurement on module Coordinator*/
DROP TABLE emsadm.cor_pub_sub_proc_positions CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_sub_proc_positions(
    id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_pub_proc_sub_pos_pk PRIMARY KEY(id),
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_sub_proc_positions.id is 'Financial position ID PK and FK';
/


/*Create the table of Plans Positions Investment Founding Source */
DROP TABLE emsadm.cor_inv_founding_source CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_inv_founding_source(
    id NUMBER(19,0) NOT NULL,
    so_am_awa_net NUMBER(20,5) NOT NULL,
    so_ex_plan_net NUMBER(20,5) NOT NULL,
    type_id NUMBER(19,0) NOT NULL,
    position_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_inv_pos_source_pk PRIMARY KEY(id),
	CONSTRAINT cor_inv_pos_source_typ_fk FOREIGN KEY (type_id) REFERENCES emsarch.dictionary_items(id),
	CONSTRAINT cor_inv_pos_fk FOREIGN KEY (position_id) REFERENCES emsadm.cor_investment_positions(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_inv_founding_source.id is 'Founding source PK';
COMMENT on COLUMN cor_inv_founding_source.so_am_awa_net is 'Founding source amount requested net';
COMMENT on COLUMN cor_inv_founding_source.so_ex_plan_net is 'Founding source expenses plan net';
COMMENT on COLUMN cor_inv_founding_source.type_id is 'Type ID FK from dictionary dicFunSour';
COMMENT on COLUMN cor_inv_founding_source.position_id is 'Position ID FK cor_investment_positions';
/

/*Create the table of Public Procurement Application */
DROP TABLE emsadm.cor_pub_proc_application CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_proc_application(
    id NUMBER(19,0) NOT NULL,
    apl_number VARCHAR2(22),
    apl_mode VARCHAR2(2) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    status VARCHAR2(2) NOT NULL,
    reason_not_included VARCHAR2(256),
    ordered_object VARCHAR2(256) NOT NULL,
    is_combined NUMBER(1) NOT NULL,
    order_realization_term VARCHAR2(20),
    estimation_type VARCHAR(5),
    order_value_net NUMBER(20,5),
    order_value_gross NUMBER(20,5),
    is_parts NUMBER(1),
    order_reason_lack_parts VARCHAR2(256),
    cpv VARCHAR2(256),
    order_value_based VARCHAR2(256),
    order_value_setting_person VARCHAR2(100),
    date_established_value DATE,
    justification_purchase VARCHAR2(256),
    order_description VARCHAR2(256),
    persons_prep_description VARCHAR2(100),
    requirements_variant_bids VARCHAR2(256),
    proposed_ordering_procedure VARCHAR2(256),
    persons_prep_justification VARCHAR2(100),
    order_contractor_name VARCHAR2(256),
    persons_choosing_contractor VARCHAR2(100),
    order_contractor_conditions  VARCHAR2(256),
    persons_preparing_conditions VARCHAR2(100),
    order_important_records VARCHAR2(256),
    persons_preparing_criteria VARCHAR2(100),
    tender_committee VARCHAR2(256),
    warranty_requirements VARCHAR2(256),
    description VARCHAR2(256),
    coordinator_id VARCHAR2(10) NOT NULL,
    coordinator_combined_id VARCHAR2(10),
    create_user_id NUMBER(19,0) NOT NULL,
    send_user_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_apl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_apl_cor_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code),
    CONSTRAINT cor_pub_proc_apl_cor_comb_fk FOREIGN KEY (coordinator_combined_id) REFERENCES organization_units(code),
    CONSTRAINT cor_pub_proc_apl_create_usr_fk FOREIGN KEY (create_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_application.id is 'Public Procurement application PK';
COMMENT on COLUMN cor_pub_proc_application.apl_number is 'Public Procurement application number';
COMMENT on COLUMN cor_pub_proc_application.apl_mode is 'Application procedure PL - planned, NP - unplanned';
COMMENT on COLUMN cor_pub_proc_application.create_date is 'Public Procurement application create date';
COMMENT on COLUMN cor_pub_proc_application.send_date is 'Public Procurement application send date';
COMMENT on COLUMN cor_pub_proc_application.status is 'Public Procurement application status';
COMMENT on COLUMN cor_pub_proc_application.estimation_type is 'Public Procurement application estimation type';
COMMENT on COLUMN cor_pub_proc_application.reason_not_included is 'Reason not included in plan public procurement';
COMMENT on COLUMN cor_pub_proc_application.ordered_object is 'Public Procurement application ordered object';
COMMENT on COLUMN cor_pub_proc_application.is_combined is 'Public Procurement application combined with other coordinator';
COMMENT on COLUMN cor_pub_proc_application.order_realization_term is 'Public Procurement application realizarion term';
COMMENT on COLUMN cor_pub_proc_application.order_value_net is 'Public Procurement application order value net';
COMMENT on COLUMN cor_pub_proc_application.order_value_gross is 'Public Procurement application order value gross';
COMMENT on COLUMN cor_pub_proc_application.is_parts is 'Public Procurement application order is divided into parts';
COMMENT on COLUMN cor_pub_proc_application.order_reason_lack_parts is 'Public Procurement application the reason why it does not break into parts';
COMMENT on COLUMN cor_pub_proc_application.cpv is 'Public Procurement application cpv';
COMMENT on COLUMN cor_pub_proc_application.order_value_based is 'The basis for determining the value of the contract';
COMMENT on COLUMN cor_pub_proc_application.order_value_setting_person is 'Person who sets value';
COMMENT on COLUMN cor_pub_proc_application.date_established_value is 'Date of establishing value';
COMMENT on COLUMN cor_pub_proc_application.justification_purchase is 'Public Procurement application justification purchase';
COMMENT on COLUMN cor_pub_proc_application.order_description is 'Public Procurement application order description';
COMMENT on COLUMN cor_pub_proc_application.persons_prep_description is 'Persons preparing order description';
COMMENT on COLUMN cor_pub_proc_application.requirements_variant_bids is 'Requirements for variants bids';
COMMENT on COLUMN cor_pub_proc_application.proposed_ordering_procedure is 'Proposed ordering procedure';
COMMENT on COLUMN cor_pub_proc_application.persons_prep_justification is 'Persons preparing the justification for the award procedure';
COMMENT on COLUMN cor_pub_proc_application.order_contractor_name is 'Persons choosing the contractor invited to submit tenders';
COMMENT on COLUMN cor_pub_proc_application.persons_choosing_contractor is 'Persons choosing the invited contractor';
COMMENT on COLUMN cor_pub_proc_application.order_contractor_conditions is 'Conditions that must be met by the contractor';
COMMENT on COLUMN cor_pub_proc_application.persons_preparing_conditions is 'Persons preparing a description of the assessment of meeting the conditions for participation in the procedure';
COMMENT on COLUMN cor_pub_proc_application.order_important_records is 'Significant provisions related to the subject of the contract';
COMMENT on COLUMN cor_pub_proc_application.persons_preparing_criteria is 'Persons preparing application criteria';
COMMENT on COLUMN cor_pub_proc_application.tender_committee is 'Persons proposed for the composition of the tender committee';
COMMENT on COLUMN cor_pub_proc_application.warranty_requirements is 'Warranty requirements';
COMMENT on COLUMN cor_pub_proc_application.description is 'Public Procurement description';
COMMENT on COLUMN cor_pub_proc_application.coordinator_id is 'Application coordinator FK (organization_units)';
COMMENT on COLUMN cor_pub_proc_application.coordinator_combined_id is 'Application coordinator combined FK (organization_units';
COMMENT on COLUMN cor_pub_proc_application.create_user_id is 'Application create user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.send_user_id is 'Application send user FK (users)';

/*Create the table of Public Procurement Application Assortments Groups */
DROP TABLE emsadm.cor_pub_proc_groups CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_proc_groups(
    id NUMBER(19,0) NOT NULL,
    order_group_value_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    order_group_value_gross NUMBER(20,5),
    order_value_year_net NUMBER(20,5) NOT NULL,
    order_value_year_gross NUMBER(20,5),
    plan_position_id NUMBER(19,0) NOT NULL,
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_group_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_group_plan_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT cor_pub_proc_group_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_groups.id is 'Public Procurement group PK';
COMMENT on COLUMN cor_pub_proc_groups.order_group_value_net is 'Net value of the order within the group';
COMMENT on COLUMN cor_pub_proc_groups.vat is 'Value of VAT for the group';
COMMENT on COLUMN cor_pub_proc_groups.order_group_value_gross is 'Gross value of the order within the group';
COMMENT on COLUMN cor_pub_proc_groups.order_value_year_net is 'Net value to spend in the current year';
COMMENT on COLUMN cor_pub_proc_groups.order_value_year_gross is 'Gross value to spend in the current year';
COMMENT on COLUMN cor_pub_proc_groups.plan_position_id is 'Plan public procurement position FK';
COMMENT on COLUMN cor_pub_proc_groups.application_id is 'Public procurement application FK';
/
/*Create the table of Public Procurement Application Parts */
DROP TABLE emsadm.cor_pub_proc_parts CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_proc_parts(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(120) NOT NULL,
    amount_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    amount_gross NUMBER(20,5) NOT NULL,
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_part_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_part_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_parts.id is 'Public Procurement part PK';
COMMENT on COLUMN cor_pub_proc_parts.name is 'Public Procurement part name';
COMMENT on COLUMN cor_pub_proc_parts.amount_net is 'Net amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.vat is 'The VAT value of the part';
COMMENT on COLUMN cor_pub_proc_parts.amount_gross is 'Gross amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.application_id is 'Public procurement application FK';
/
/*Create the table of Public Procurement Application Criteria */
DROP TABLE emsadm.cor_pub_proc_criteria CASCADE CONSTRAINTS PURGE;
/
CREATE TABLE emsadm.cor_pub_proc_criteria(
    id NUMBER(19,0) NOT NULL,
    value NUMBER(3,0) NOT NULL,
    name  VARCHAR2(120) NOT NULL,
    scoring_description VARCHAR2(256),
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_criterion_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_criterion_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_criteria.id is 'Public Procurement criterion PK';
COMMENT on COLUMN cor_pub_proc_criteria.value is 'ApplicationCriterion value in %';
COMMENT on COLUMN cor_pub_proc_criteria.name is 'ApplicationCriterion name';
COMMENT on COLUMN cor_pub_proc_criteria.scoring_description is 'Scoring description';
COMMENT on COLUMN cor_pub_proc_criteria.application_id is 'Public procurement application FK';
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------Sequence Module APPLICANT---------------------------------------------------*/

-- Create sequence of table application
DROP SEQUENCE application_seq;
/
CREATE SEQUENCE application_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/

-- Create sequence of table application positions
DROP SEQUENCE application_pos_seq;
/
CREATE SEQUENCE application_pos_seq START WITH 2 INCREMENT BY 1 NOMAXVALUE;
/

/*-----------------------------------------Sequence Module ACCOUNTANT--------------------------------------------------*/

-- Create sequence of table costs type
DROP SEQUENCE acc_costs_type_seq;
/
CREATE SEQUENCE acc_costs_type_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/

-- Create sequence of table cost year
DROP SEQUENCE acc_cost_years_seq;
/
CREATE SEQUENCE acc_cost_years_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/

/*-----------------------------------------Sequence Module COORDINATOR-------------------------------------------------*/

-- Create sequence of table coordinator plan
DROP SEQUENCE cor_plan_seq;
/
CREATE SEQUENCE cor_plan_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/

-- Create sequence of table coordinator plan position
DROP SEQUENCE cor_plan_pos_seq;
/
CREATE SEQUENCE cor_plan_pos_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

---- Create sequence of table coordinator plan position
--DROP SEQUENCE cor_pos_inv_source_seq;
/
--CREATE SEQUENCE cor_pos_inv_source_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- Create sequence of table coordinator plan sub position
DROP SEQUENCE cor_plan_sub_pos_seq;
/
CREATE SEQUENCE cor_plan_sub_pos_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- Create sequence of table coordinator public procurement application
DROP SEQUENCE cor_pub_proc_apl_seq;
/
CREATE SEQUENCE cor_pub_proc_apl_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- Create sequence of table coordinator public procurement application
DROP SEQUENCE cor_pub_proc_apl_groups_seq;
/
CREATE SEQUENCE cor_pub_proc_apl_groups_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- Create sequence of table coordinator public procurement application
DROP SEQUENCE cor_pub_proc_apl_parts_seq;
/
CREATE SEQUENCE cor_pub_proc_apl_parts_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;

-- Create sequence of table coordinator public procurement application
DROP SEQUENCE cor_pub_proc_apl_criteria_seq;
/
CREATE SEQUENCE cor_pub_proc_apl_criteria_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE;
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   PACKAGES                                           		       */
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
/* Create package Coordinator Public Procurement management*/
CREATE OR REPLACE PACKAGE cor_public_procurement_mgmt AS
    PROCEDURE generate_application_number(coordinator IN VARCHAR2, application_mode IN varchar2, new_number OUT VARCHAR2);
END cor_public_procurement_mgmt;
/
CREATE OR REPLACE PACKAGE BODY cor_public_procurement_mgmt AS
    PROCEDURE generate_application_number(coordinator IN VARCHAR2, application_mode IN varchar2, new_number OUT VARCHAR2)
        AS
            last_application_number emsadm.cor_pub_proc_application.apl_number%TYPE;
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

            SELECT apl_number
            INTO last_application_number
            FROM (SELECT *
                    FROM cor_pub_proc_application apl
                        WHERE
                            apl.coordinator_id = coordinator AND
                            apl.create_date BETWEEN first_day AND last_day AND
                            apl.apl_mode = application_mode AND
                            apl.apl_number is not null
                                ORDER BY apl.id DESC)
            WHERE ROWNUM <= 1;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    last_application_number := NULL;

            SELECT EXTRACT(YEAR FROM sysdate)
            INTO year
            FROM dual;

            IF last_application_number IS NULL THEN
                last_number := 1;
            ELSE
                last_number:=TO_NUMBER(SUBSTR(last_application_number, 0, INSTR(last_application_number, '/')-1))+1;
            END IF;

            new_number := last_number || '/' || application_mode || '/' || UPPER(coordinator) || '/' || year;

        END;

END cor_public_procurement_mgmt;
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