/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */

/*-----------------------------------------Tables Module ADMINISTRATOR-------------------------------------------------*/

/*Create the table of organization units*/
drop table emsadm.organization_units cascade constraints purge;
/
create TABLE emsadm.organization_units
(
	code VARCHAR2(10) NOT NULL ,
    office_symbol varchar2(3),
	name VARCHAR2(120) NOT NULL ,
	short_name VARCHAR2(80) NOT NULL ,
	role VARCHAR2(11),
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
	CONSTRAINT ou_director_fk FOREIGN KEY (director_id) REFERENCES emsadm.organization_units(code)
)
TABLESPACE ems_data;

-- Add comments to the columns
COMMENT on COLUMN organization_units.code is 'Unit code';
COMMENT on COLUMN organization_units.office_symbol is 'Unit office symbol';
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
COMMENT on COLUMN organization_units.parent is 'Unit parent organization unit';
COMMENT on COLUMN organization_units.director_id is 'Director unit for coordinator';

/*Grant permissions on table organization_units for the user emsarch*/
grant select, REFERENCES ON emsadm.organization_units TO emsarch;
/

/*-----------------------------------------Tables Module APPLICANT----------------------------------------------------*/

/*Create the table of Application on module Applicant*/
drop table emsadm.application cascade constraints purge;
/
create TABLE emsadm.application (
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
drop table emsadm.application_positions cascade constraints purge;
/
create TABLE emsadm.application_positions (
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
drop table emsadm.acc_costs_type cascade constraints purge;
/

create TABLE emsadm.acc_costs_type (
    id NUMBER(19,0) NOT NULL,
    cost_number VARCHAR(75) NOT NULL,
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
drop table emsadm.acc_cost_years cascade constraints purge;
/

create TABLE emsadm.acc_cost_years (
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
drop table emsadm.acc_cost_years_coordinators cascade constraints purge;
/

create TABLE emsadm.acc_cost_years_coordinators (
    cost_year_id NUMBER(19,0) NOT NULL,
    coordinator_id VARCHAR2(10) NOT NULL,
    CONSTRAINT acc_cost_years_coordinators_pk PRIMARY KEY(cost_year_id, coordinator_id),
    CONSTRAINT acc_cost_years_year_fk FOREIGN KEY (cost_year_id) REFERENCES acc_cost_years(id),
    CONSTRAINT acc_cost_years_coordinator_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code)

)
TABLESPACE ems_data;

COMMENT on COLUMN acc_cost_years_coordinators.cost_year_id is 'Cost Year ID';
COMMENT on COLUMN acc_cost_years_coordinators.coordinator_id is 'Organization Units Coordinator ID';
/

/*Create the table of Institution plans in module Accountant*/
drop table emsadm.acc_institution_plans cascade constraints purge;
/
create TABLE emsadm.acc_institution_plans(
    id NUMBER(19,0) NOT NULL,
    year INTEGER NULL,
    status VARCHAR(2) NOT NULL,
    plan_type VARCHAR(3) NOT NULL,
    plan_approve_user_id NUMBER(19,0),
    economic_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    plan_correction_id NUMBER(19,0),
    CONSTRAINT acc_institution_plan_pk PRIMARY KEY(id),
    CONSTRAINT acc_inst_plan_approve_usr_fk FOREIGN KEY (plan_approve_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT acc_inst_plan_economic_usr_fk FOREIGN KEY (economic_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT acc_inst_plan_chief_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT acc_inst_correction_plan_fk FOREIGN KEY (plan_correction_id) REFERENCES emsadm.acc_institution_plans(id)
)
TABLESPACE ems_data;
COMMENT on COLUMN acc_institution_plans.id is 'Plan ID';
COMMENT on COLUMN acc_institution_plans.year is 'Year of the plan validity';
COMMENT on COLUMN acc_institution_plans.status is 'Plan status';
COMMENT on COLUMN acc_institution_plans.plan_type is 'Plan type in (FIN, INW)';
COMMENT on COLUMN acc_institution_plans.plan_approve_user_id is 'Plan aprove user ID (FK -> Users)';
COMMENT on COLUMN acc_institution_plans.chief_accept_user_id is 'Plan chief accept user ID (FK -> Users)';
COMMENT on COLUMN acc_institution_plans.plan_correction_id is 'Plan corretion ID (FK -> acc_institution_plans)';
/

/*Create the table of institution plans positions on module Accountant*/
drop table emsadm.acc_institution_plan_positions cascade constraints purge;
/
create TABLE emsadm.acc_institution_plan_positions(
    id NUMBER(19,0) NOT NULL,
    status VARCHAR(2) NOT NULL,
    am_req_net NUMBER(20,5) NOT NULL,
    am_req_gross NUMBER(20,5) NOT NULL,
    am_awa_net NUMBER(20,5),
    am_awa_gross NUMBER(20,5),
    am_rea_net NUMBER(20,5),
    am_rea_gross NUMBER(20,5),
    pos_correction_id NUMBER(19,0),
    plan_id NUMBER(19,0) NOT NULL,
    CONSTRAINT acc_inst_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT acc_ins_plan_fk FOREIGN KEY (plan_id) REFERENCES emsadm.acc_institution_plans(id),
    CONSTRAINT acc_inst_correction_pos_fk FOREIGN KEY (pos_correction_id) REFERENCES emsadm.acc_institution_plan_positions(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN acc_institution_plan_positions.id is 'Position ID';
COMMENT on COLUMN acc_institution_plan_positions.status is 'Position status in (DO,ZA,SK,RE,ZR)';
COMMENT on COLUMN acc_institution_plan_positions.am_req_net is 'Position amount requested net';
COMMENT on COLUMN acc_institution_plan_positions.am_req_gross is 'Position amount requested gross';
COMMENT on COLUMN acc_institution_plan_positions.am_awa_net is 'Position amount awared net';
COMMENT on COLUMN acc_institution_plan_positions.am_awa_gross is 'Position amount awared gross';
COMMENT on COLUMN acc_institution_plan_positions.am_rea_net is 'Position amount realized net';
COMMENT on COLUMN acc_institution_plan_positions.am_rea_gross is 'Position amount realized gross';
COMMENT on COLUMN acc_institution_plan_positions.pos_correction_id is 'Position corection ID (FK -> acc_institution_plan_positions)';
COMMENT on COLUMN acc_institution_plan_positions.plan_id is 'Plan Institution ID (FK -> acc_institution_plans)';
/

/*Create the table of Institution Plans Positions Financial on module Accountant*/
drop table emsadm.acc_institution_plan_pos_fin cascade constraints purge;
/
create TABLE emsadm.acc_institution_plan_pos_fin(
    id NUMBER(19,0) NOT NULL,
    cost_type_id NUMBER(19,0) NOT NULL,
	CONSTRAINT acc_inst_fin_pos_pk PRIMARY KEY(id),
	CONSTRAINT acc_inst_pos_fk FOREIGN KEY (id) REFERENCES emsadm.acc_institution_plan_positions(id),
	CONSTRAINT acc_inst_fin_pos_cost_fk FOREIGN KEY (cost_type_id) REFERENCES emsadm.acc_costs_type(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN acc_institution_plan_pos_fin.id is 'Instituton financial position ID PK and FK';
COMMENT on COLUMN acc_institution_plan_pos_fin.cost_type_id is 'Position Cost Type ID';
/


drop table emsadm.acc_institution_plan_cor_pos cascade constraints purge;
/
create TABLE emsadm.acc_institution_plan_cor_pos(
    id NUMBER(19,0) NOT NULL,
    cor_position_id NUMBER(19,0) NOT NULL,
    pos_correction_id NUMBER(19,0),
    institution_position_id NUMBER(19,0),
    CONSTRAINT acc_inst_plan_cor_pos_pk PRIMARY KEY(id),
    CONSTRAINT acc_inst_cor_pos_fk FOREIGN KEY (cor_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT acc_inst_cor_correction_pos_fk FOREIGN KEY (pos_correction_id) REFERENCES emsadm.acc_institution_plan_cor_pos(id),
    CONSTRAINT acc_ins_plan_pos_fk FOREIGN KEY (institution_position_id) REFERENCES emsadm.acc_institution_plan_positions(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN acc_institution_plan_cor_pos.id is 'Institution Coordinator position ID';
COMMENT on COLUMN acc_institution_plan_cor_pos.cor_position_id is 'Coordinstor plan position ID (FK -> cor_plan_positions)';
COMMENT on COLUMN acc_institution_plan_cor_pos.pos_correction_id is 'Institution Coordinator plan position corection ID (FK -> acc_institution_plan_cor_pos)';
COMMENT on COLUMN acc_institution_plan_cor_pos.institution_position_id is 'Institution position ID (FK -> acc_institution_plan_positions)';
/
/*-----------------------------------------Tables Module COORDINATOR----------------------------------------------------*/

/*Create the table of Plans on module Coordinator*/
drop table emsadm.cor_plans cascade constraints purge;
/
create TABLE emsadm.cor_plans(
    id NUMBER(19,0) NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(2) NOT NULL,
    plan_type VARCHAR(3) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    coordinator_id VARCHAR2(10) NOT NULL,
    send_user_id NUMBER(19,0),
    plan_accept_user_id NUMBER(19,0),
    public_accept_user_id NUMBER(19,0),
    director_accept_user_id NUMBER(19,0),
    economic_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    plan_correction_id NUMBER(19,0),
    update_number INTEGER,
	CONSTRAINT cor_plan_pk PRIMARY KEY(id),
	CONSTRAINT cor_plan_coordinator_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code),
	CONSTRAINT cor_plan_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_accept_usr_fk FOREIGN KEY (plan_accept_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_pub_accept_usr_fk FOREIGN KEY (public_accept_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_dir_accept_usr_fk FOREIGN KEY (director_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_plan_eco_accept_usr_fk FOREIGN KEY (economic_accept_user_id) REFERENCES emsarch.users(id),
	CONSTRAINT cor_plan_chf_accept_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_plan_year_type_cor_unq UNIQUE(year, plan_type, coordinator_id, plan_correction_id),
    CONSTRAINT cor_plan_correction_plan_fk FOREIGN KEY (plan_correction_id) REFERENCES emsadm.cor_plans(id)
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
COMMENT on COLUMN cor_plans.plan_accept_user_id is 'Plan accountant accept user (Users)';
COMMENT on COLUMN cor_plans.public_accept_user_id is 'Plan public procurement accept user (Users)';
COMMENT on COLUMN cor_plans.director_accept_user_id is 'Plan director accept user (Users)';
COMMENT on COLUMN cor_plans.chief_accept_user_id is 'Plan chief accept user (Users)';
COMMENT on COLUMN cor_plans.plan_correction_id is 'Plan corretion ID (FK -> cor_plans)';
/

/*Create the table of Plans Positions on module Coordinator*/
drop table emsadm.cor_plan_positions cascade constraints purge;
/
create TABLE emsadm.cor_plan_positions(
    id NUMBER(19,0) NOT NULL,
    status VARCHAR(2) NOT NULL,
    am_req_net NUMBER(20,5),
    am_req_gross NUMBER(20,5),
    am_awa_net NUMBER(20,5),
    am_awa_gross NUMBER(20,5),
    am_rea_net NUMBER(20,5),
    am_rea_gross NUMBER(20,5),
    vat NUMBER(3,2) NOT NULL,
    desc_coordinator VARCHAR2(256),
    desc_management VARCHAR2(256),
    plan_id NUMBER(19,0) NOT NULL,
    pos_correction_id NUMBER(19,0),
	CONSTRAINT cor_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_plan_pos_fk FOREIGN KEY (plan_id) REFERENCES emsadm.cor_plans(id),
	CONSTRAINT cor_plan_correction_pos_fk FOREIGN KEY (pos_correction_id) REFERENCES emsadm.cor_plan_positions(id)
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
COMMENT on COLUMN cor_plan_positions.vat is 'Position vat value';
COMMENT on COLUMN cor_plan_positions.desc_coordinator is 'Coordinator description';
COMMENT on COLUMN cor_plan_positions.desc_management is 'Management description';
COMMENT on COLUMN cor_plan_positions.plan_id is 'Plan ID foregin key cor_plans';
COMMENT on COLUMN cor_plan_positions.pos_correction_id is 'Position corection ID (FK -> cor_plan_positions)';

/*Create the table of Plans Positions Financial on module Coordinator*/
drop table emsadm.cor_financial_positions cascade constraints purge;
/
create TABLE emsadm.cor_financial_positions(
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
drop table emsadm.cor_pub_procurement_positions cascade constraints purge;
/
create TABLE emsadm.cor_pub_procurement_positions(
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
drop table emsadm.cor_investment_positions cascade constraints purge;
/
create TABLE emsadm.cor_investment_positions(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(200),
    task VARCHAR(200) NOT NULL,
    application VARCHAR(200),
    substantiation VARCHAR(200),
    realization_date DATE NOT NULL,
    category_id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_inv_pos_pk PRIMARY KEY(id),
	CONSTRAINT cor_inv_fk FOREIGN KEY (id) REFERENCES emsadm.cor_plan_positions(id),
	CONSTRAINT cor_inv_category_fk FOREIGN KEY (category_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_investment_positions.id is 'Investment position ID PK and FK';
COMMENT on COLUMN cor_investment_positions.name is 'Position accountant task name';
COMMENT on COLUMN cor_investment_positions.task is 'Position coordinator task name';
COMMENT on COLUMN cor_investment_positions.application is 'Position application';
COMMENT on COLUMN cor_investment_positions.substantiation is 'Position substantiation';
COMMENT on COLUMN cor_investment_positions.realization_date is 'Realized position date';
COMMENT on COLUMN cor_investment_positions.category_id is 'Position category (FK -> slKatSlInw)';

/*Create the table of Plans Sub Positions on module Coordinator*/
drop table emsadm.cor_plan_sub_positions cascade constraints purge;
/
create TABLE emsadm.cor_plan_sub_positions(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR(200) NOT NULL,
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

/*Create the table of Plan Sub Positions Financial on module Coordinator*/
drop table emsadm.cor_financial_sub_positions cascade constraints purge;
/
create TABLE emsadm.cor_financial_sub_positions(
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

/*Create the table of Plan Sub Positions Public Procurement on module Coordinator*/
drop table emsadm.cor_pub_sub_proc_positions cascade constraints purge;
/
create TABLE emsadm.cor_pub_sub_proc_positions(
    id NUMBER(19,0) NOT NULL,
	CONSTRAINT cor_pub_proc_sub_pos_pk PRIMARY KEY(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_sub_proc_positions.id is 'Financial position ID PK and FK';
/

/* Create the table of Plan Sub Positions Investment on module Coordinator */
drop table emsadm.cor_inv_sub_positions cascade constraints purge;
/

create TABLE emsadm.cor_inv_sub_positions(
    id NUMBER(19,0) NOT NULL,
    quantity NUMBER(8,0) NOT NULL,
    target_unit VARCHAR2(10),
    CONSTRAINT cor_inv_sub_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_inv_target_unit_fk FOREIGN KEY (target_unit) REFERENCES emsadm.organization_units(code)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_inv_sub_positions.id is 'Investment sub position ID PK and FK';
COMMENT on COLUMN cor_inv_sub_positions.quantity is 'Quantity per target unit';
COMMENT on COLUMN cor_inv_sub_positions.target_unit is 'Target Unit FK (FK -> organization_units)';
/

/*Create the table of Plans Positions Investment Founding Source */
drop table emsadm.cor_inv_founding_source cascade constraints purge;
/
create TABLE emsadm.cor_inv_founding_source(
    id NUMBER(19,0) NOT NULL,
    so_am_net NUMBER(20,5) NOT NULL,
    so_am_gross NUMBER(20,5) NOT NULL,
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
drop table emsadm.cor_pub_proc_application cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_application(
    id NUMBER(19,0) NOT NULL,
    apl_number VARCHAR2(22),
    apl_mode VARCHAR2(2) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    status VARCHAR2(2) NOT NULL,
    reason_not_included_id NUMBER(19,0),
    ordered_object_id NUMBER(19,0) NOT NULL,
    is_combined NUMBER(1) NOT NULL,
    order_realization_term VARCHAR2(20),
    estimation_type VARCHAR(5),
    is_art30 NUMBER(1),
    order_value_net NUMBER(20,5),
    order_value_gross NUMBER(20,5),
    is_parts NUMBER(1),
    order_reason_lack_parts_id NUMBER(19,0),
    cpv VARCHAR2(200),
    order_value_based VARCHAR2(200),
    order_value_setting_person VARCHAR2(200),
    date_established_value DATE,
    justification_purchase_id NUMBER(19,0),
    order_description_id NUMBER(19,0),
    persons_prep_description VARCHAR2(200),
    requirements_variant_bids_id NUMBER(19,0),
    proposed_ordering_proc_id NUMBER(19,0),
    persons_prep_justification VARCHAR2(200),
    order_contractor_name VARCHAR2(200),
    persons_choosing_contractor VARCHAR2(200),
    order_contra_conditions_id  NUMBER(19,0),
    persons_preparing_conditions VARCHAR2(200),
    order_important_records_id NUMBER(19,0),
    persons_preparing_criteria VARCHAR2(200),
    tender_committee_id NUMBER(19,0),
    warranty_requirements_id NUMBER(19,0),
    description_id NUMBER(19,0),
    order_included_plan_type VARCHAR(3) NOT NULL,
    contractor_contract_id NUMBER(19,0),
    offer_price_gross NUMBER(19,0),
    performed_activities_id NUMBER(19,0),
    just_choosing_offer_id NUMBER(19,0),
    just_non_competitive_proc_id NUMBER(19,0),
    conditions_participation_id NUMBER(19,0),
    is_market_consultation NUMBER(1),
    is_order_financed NUMBER(1),
    coordinator_id VARCHAR2(10) NOT NULL,
    coordinator_combined_id VARCHAR2(10),
    create_user_id NUMBER(19,0) NOT NULL,
    send_user_id NUMBER(19,0),
    public_accept_user_id NUMBER(19,0),
    director_accept_user_id NUMBER(19,0),
    accountant_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    cancel_user_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_apl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_apl_cor_fk FOREIGN KEY (coordinator_id) REFERENCES organization_units(code),
    CONSTRAINT cor_pub_proc_apl_cor_comb_fk FOREIGN KEY (coordinator_combined_id) REFERENCES organization_units(code),
    CONSTRAINT cor_pub_proc_apl_create_usr_fk FOREIGN KEY (create_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_pub_usr_fk FOREIGN KEY (public_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_dir_usr_fk FOREIGN KEY (director_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_acc_usr_fk FOREIGN KEY (accountant_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_chf_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id)
    CONSTRAINT cor_pub_proc_apl_can_usr_fk FOREIGN KEY (cancel_user_id) REFERENCES emsarch.users(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_application.id is 'Public Procurement application PK';
COMMENT on COLUMN cor_pub_proc_application.apl_number is 'Public Procurement application number';
COMMENT on COLUMN cor_pub_proc_application.apl_mode is 'Application procedure PL - planned, NP - unplanned';
COMMENT on COLUMN cor_pub_proc_application.create_date is 'Public Procurement application create date';
COMMENT on COLUMN cor_pub_proc_application.send_date is 'Public Procurement application send date';
COMMENT on COLUMN cor_pub_proc_application.status is 'Public Procurement application status';
COMMENT on COLUMN cor_pub_proc_application.estimation_type is 'Public Procurement application estimation type';
COMMENT on COLUMN cor_pub_proc_application.reason_not_included_id is 'Reason not included in plan public procurement (text)';
COMMENT on COLUMN cor_pub_proc_application.ordered_object_id is 'Public Procurement application ordered object (text)';
COMMENT on COLUMN cor_pub_proc_application.is_combined is 'Public Procurement application combined with other coordinator';
COMMENT on COLUMN cor_pub_proc_application.order_realization_term is 'Public Procurement application realizarion term';
COMMENT on COLUMN cor_pub_proc_application.is_Art30 is 'Public Procurement application is Art 30';
COMMENT on COLUMN cor_pub_proc_application.order_value_net is 'Public Procurement application order value net';
COMMENT on COLUMN cor_pub_proc_application.order_value_gross is 'Public Procurement application order value gross';
COMMENT on COLUMN cor_pub_proc_application.is_parts is 'Public Procurement application order is divided into parts';
COMMENT on COLUMN cor_pub_proc_application.order_reason_lack_parts_id is 'Public Procurement application the reason why it does not break into parts (text)';
COMMENT on COLUMN cor_pub_proc_application.cpv is 'Public Procurement application cpv';
COMMENT on COLUMN cor_pub_proc_application.order_value_based is 'The basis for determining the value of the contract';
COMMENT on COLUMN cor_pub_proc_application.order_value_setting_person is 'Person who sets value';
COMMENT on COLUMN cor_pub_proc_application.date_established_value is 'Date of establishing value';
COMMENT on COLUMN cor_pub_proc_application.justification_purchase_id is 'Public Procurement application justification purchase (text)';
COMMENT on COLUMN cor_pub_proc_application.order_description_id is 'Public Procurement application order description (text)';
COMMENT on COLUMN cor_pub_proc_application.persons_prep_description is 'Persons preparing order description';
COMMENT on COLUMN cor_pub_proc_application.requirements_variant_bids_id is 'Requirements for variants bids (text)';
COMMENT on COLUMN cor_pub_proc_application.proposed_ordering_proc_id is 'Proposed ordering procedure (text)';
COMMENT on COLUMN cor_pub_proc_application.persons_prep_justification is 'Persons preparing the justification for the award procedure';
COMMENT on COLUMN cor_pub_proc_application.order_contractor_name is 'Persons choosing the contractor invited to submit tenders';
COMMENT on COLUMN cor_pub_proc_application.persons_choosing_contractor is 'Persons choosing the invited contractor';
COMMENT on COLUMN cor_pub_proc_application.order_contra_conditions_id is 'Conditions that must be met by the contractor (text)';
COMMENT on COLUMN cor_pub_proc_application.persons_preparing_conditions is 'Persons preparing a description of the assessment of meeting the conditions for participation in the procedure';
COMMENT on COLUMN cor_pub_proc_application.order_important_records_id is 'Significant provisions related to the subject of the contract (text)';
COMMENT on COLUMN cor_pub_proc_application.persons_preparing_criteria is 'Persons preparing application criteria';
COMMENT on COLUMN cor_pub_proc_application.tender_committee_id is 'Persons proposed for the composition of the tender committee (text)';
COMMENT on COLUMN cor_pub_proc_application.warranty_requirements_id is 'Warranty requirements (text)';
COMMENT on COLUMN cor_pub_proc_application.description_id is 'Public Procurement description (text)';
COMMENT on COLUMN cor_pub_proc_application.order_included_plan_type is 'Public Procurement application order included in plan FIN or INW';
COMMENT on COLUMN cor_pub_proc_application.contractor_contract_id is 'Public Procurement application contractor contract (text) - DO50';
COMMENT on COLUMN cor_pub_proc_application.offer_price_gross is 'Public Procurement application offer price gross - DO50';
COMMENT on COLUMN cor_pub_proc_application.performed_activities_id is 'Public Procurement application performed activities (text) - DO50';
COMMENT on COLUMN cor_pub_proc_application.just_choosing_offer_id is 'Public Procurement application justification choosing offer (text) - DO50';
COMMENT on COLUMN cor_pub_proc_application.just_non_competitive_proc_id is 'Public Procurement application justification non competitive procedure (text) - D0130';
COMMENT on COLUMN cor_pub_proc_application.conditions_participation_id is 'Public Procurement application conditions participation (text) - PO130';
COMMENT on COLUMN cor_pub_proc_application.is_market_consultation is 'Public Procurement application is market consultation - PO130';
COMMENT on COLUMN cor_pub_proc_application.is_order_financed is 'Public Procurement application is order financed - PO130';
COMMENT on COLUMN cor_pub_proc_application.coordinator_id is 'Application coordinator FK (organization_units)';
COMMENT on COLUMN cor_pub_proc_application.coordinator_combined_id is 'Application coordinator combined FK (organization_units';
COMMENT on COLUMN cor_pub_proc_application.create_user_id is 'Application create user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.send_user_id is 'Application send user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.public_accept_user_id is 'Application public procurement accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.director_accept_user_id is 'Application director accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.accountant_accept_user_id is 'Application accountant accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.chief_accept_user_id is 'Application chief accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.cancel_user_id is 'Application cancel user FK (users)';

/*Create the table of Public Procurement Application Assortments Groups */
drop table emsadm.cor_pub_proc_groups cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_groups(
    id NUMBER(19,0) NOT NULL,
    order_group_value_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    order_group_value_gross NUMBER(20,5),
    order_value_year_net NUMBER(20,5) NULL,
    order_value_year_gross NUMBER(20,5),
    am_ctr_awa_net NUMBER(20,5),
    am_ctr_awa_gross NUMBER(20,5),
    plan_pub_proc_position_id NUMBER(19,0) NOT NULL,
    plan_position_id NUMBER(19,0) NULL,
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_group_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_group_proc_plan_pos_fk FOREIGN KEY (plan_pub_proc_position_id) REFERENCES emsadm.pub_institution_plan_pos(id),
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
COMMENT on COLUMN cor_pub_proc_groups.am_ctr_awa_net is 'Amount contract awarded net';
COMMENT on COLUMN cor_pub_proc_groups.am_ctr_awa_gross is 'Amount contract awarded gross';
COMMENT on COLUMN cor_pub_proc_groups.plan_pub_proc_position_id is 'Plan public procurement position FK';
COMMENT on COLUMN cor_pub_proc_groups.plan_position_id is 'Plan financial or inwestment position FK';
COMMENT on COLUMN cor_pub_proc_groups.application_id is 'Public procurement application FK';
/
/*Create the table of Public Procurement Application Assortments Groups Coordinator plan position FIN or INW*/
drop table emsadm.cor_pub_proc_gr_pos cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_gr_pos(
    id NUMBER(19,0) NOT NULL,
    pos_am_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    pos_am_gross NUMBER(20,5) NOT NULL,
    plan_position_id NUMBER(19,0) NOT NULL,
    apl_pub_proc_gr_id  NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_gr_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_gr_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT cor_pub_proc_gr_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id)
)TABLESPACE  ems_data;

COMMENT on COLUMN cor_pub_proc_gr_pos.id is 'Application Assortment Group Plan Position PK';
COMMENT on COLUMN cor_pub_proc_gr_pos.pos_am_net is 'Assortment group plan position value Net';
COMMENT on COLUMN cor_pub_proc_gr_pos.vat is 'VAT for the assortment group plan position';
COMMENT on COLUMN cor_pub_proc_gr_pos.pos_am_gross is 'Assortment group plan position value Gross';
COMMENT on COLUMN cor_pub_proc_gr_pos.plan_position_id is 'Plan financial or inwestment position FK';
COMMENT on COLUMN cor_pub_proc_gr_pos.apl_pub_proc_gr_id is 'Application assortment group FK';
/
/*Create the table of Public Procurement Application Parts */
drop table emsadm.cor_pub_proc_parts cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_parts(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(200) NOT NULL,
    amount_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    amount_gross NUMBER(20,5) NOT NULL,
    is_realized NUMBER(1),
    application_id NUMBER(19,0) NOT NULL,
    apl_pub_proc_gr_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_part_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_part_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id),
    CONSTRAINT cor_pub_proc_part_gr_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_parts.id is 'Public Procurement part PK';
COMMENT on COLUMN cor_pub_proc_parts.name is 'Public Procurement part name';
COMMENT on COLUMN cor_pub_proc_parts.amount_net is 'Net amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.vat is 'The VAT value of the part';
COMMENT on COLUMN cor_pub_proc_parts.amount_gross is 'Gross amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.is_realized is 'Is part realized in the application';
COMMENT on COLUMN cor_pub_proc_parts.application_id is 'Public procurement application FK';
COMMENT on COLUMN cor_pub_proc_parts.apl_pub_proc_gr_id is 'Public procurement application assortment group FK';
/
/*Create the table of Public Procurement Application Criteria */
drop table emsadm.cor_pub_proc_criteria cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_criteria(
    id NUMBER(19,0) NOT NULL,
    value NUMBER(3,0) NOT NULL,
    name  VARCHAR2(120) NOT NULL,
    scoring_description_id NUMBER(19,0),
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_criterion_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_criterion_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_criteria.id is 'Public Procurement criterion PK';
COMMENT on COLUMN cor_pub_proc_criteria.value is 'ApplicationCriterion value in %';
COMMENT on COLUMN cor_pub_proc_criteria.name is 'ApplicationCriterion name';
COMMENT on COLUMN cor_pub_proc_criteria.scoring_description_id is 'Scoring description (text)';
COMMENT on COLUMN cor_pub_proc_criteria.application_id is 'Public procurement application FK';
/
/* Create the table of Application Assortment Group Subsequent Year */
drop table emsadm.cor_pub_proc_group_sub_year cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_group_sub_year(
    id NUMBER(19,0) NOT NULL,
    year INTEGER NOT NULL,
    vat NUMBER(3,2) NULL,
    year_exp_value_net NUMBER(20,5) NOT NULL,
    year_exp_value_gross NUMBER(20,5) NOT NULL,
    apl_pub_proc_gr_id NUMBER(19,0) NULL,
    apl_gr_pl_pos_id NUMBER(19,0) NULL,
    CONSTRAINT cor_pub_proc_group_sub_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_group_sub_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id),
    CONSTRAINT apl_ass_gr_pl_pos_fk REFERENCES emsadm.cor_pub_proc_gr_pos(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_group_sub_year.id is 'Subsequent expenditure PK';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year is 'The year of the next expense';
COMMENT on COLUMN cor_pub_proc_group_sub_year.vat is 'VAT for the next expense';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year_exp_value_net is 'Subsequent expenditure value net';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year_exp_value_gross is 'Subsequent expenditure value gross';
COMMENT on COLUMN cor_pub_proc_group_sub_year.apl_pub_proc_gr_id is 'Public procurement application assortment group FK';
COMMENT on COLUMN cor_pub_proc_group_sub_year.apl_gr_pl_pos_id is 'Application assortment group plan position FK (ApplicationAssortmentGroupPlanPosition)';

/

/* Create the table of Public Procurement Protocol */
drop table emsadm.cor_pub_proc_protocol cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_protocol(
    id NUMBER(19,0) NOT NULL,
    status VARCHAR2(2) NOT NULL,
    email NUMBER(1),
    phone NUMBER(1),
    internet NUMBER(1),
    paper NUMBER(1),
    other NUMBER(1),
    other_desc_id NUMBER(19,0),
    renouncement NUMBER(1),
    non_comp_id NUMBER(19,0),
    received_offers_id NUMBER(19,0),
    just_choosing_off_id NUMBER(19,0),
    send_user_id NUMBER(19,0),
    public_accept_user_id NUMBER(19,0),
    accountant_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    contractor_id NUMBER(19,0),
    contractor_desc_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_prl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_prl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_acc_usr_fk FOREIGN KEY (accountant_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_pub_usr_fk FOREIGN KEY (public_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_chf_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_ctr_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id)

)TABLESPACE  ems_data;


COMMENT on COLUMN cor_pub_proc_protocol.id is 'Public procurement protocol PK';
COMMENT on COLUMN cor_pub_proc_protocol.status is 'Application protocol status';
COMMENT on COLUMN cor_pub_proc_protocol.email is 'Form price recognition - email';
COMMENT on COLUMN cor_pub_proc_protocol.phone is 'Form price recognition - phone';
COMMENT on COLUMN cor_pub_proc_protocol.internet is 'Form price recognition - internet';
COMMENT on COLUMN cor_pub_proc_protocol.paper is 'Form price recognition - paper';
COMMENT on COLUMN cor_pub_proc_protocol.other is 'Form price recognition - other';
COMMENT on COLUMN cor_pub_proc_protocol.other_desc_id is 'Form price recognition - other desc (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.renouncement is 'Form price recognition - renouncement';
COMMENT on COLUMN cor_pub_proc_protocol.non_comp_id is 'Justification of the non-competitive procedure (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.received_offers_id is 'Public Procurement application received offers (text)';
COMMENT on COLUMN cor_pub_proc_protocol.just_choosing_off_id is 'Public Procurement application justification purchase (text)';
COMMENT on COLUMN cor_pub_proc_protocol.send_user_id is 'Application send user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.public_accept_user_id is 'Application public procurement accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.accountant_accept_user_id is 'Application accountant accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.chief_accept_user_id is 'Application chief accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.contractor_id is 'Contractor FK (acc_contractors)';
COMMENT on COLUMN cor_pub_proc_protocol.contractor_desc_id is 'Contractor description (Text)';
/

/* Create the table of Contracts */
drop table emsadm.cor_real_contracts cascade constraints purge;
/
create TABLE emsadm.cor_real_contracts(
    id NUMBER(19,0) NOT NULL,
    ctr_number VARCHAR2(26) NOT NULL,
    sig_date DATE NOT NULL,
    sig_place VARCHAR2(30),
    period_from DATE NOT NULL,
    period_to DATE NOT NULL,
    ctr_object_id NUMBER(19,0) NOT NULL,
    ctr_val_net NUMBER(20,5) NOT NULL,
    ctr_val_gross NUMBER(20,5) NOT NULL,
    coordinator_id VARCHAR2(10) NOT NULL,
    contractor_id NUMBER(19,0) NOT NULL,
    representative VARCHAR2(50) NOT NULL,
    CONSTRAINT cor_real_ctr_pk PRIMARY KEY(id),
    CONSTRAINT cor_real_ctr_cor_fk FOREIGN KEY (coordinator_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT cor_real_ctr_crt_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id)
) TABLESPACE ems_data;

COMMENT on COLUMN cor_real_contracts.id is 'Contract PK';
COMMENT on COLUMN cor_real_contracts.ctr_number is 'Contract number';
COMMENT on COLUMN cor_real_contracts.sig_date is 'Contract signing date';
COMMENT on COLUMN cor_real_contracts.sig_place is 'Contract signing place';
COMMENT on COLUMN cor_real_contracts.period_from is 'Contract period validity from';
COMMENT on COLUMN cor_real_contracts.period_to is 'Contract period validity to';
COMMENT on COLUMN cor_real_contracts.ctr_object_id is 'Contract object (text)';
COMMENT on COLUMN cor_real_contracts.ctr_val_net is 'Contract value net';
COMMENT on COLUMN cor_real_contracts.ctr_val_gross is 'Contract value gross';
COMMENT on COLUMN cor_real_contracts.coordinator_id is 'Coordinator FK (organization_units)';
COMMENT on COLUMN cor_real_contracts.contractor_id is 'Contractor FK (acc_contractors)';
COMMENT on COLUMN cor_real_contracts.representative is 'Contractor representative';

/* Create the table of Invoices */
drop table emsadm.cor_real_invoices cascade constraints purge;
/
create TABLE emsadm.cor_real_invoices(
    id NUMBER(19,0) NOT NULL,
    inv_number VARCHAR2(26) NOT NULL,
    sell_date DATE NOT NULL,
    desc_id NUMBER(19,0),
    coordinator_id VARCHAR2(10) NOT NULL,
    contractor_id NUMBER(19,0) NOT NULL,
    pub_proc_app_id NUMBER(19,0),
    CONSTRAINT cor_real_inv_pk PRIMARY KEY(id),
    CONSTRAINT cor_real_inv_cor_fk FOREIGN KEY (coordinator_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT cor_real_inv_ctr_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id),
    CONSTRAINT cor_real_inv_pub_proc_apl_fk FOREIGN KEY (pub_proc_app_id) REFERENCES emsadm.cor_pub_proc_application(id)
)TABLESPACE  ems_data;

COMMENT on COLUMN cor_real_invoices.id is 'Invoice PK';
COMMENT on COLUMN cor_real_invoices.inv_number is 'Invoice number';
COMMENT on COLUMN cor_real_invoices.sell_date is 'Invoice sell date';
COMMENT on COLUMN cor_real_invoices.desc_id is 'Invoice description (text)';
COMMENT on COLUMN cor_real_invoices.coordinator_id is 'Coordinator FK (organization_units)';
COMMENT on COLUMN cor_real_invoices.contractor_id is 'Contractor FK (acc_contractors)';
COMMENT on COLUMN cor_real_invoices.pub_proc_app_id is 'Public procurenment application FK (cor_pub_proc_application)';
/
/* Create the table of Invoice positions */
drop table emsadm.cor_real_invoice_positions cascade constraints purge;
/
create TABLE emsadm.cor_real_invoice_positions(
    id NUMBER(19,0) NOT NULL,
    name_id NUMBER(19,0) NOT NULL,
    pos_incl_plan_type VARCHAR(3) NOT NULL,
    amount_net NUMBER(20,5) NOT NULL,
    amount_gross NUMBER(20,5) NOT NULL,
    desc_id NUMBER(19,0),
    plan_position_id NUMBER(19,0) NOT NULL,
    invoice_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_real_inv_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_real_inv_pos_pl_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT cor_real_inv_fk FOREIGN KEY (invoice_id) REFERENCES emsadm.cor_real_invoices(id)
)TABLESPACE  ems_data;

COMMENT on COLUMN cor_real_invoice_positions.id is 'Invoice PK';
COMMENT on COLUMN cor_real_invoice_positions.name_id is 'Invoice position name (text)';
COMMENT on COLUMN cor_real_invoice_positions.pos_incl_plan_type is 'Invoice position included in plan FIN or INW';
COMMENT on COLUMN cor_real_invoice_positions.amount_net is 'Invoice position amount net';
COMMENT on COLUMN cor_real_invoice_positions.amount_gross is 'Invoice position amount gross';
COMMENT on COLUMN cor_real_invoice_positions.desc_id is 'Invoice position description (text)';
COMMENT on COLUMN cor_real_invoice_positions.plan_position_id is 'Financial or inwestment plan position FK (cor_plan_positions)';
COMMENT on COLUMN cor_real_invoice_positions.invoice_id is 'Invoice FK (cor_real_invoices)';
/
/*-----------------------------------------Tables Module Public Procurement -------------------------------------------*/

/*Create the table of Institution Plans Positions Financial on module Accountant*/
drop table emsadm.pub_institution_plan_pos cascade constraints purge;
/
create TABLE emsadm.pub_institution_plan_pos(
    id NUMBER(19,0) NOT NULL,
    estimation_type VARCHAR(5) NOT NULL,
    order_type VARCHAR(3) NOT NULL,
    assortment_id NUMBER(19,0) NOT NULL,
	CONSTRAINT pub_inst_plan_pos_pk PRIMARY KEY(id),
	CONSTRAINT pub_inst_plan_pos_fk FOREIGN KEY (id) REFERENCES emsadm.acc_institution_plan_positions(id),
	CONSTRAINT pub_inst_plan_pos_assort_gr_fk FOREIGN KEY (assortment_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN pub_institution_plan_pos.id is 'Instituton financial position ID PK and FK';
COMMENT on COLUMN pub_institution_plan_pos.estimation_type is 'Position estimation type';
COMMENT on COLUMN pub_institution_plan_pos.order_type is 'Position order type';
COMMENT on COLUMN pub_institution_plan_pos.assortment_id is 'Position assortment group (FK -> slAsortGr)';
/
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------Sequence Module APPLICANT---------------------------------------------------*/

-- Create sequence of table application
drop sequence application_seq;
/
create sequence application_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table application positions
drop sequence application_pos_seq;
/
create sequence application_pos_seq start with 2 increment by 1 nomaxvalue;
/

/*-----------------------------------------Sequence Module ACCOUNTANT--------------------------------------------------*/

-- Create sequence of table costs type
drop sequence acc_costs_type_seq;
/
create sequence acc_costs_type_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table cost year
drop sequence acc_cost_years_seq;
/
create sequence acc_cost_years_seq start with 1 increment by 1 nomaxvalue;

/-- Create sequence of table institution plan
drop sequence acc_inst_plan_seq;
/
create sequence acc_inst_plan_seq start with 1 increment by 1 nomaxvalue;
/

/-- Create sequence of table institution plan positions
drop sequence acc_inst_plan_pos_seq;
/
create sequence acc_inst_plan_pos_seq start with 1 increment by 1 nomaxvalue;
/

/-- Create sequence of table institution plan coordinator positions
drop sequence acc_inst_plan_cor_pos_seq;
/
create sequence acc_inst_plan_cor_pos_seq start with 1 increment by 1 nomaxvalue;
/
/*-----------------------------------------Sequence Module COORDINATOR-------------------------------------------------*/

-- Create sequence of table coordinator plan
drop sequence cor_plan_seq;
/
create sequence cor_plan_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table coordinator plan position
drop sequence cor_plan_pos_seq;
/
create sequence cor_plan_pos_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator plan position
drop sequence cor_pos_inv_source_seq;
/
create sequence cor_pos_inv_source_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator plan sub position
drop sequence cor_plan_sub_pos_seq;
/
create sequence cor_plan_sub_pos_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator public procurement application
drop sequence cor_pub_proc_apl_seq;
/
create sequence cor_pub_proc_apl_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator public procurement application
drop sequence cor_pub_proc_apl_groups_seq;
/
create sequence cor_pub_proc_apl_groups_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator public procurement application
drop sequence cor_pub_proc_apl_parts_seq;
/
create sequence cor_pub_proc_apl_parts_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table coordinator public procurement application
drop sequence cor_pub_proc_apl_criteria_seq;
/
create sequence cor_pub_proc_apl_criteria_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;

-- Create sequence of table Application Assortment Group Subsequent Year
drop sequence cor_pub_proc_gr_sub_year_seq;
/
create sequence cor_pub_proc_gr_sub_year_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table texts
drop sequence text_seq;
/
create sequence text_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table application assortment group plan position
drop sequence cor_pub_apl_gr_pos_seq;
/
create sequence cor_pub_apl_gr_pos_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table public procurement application protocol
drop sequence cor_pub_proc_apl_protocol_seq;
/
create sequence cor_pub_proc_apl_protocol_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table Invoices
drop sequence cor_real_inv_seq;
/
create sequence cor_real_inv_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table Invoice positions
drop sequence cor_real_inv_pos_seq;
/
create sequence cor_real_inv_pos_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
/
-- Create sequence of table Contracts
drop sequence cor_real_ctr_seq;
/
create sequence cor_real_ctr_seq start with 1 increment by 1 nomaxvalue nocache order nocycle;
//*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   PACKAGES                                           		       */
/*-------------------------------------------------------------------------------------------------------------------- */

/* Create package Application management*/
create or replace package application_mgmt as
    procedure generate_number(applicant in varchar2, new_number out varchar2);
end application_mgmt;
/
create or replace package body application_mgmt as
    procedure generate_number(applicant in varchar2, new_number out varchar2)
        as
            last_application_number emsadm.application.app_number%type;
            last_number number;
            first_day date;
            last_day date;
            year varchar2(4);
        begin

            select trunc (sysdate , 'YEAR')
            into first_day
            from DUAL;

            select add_months(trunc (sysdate, 'YEAR'), 12) - 1
            into last_day
            from DUAL;

            select app_number
            into last_application_number
            from (select *
                    from application
                        where application.applicant_id = applicant and
                            application.create_date between first_day and last_day
                                order by application.id desc)
            where rownum <= 1;

            select extract(year from sysdate)
            into year
            from dual;

            last_number:=to_number(substr(last_application_number, 0, instr(last_application_number, '/')-1))+1;

            new_number := last_number || '/' || applicant || '/' || year;

        end;

end application_mgmt;
/
/* Create package Coordinator Public Procurement management*/
create or replace package cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2);
end cor_public_procurement_mgmt;
/
create or replace package body cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2)
        as
            last_application_number emsadm.cor_pub_proc_application.apl_number%type;
            symbol emsadm.organization_units.office_symbol%type;
            last_number number;
            first_day date;
            last_day date;
            year varchar2(4);
            code varchar2(10);
            estimation_type char(1);
        begin

            select trunc (sysdate , 'YEAR')
            into first_day
            from DUAL;

            select add_months(trunc (sysdate, 'YEAR'), 12) - 1
            into last_day
            from DUAL;

            begin
                select new_num, office_symbol
                    into last_number, symbol
                from (
                    select to_number(substr(apl.apl_number,  instr(apl.apl_number, '/',1,4)+1, instr(apl.apl_number, '/',1,5)-(instr(apl.apl_number, '/',1,4)+1)))+1 as new_num, ou.office_symbol
                        from emsadm.cor_pub_proc_application apl left join emsadm.organization_units ou on (apl.coordinator_id = ou.code)
                            where
                                apl.coordinator_id = p_coordinator and
                                apl.create_date between first_day and last_day and
                                apl.apl_mode = p_mode and
                                apl.estimation_type = p_estimation_type and
                                apl.apl_number is not null
                        order by to_number(substr(apl.apl_number,  instr(apl.apl_number, '/',1,4)+1, instr(apl.apl_number, '/',1,5)-(instr(apl.apl_number, '/',1,4)+1))) desc
                ) where rownum = 1;
                exception
                    when NO_DATA_FOUND then
                        last_number := null;
                        symbol := null;
            end;

            select extract(year from sysdate)
            into year
            from dual;

            if last_number is null then
                last_number := 1;
            end if;

            if symbol is null then
                begin
                    select upper(office_symbol)
                        into code
                    from emsadm.organization_units ou
                        where
                            ou.code = p_coordinator;
                    exception
                        when NO_DATA_FOUND then
                            code := upper(p_coordinator);
                end;
            else
                code := upper(symbol);
            end if;

            case p_estimation_type
                when 'DO50' then
                    estimation_type := 'D';
                when 'DO130' then
                    estimation_type := 'C';
                when 'PO130' then
                    estimation_type := 'B';
                when 'UE139' then
                    estimation_type := 'A';
            end case;

            new_number := code || '/381/' || p_mode || '/' || estimation_type || '/' || last_number || '/' || year;
        end;

end cor_public_procurement_mgmt;
/
/* Create package coordinator plan management */
create or replace package cor_plans_util as
    procedure update_plan_position_realized_value(p_coordinator in cor_plans.coordinator_id%type);
    procedure update_corection_plan_position_realized_value(
        p_position in cor_plan_positions.id%type,
        p_position_net in cor_plan_positions.am_rea_net%type,
        p_position_gros in cor_plan_positions.am_rea_gross%type,
        p_coordinator in cor_plans.coordinator_id%type
    );
    procedure generate_costs_type(
        p_source_year in acc_cost_years.year%type,
        p_target_year in acc_cost_years.year%type,
        o_msg out varchar2
    );
end cor_plans_util;
/
create or replace package body cor_plans_util as
    procedure update_plan_position_realized_value(p_coordinator in cor_plans.coordinator_id%type)as
        t_am_rea_net cor_plan_positions.am_rea_net%type;
        t_am_rea_gross cor_plan_positions.am_rea_gross%type;
        cursor c_plan_positions is
                select  pos.id, pos.am_rea_net, pos.am_rea_gross from cor_plan_positions pos left join cor_plans pl on(pos.plan_id = pl.id)
                    where pl.plan_type = 'PZP' and pl.coordinator_id = p_coordinator and pos.pos_correction_id is null
                        order by pos.id;
        r_position c_plan_positions%rowtype;
        begin
            open c_plan_positions;
                loop
                fetch c_plan_positions into r_position;
                    select
                        sum(amount_contract_awa_net),
                        sum(amount_contract_awa_gross)
                    into
                        t_am_rea_net,
                        t_am_rea_gross
                    from
                        cor_pub_proc_prices pr
                    where
                        pr.apl_pub_proc_gr_id in (
                            select
                                gr.id
                            from
                                cor_pub_proc_groups gr left join cor_pub_proc_application apl on (gr.application_id = apl.id)
                            where apl.coordinator_id = p_coordinator and apl.status = 'ZR' and apl.apl_mode = 'PL' and plan_pub_proc_pos_id in
                                (
                                    select institution_position_id from acc_institution_plan_cor_pos where cor_position_id = r_position.id
                                )
                        );

                    if r_position.am_rea_net is not null then

                        if r_position.am_rea_net <> t_am_rea_net then
                            -- Update coordinator plan position amount realized
                            DBMS_OUTPUT.PUT_LINE( r_position.id || ' - old net ' || r_position.am_rea_net || ' - new net ' || t_am_rea_net || ' - old gross ' || r_position.am_rea_gross || ' - new gross ' || t_am_rea_gross );
                            --update cor_plan_positions set am_rea_net = t_am_rea_net, am_rea_gross = t_am_rea_gross where id = r_position.id;
                        end if;

                        if r_position.id is not null then
                            cor_plans_util.update_corection_plan_position_realized_value(r_position.id, t_am_rea_net, t_am_rea_gross, p_coordinator);
                        end if;
                    end if;

                exit when c_plan_positions%notfound;
                end loop;
            close c_plan_positions;
        end;

        procedure update_corection_plan_position_realized_value(
            p_position in cor_plan_positions.id%type,
            p_position_net in cor_plan_positions.am_rea_net%type,
            p_position_gros in cor_plan_positions.am_rea_gross%type,
            p_coordinator in cor_plans.coordinator_id%type
        ) as
        t_corected_position cor_plan_positions%rowtype;
        t_am_rea_net cor_plan_positions.am_rea_net%type;
        t_am_rea_gross cor_plan_positions.am_rea_gross%type;

        begin
            begin
                select
                    *
                into
                    t_corected_position
                from
                    cor_plan_positions pos
                where
                    pos.pos_correction_id = p_position;
                exception
                        when NO_DATA_FOUND then
                            t_corected_position.id := null;
            end;
            if t_corected_position.id is not null then

                select
                    sum(amount_contract_awa_net),
                    sum(amount_contract_awa_gross)
                into
                    t_am_rea_net,
                    t_am_rea_gross
                from
                    cor_pub_proc_prices pr
                where
                    pr.apl_pub_proc_gr_id in (
                        select
                            gr.id
                        from
                            cor_pub_proc_groups gr left join cor_pub_proc_application apl on (gr.application_id = apl.id)
                        where apl.coordinator_id = p_coordinator and apl.status = 'ZR' and apl.apl_mode = 'PL' and plan_pub_proc_pos_id in
                        (
                            select institution_position_id from acc_institution_plan_cor_pos where cor_position_id = t_corected_position.id
                        )
                    );

                    if t_am_rea_net is not null then
                        t_am_rea_net := t_am_rea_net + p_position_net;
                        t_am_rea_gross := t_am_rea_gross + p_position_gros;
                    else
                        t_am_rea_net := p_position_net;
                        t_am_rea_gross := p_position_gros;
                    end if;
                if t_corected_position.am_rea_net <> t_am_rea_net then
                    -- Update coordinator plan position amount realized
                    DBMS_OUTPUT.PUT_LINE('is corrented ' || p_position || ' - ' || 'corected position ' || t_corected_position.id || ' old net '|| t_corected_position.am_rea_net || ' new net ' || t_am_rea_net || ' old gross ' || t_corected_position.am_rea_gross || ' new gross ' || t_am_rea_gross);
                    --update cor_plan_positions set am_rea_net = t_am_rea_net, am_rea_gross = t_am_rea_gross where id = t_corected_position.id;
                end if;

                cor_plans_util.update_corection_plan_position_realized_value(t_corected_position.id, t_am_rea_net, t_am_rea_gross, p_coordinator);

            end if;
        end;

        procedure generate_costs_type(p_source_year in acc_cost_years.year%type, p_target_year in acc_cost_years.year%type, o_msg out varchar2)as
            cursor c_costs is
                select
                    cy.id,
                    cy.cost_type_id
                from
                    acc_costs_type ct left join acc_cost_years cy on (ct.id = cy.cost_type_id)
                where
                    ct.active = 1
                    and cy.year = p_source_year
                    and not exists (
                        select
                            null
                        from
                            acc_cost_years in_cy
                        where
                            in_cy.year = p_target_year
                            and in_cy.cost_type_id = cy.cost_type_id
                    );
            -- table type
            type c_cost_tab is table of c_costs%rowtype;
            type coordinator_ids_tab is table of acc_cost_years_coordinators.coordinator_id%type index by pls_integer;
            type new_year_ids_tab is table of acc_cost_years.id%type index by pls_integer;
            -- table
            c_cost_t c_cost_tab;
            coordniator_ids_t coordinator_ids_tab;
            new_year_ids_t new_year_ids_tab;
            begin
                 open c_costs;
                    loop
                        fetch  c_costs bulk collect into c_cost_t;
                        exit when c_cost_t.count = 0;

                        /* Create year(p_target_year) for costs types */
                        forall i in 1..c_cost_t.count
                            insert into acc_cost_years(id, year, cost_type_id) values(acc_cost_years_seq.nextval, p_target_year, c_cost_t(i).cost_type_id) returning id bulk collect into new_year_ids_t;

                        for i in 1..c_cost_t.count loop
                            select
                                cyc.coordinator_id
                            bulk collect into
                                coordniator_ids_t
                            from
                                acc_cost_years_coordinators cyc
                            where
                                cyc.cost_year_id = c_cost_t(i).id
                                and cyc.coordinator_id not in(
                                    select
                                        in_cyc.coordinator_id
                                    from
                                        acc_cost_years cy left join acc_cost_years_coordinators in_cyc on (cy.id=in_cyc.cost_year_id)
                                    where
                                        cy.cost_type_id = c_cost_t(i).cost_type_id
                                        and cy.year = p_target_year
                                        and in_cyc.coordinator_id = cyc.coordinator_id
                                );

                            if coordniator_ids_t.count <> 0 then
                                --DBMS_OUTPUT.PUT_LINE('cost_type: ' || c_cost_t(i).cost_type_id);
                                /*forall i in 1..coordniator_ids_t.count
                                    insert into acc_cost_years_coordinators(cost_year_id, coordinator_id) values(new_year_ids_t(i),coordniator_ids_t(i));
                                */
                                for idx in 1 .. coordniator_ids_t.count loop
                                    --DBMS_OUTPUT.PUT_LINE('new cost year id: ' || new_year_ids_t(i) || 'coordinator id: ' ||  coordniator_ids_t(idx));
                                    insert into acc_cost_years_coordinators(cost_year_id, coordinator_id) values(new_year_ids_t(i),coordniator_ids_t(idx));
                                end loop;
                            end if;
                    end loop;
                        exit when c_costs%notfound;
                end loop;
            close c_costs;

            o_msg := 'Wygenerowano ' || c_cost_t.count || ' rodzajów kosztów na rok ' || p_target_year;
        end;
end cor_plans_util;
/
/* Create package institution plan management */
create or replace package ins_plans_util as
    procedure update_plan_position_realized_value(p_plan in acc_institution_plan_positions.plan_id%type);
end ins_plans_util;
create or replace package body ins_plans_util as
    procedure update_plan_position_realized_value(p_plan in acc_institution_plan_positions.plan_id%type)as
        cursor c_plan_positions is
            select ip.*, ipf.cost_type_id
                from acc_institution_plan_positions ip left join acc_institution_plan_pos_fin ipf on (ipf.id = ip.id)
                    where ip.plan_id = p_plan;
        r_position c_plan_positions%rowtype;
        t_am_rea_net cor_plan_positions.am_rea_net%type;
        t_am_rea_gross cor_plan_positions.am_rea_gross%type;
        t_am_awa_net cor_plan_positions.am_awa_gross%type;
        t_am_awa_gross cor_plan_positions.am_awa_gross%type;
        begin
            open c_plan_positions;
                loop
                    fetch c_plan_positions into r_position;

                        select
                            sum(cp.am_rea_net),
                            sum(cp.am_rea_gross),
                            sum(cp.am_awa_net),
                            sum(cp.am_awa_gross)
                        into
                            t_am_rea_net,
                            t_am_rea_gross,
                            t_am_awa_net,
                            t_am_awa_gross
                        from
                            cor_plan_positions cp
                        where
                            cp.id in (
                                select
                                    icp.cor_position_id
                                from
                                    acc_institution_plan_cor_pos icp
                                where
                                    icp.institution_position_id = r_position.id
                            );
                    if r_position.am_rea_net <> t_am_rea_net then
                        -- Update institution plan position amount realized
                        DBMS_OUTPUT.PUT_LINE('Rea');
                        DBMS_OUTPUT.PUT_LINE( r_position.id || ' - old net ' || r_position.am_rea_net || ' - new net ' || t_am_rea_net || ' - old gross ' || r_position.am_rea_gross || ' - new gross ' || t_am_rea_gross );
                        --update acc_institution_plan_positions set am_rea_net = t_am_rea_net, am_rea_gross = t_am_rea_gross where id = r_position.id;
                    end if;
                    if r_position.am_awa_gross <> t_am_awa_gross then
                        DBMS_OUTPUT.PUT_LINE('AWA');
                        DBMS_OUTPUT.PUT_LINE( r_position.id || ' - old net ' || r_position.am_awa_net || ' - new net ' || t_am_awa_net || ' - old gross ' || r_position.am_awa_gross || ' - new gross ' || t_am_awa_gross );
                        update acc_institution_plan_positions set am_awa_net = t_am_awa_net, am_awa_gross = t_am_awa_gross where id = r_position.id;
                    end if;
                exit when c_plan_positions%notfound;
                end loop;
            close c_plan_positions;
        end;
end ins_plans_util;
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TRIGGERS                                            			    */
/*-------------------------------------------------------------------------------------------------------------------- */

/* NOT USED APPLICATION MODULE*/
create or replace trigger trg_app_number_gen
    before insert
        on application
            for each row
                declare
                    out_application application.id%type;
                begin
                    :new.app_number := application_mgmt.generate_number(:new.applicant_id);
                end;
/

/*Close connection of user emsadm*/
disconnect;