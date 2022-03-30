/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   TABLES                                            				   */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create the table of common application text */
drop table emsadm.texts cascade constraints purge;
/
create TABLE emsadm.texts(
    id NUMBER(19,0) NOT NULL,
    content CLOB,
    CONSTRAINT texts_pk PRIMARY KEY(id)
)
TABLESPACE ems_texts;

COMMENT on COLUMN texts.id is 'Text PK';
COMMENT on COLUMN texts.content is 'Text content';
/

/* Re-create the table of Public Procurement Application */
drop table emsadm.cor_pub_proc_application cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_application(
    id NUMBER(19,0) NOT NULL,
    apl_number VARCHAR2(22),
    apl_mode VARCHAR2(2) NOT NULL,
    create_date DATE NOT NULL,
    send_date DATE,
    status VARCHAR2(2) NOT NULL,
    is_replay NUMBER(1),
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
    received_offers_id NUMBER(19,0),
    just_choosing_offer_id NUMBER(19,0),
    just_non_competitive_proc_id NUMBER(19,0),
    conditions_participation_id NUMBER(19,0),
    is_market_consultation NUMBER(1),
    is_order_financed NUMBER(1),
    is_participated_prep NUMBER(1),
    meas_avoid_dist_id NUMBER(19,0),
    is_securing_ctr NUMBER(1),
    ord_proc_id NUMBER(19,0),
    coordinator_id VARCHAR2(10) NOT NULL,
    coordinator_combined_id VARCHAR2(10),
    create_user_id NUMBER(19,0) NOT NULL,
    send_user_id NUMBER(19,0),
    public_accept_user_id NUMBER(19,0),
    med_dir_accept_user_id NUMBER(19,0),
    director_accept_user_id NUMBER(19,0),
    accountant_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    apl_protocol_id NUMBER(19,0),
    rep_sour_app_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_apl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_apl_cor_fk FOREIGN KEY (coordinator_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT cor_pub_proc_apl_cor_comb_fk FOREIGN KEY (coordinator_combined_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT cor_pub_proc_apl_ord_proc_fk FOREIGN KEY (ord_proc_id) REFERENCES emsarch.dictionary_items(id),
    CONSTRAINT cor_pub_proc_apl_create_usr_fk FOREIGN KEY (create_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_pub_usr_fk FOREIGN KEY (public_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_med_usr_fk FOREIGN KEY (med_dir_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_dir_usr_fk FOREIGN KEY (director_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_acc_usr_fk FOREIGN KEY (accountant_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_chf_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_apl_protocol_fk FOREIGN KEY (apl_protocol_id) REFERENCES emsadm.cor_pub_proc_protocol(id),
    CONSTRAINT cor_pub_proc_apl_rep_apl_fk FOREIGN KEY (rep_sour_app_id) REFERENCES emsadm.cor_pub_proc_application(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_application.id is 'Public Procurement application PK';
COMMENT on COLUMN cor_pub_proc_application.apl_number is 'Public Procurement application number';
COMMENT on COLUMN cor_pub_proc_application.apl_mode is 'Application procedure PL - planned, NP - unplanned';
COMMENT on COLUMN cor_pub_proc_application.create_date is 'Public Procurement application create date';
COMMENT on COLUMN cor_pub_proc_application.send_date is 'Public Procurement application send date';
COMMENT on COLUMN cor_pub_proc_application.status is 'Public Procurement application status';
COMMENT on COLUMN cor_pub_proc_application.is_replay is 'Public Procurement application is replay';
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
COMMENT on COLUMN cor_pub_proc_application.received_offers_id is 'Public Procurement application received offers (text) - DO50';
COMMENT on COLUMN cor_pub_proc_application.just_choosing_offer_id is 'Public Procurement application justification choosing offer (text) - DO50';
COMMENT on COLUMN cor_pub_proc_application.just_non_competitive_proc_id is 'Public Procurement application justification non competitive procedure (text) - D0130';
COMMENT on COLUMN cor_pub_proc_application.conditions_participation_id is 'Public Procurement application conditions participation (text) - PO130';
COMMENT on COLUMN cor_pub_proc_application.is_market_consultation is 'Public Procurement application is market consultation - PO130';
COMMENT on COLUMN cor_pub_proc_application.is_order_financed is 'Public Procurement application is order financed - PO130';
COMMENT on COLUMN cor_pub_proc_application.is_participated_prep is 'Is the applicant been involved in the preparation of the procedure';
COMMENT on COLUMN cor_pub_proc_application.meas_avoid_dist_id is 'Measures to prevent distortions of fair competition';
COMMENT on COLUMN cor_pub_proc_application.is_securing_ctr is 'Is secured proper performance of the contract';
COMMENT on COLUMN cor_pub_proc_application.ord_proc_id is 'Application  order proedure (FK -> slTrybUdzZp)';
COMMENT on COLUMN cor_pub_proc_application.coordinator_id is 'Application coordinator FK (organization_units)';
COMMENT on COLUMN cor_pub_proc_application.coordinator_combined_id is 'Application coordinator combined FK (organization_units';
COMMENT on COLUMN cor_pub_proc_application.create_user_id is 'Application create user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.send_user_id is 'Application send user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.public_accept_user_id is 'Application public procurement accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.med_dir_accept_user_id is 'Application medical director accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.director_accept_user_id is 'Application director accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.accountant_accept_user_id is 'Application accountant accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.chief_accept_user_id is 'Application chief accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_application.apl_protocol_id is 'Application protocol FK (cor_pub_proc_protocol)';
COMMENT on COLUMN cor_pub_proc_application.rep_sour_app_id is 'Source public procurenment replay application FK (cor_pub_proc_application)';

/* Re-create the table of Public Procurement Application groups */
drop table emsadm.cor_pub_proc_groups cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_groups(
    id NUMBER(19,0) NOT NULL,
    order_group_value_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    order_group_value_gross NUMBER(20,5),
    order_value_year_net NUMBER(20,5) NOT NULL,
    order_value_year_gross NUMBER(20,5),
    is_option NUMBER(1),
    am_option_net NUMBER(20,5),
    am_option_gross NUMBER(20,5),
    plan_pub_proc_pos_id NUMBER(19,0) NOT NULL,
    plan_position_id NUMBER(19,0) NOT NULL,
    application_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_group_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_gr_proc_pl_pos_fk FOREIGN KEY (plan_pub_proc_pos_id) REFERENCES emsadm.pub_institution_plan_pos(id),
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
COMMENT on COLUMN cor_pub_proc_groups.is_option is 'Whether the option right was exercised';
COMMENT on COLUMN cor_pub_proc_groups.am_option_net is 'Option right amount net';
COMMENT on COLUMN cor_pub_proc_groups.am_option_gross is 'Option right amount gross';
COMMENT on COLUMN cor_pub_proc_groups.plan_pub_proc_pos_id is 'Plan institution public procurement position FK';
COMMENT on COLUMN cor_pub_proc_groups.plan_position_id is 'Plan financial or inwestment position FK';
COMMENT on COLUMN cor_pub_proc_groups.application_id is 'Public procurement application FK';


/*Re-create the table of Public Procurement Application Parts */
drop table emsadm.cor_pub_proc_parts cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_parts(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(120) NOT NULL,
    amount_net NUMBER(20,5) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    amount_gross NUMBER(20,5) NOT NULL,
    is_realized NUMBER(1),
    am_ctr_awa_net NUMBER(20,5),
    am_ctr_awa_gross NUMBER(20,5),
    is_option NUMBER(1),
    am_option_net NUMBER(20,5),
    am_option_gross NUMBER(20,5),
    application_id NUMBER(19,0) NOT NULL,
    apl_pub_proc_gr_id NUMBER(19,0) NOT NULL,
    reason_not_rea_id NUMBER(19,0),
    desc_not_rea_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_part_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_part_apl_fk FOREIGN KEY (application_id) REFERENCES emsadm.cor_pub_proc_application(id),
    CONSTRAINT cor_pub_proc_part_gr_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id),
    CONSTRAINT cor_pub_proc_part_rea_fk FOREIGN KEY (desc_not_rea_id) REFERENCES emsarch.dictionary_items(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_parts.id is 'Public Procurement part PK';
COMMENT on COLUMN cor_pub_proc_parts.name is 'Public Procurement part name';
COMMENT on COLUMN cor_pub_proc_parts.amount_net is 'Net amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.vat is 'The VAT value of the part';
COMMENT on COLUMN cor_pub_proc_parts.amount_gross is 'Gross amount of the part';
COMMENT on COLUMN cor_pub_proc_parts.is_realized is 'Is part realized in the application';
COMMENT on COLUMN cor_pub_proc_parts.am_ctr_awa_net is 'Awarded contract amount net';
COMMENT on COLUMN cor_pub_proc_parts.am_ctr_awa_gross is 'Awarded contract amount gross';
COMMENT on COLUMN cor_pub_proc_parts.is_option is 'Whether the option right was exercised';
COMMENT on COLUMN cor_pub_proc_parts.am_option_net is 'Option right amount net';
COMMENT on COLUMN cor_pub_proc_parts.am_option_gross is 'Option right amount gross';
COMMENT on COLUMN cor_pub_proc_parts.application_id is 'Public procurement application FK';
COMMENT on COLUMN cor_pub_proc_parts.apl_pub_proc_gr_id is 'Public procurement application assortment group FK';
COMMENT on COLUMN cor_pub_proc_parts.reason_not_rea_id is 'Part reason not realized (FK -> slPoNiUdZp)';
COMMENT on COLUMN cor_pub_proc_parts.desc_not_rea_id is 'Part description reason not realized (Text)';
/

/*Re-create the table of Public Procurement Application Criteria */
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
    vat NUMBER(3,2) NOT NULL,
    year_exp_value_net NUMBER(20,5) NOT NULL,
    year_exp_value_gross NUMBER(20,5) NOT NULL,
    apl_pub_proc_gr_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_group_sub_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_group_sub_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_group_sub_year.id is 'Subsequent expenditure PK';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year is 'The year of the next expense';
COMMENT on COLUMN cor_pub_proc_group_sub_year.vat is 'VAT for the next expense';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year_exp_value_net is 'Subsequent expenditure value net';
COMMENT on COLUMN cor_pub_proc_group_sub_year.year_exp_value_gross is 'Subsequent expenditure value gross';
COMMENT on COLUMN cor_pub_proc_group_sub_year.apl_pub_proc_gr_id is 'Public procurement application assortment group FK';
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
    accountant_accept_user_id NUMBER(19,0),
    chief_accept_user_id NUMBER(19,0),
    contractor_id NUMBER(19,0),
    CONSTRAINT cor_pub_proc_prl_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_prl_send_usr_fk FOREIGN KEY (send_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_acc_usr_fk FOREIGN KEY (accountant_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_chf_usr_fk FOREIGN KEY (chief_accept_user_id) REFERENCES emsarch.users(id),
    CONSTRAINT cor_pub_proc_prl_ctr_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id)

)TABLESPACE  ems_data;


COMMENT on COLUMN cor_pub_proc_protocol.id is 'Public procurement protocol PK';
COMMENT on COLUMN cor_pub_proc_protocol.status is 'Public procurement protocol status';
COMMENT on COLUMN cor_pub_proc_protocol.email is 'Form price recognition - email';
COMMENT on COLUMN cor_pub_proc_protocol.phone is 'Form price recognition - phone';
COMMENT on COLUMN cor_pub_proc_protocol.internet is 'Form price recognition - internet';
COMMENT on COLUMN cor_pub_proc_protocol.paper is 'Form price recognition - paper';
COMMENT on COLUMN cor_pub_proc_protocol.other is 'Form price recognition - other';
COMMENT on COLUMN cor_pub_proc_protocol.other_desc_id is 'Form price recognition - other desc (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.renouncement is 'Form price recognition - renouncement';
COMMENT on COLUMN cor_pub_proc_protocol.non_comp_id is 'Justification of the non-competitive procedure (Text)';
COMMENT on COLUMN cor_pub_proc_protocol.received_offers_id is 'Public Procurement protocol received offers (text)';
COMMENT on COLUMN cor_pub_proc_protocol.just_choosing_off_id is 'Public Procurement protocol justification purchase (text)';
COMMENT on COLUMN cor_pub_proc_protocol.send_user_id is 'Public Procurement protocol send user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.accountant_accept_user_id is 'Public Procurement protocol accountant accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.chief_accept_user_id is 'Public Procurement protocol chief accept user FK (users)';
COMMENT on COLUMN cor_pub_proc_protocol.contractor_id is 'Contractor FK (acc_contractors)';


/* Create the table of Public Procurement Application Protocol Price */
drop table emsadm.cor_pub_proc_prices cascade constraints purge;
/
create TABLE emsadm.cor_pub_proc_prices(
    id NUMBER(19,0) NOT NULL,
    vat NUMBER(3,2) NOT NULL,
    amount_contract_awa_net NUMBER(20,5) NOT NULL,
    amount_contract_awa_gross NUMBER(20,5) NOT NULL,
    apl_pub_proc_gr_id NUMBER(19,0) NOT NULL,
    protocol_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_pub_proc_prices_pk PRIMARY KEY(id),
    CONSTRAINT cor_pub_proc_prices_pro_fk FOREIGN KEY (protocol_id) REFERENCES emsadm.cor_pub_proc_protocol(id),
    CONSTRAINT cor_pub_proc_prices_group_fk FOREIGN KEY (apl_pub_proc_gr_id) REFERENCES emsadm.cor_pub_proc_groups(id)
)
TABLESPACE ems_data;

COMMENT on COLUMN cor_pub_proc_prices.id is 'Public procurement protcol price PK';
COMMENT on COLUMN cor_pub_proc_prices.vat is 'Public procurement protcol price vat';
COMMENT on COLUMN cor_pub_proc_prices.amount_contract_awa_net is 'Amount of the selected net offer within the assortment group';
COMMENT on COLUMN cor_pub_proc_prices.amount_contract_awa_gross is 'Amount of the selected gross offer within the assortment group';
COMMENT on COLUMN cor_pub_proc_prices.apl_pub_proc_gr_id is 'Public procurement assortment group FK';
COMMENT on COLUMN cor_pub_proc_prices.protocol_id is 'Public procurement protocol FK';
/

/* Create the table of Accountant contractors */
drop table emsadm.acc_contractors cascade constraints purge;
/
create TABLE emsadm.acc_contractors(
    id NUMBER(19,0) NOT NULL,
    name VARCHAR2(300) NOT NULL,
    active NUMBER(1),
    CONSTRAINT acc_contractors_pk PRIMARY KEY(id)
)TABLESPACE ems_data;

COMMENT on COLUMN acc_contractors.id is 'Accountant contractors PK';
COMMENT on COLUMN acc_contractors.name is 'Accountant contractors name';
COMMENT on COLUMN acc_contractors.active is 'Is contractors active';
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   SEQUENCE                                            			   */
/*---------------------------------------------------------------------------------------------------------------------*/
-- Create sequence of table texts
drop sequence text_seq;
/
create sequence text_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table Application Assortment Group Subsequent Year
drop sequence cor_pub_proc_gr_sub_year_seq;
/
create sequence cor_pub_proc_gr_sub_year_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table Public Procurement Application Protocol Price
drop sequence cor_pub_proc_apl_price_seq;
/
create sequence cor_pub_proc_apl_price_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table Contractors
drop sequence cor_pub_proc_apl_protocol_seq;
/
create sequence cor_pub_proc_apl_protocol_seq start with 1 increment by 1 nomaxvalue;
/

-- Create sequence of table Contractors
drop sequence contractor_seq;
/
create sequence contractor_seq start with 1 increment by 1 nomaxvalue;
/
/*---------------------------------------------------------------------------------------------------------------------*/
/*                                                   PACKAGES                                           		       */
/*-------------------------------------------------------------------------------------------------------------------- */
/* Create package Coordinator Public Procurement management*/
create or replace package cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2);
end cor_public_procurement_mgmt;
/
create or replace package body cor_public_procurement_mgmt as
    procedure generate_application_number(p_coordinator in varchar2, p_mode in varchar2, p_estimation_type in varchar2, new_number out varchar2)
        as
            last_application_number emsadm.cor_pub_proc_application.apl_number%type;
            symbol emsadm.cor_pub_proc_application.office_symbol%type;
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
                select apl_number, office_symbol
                    into last_application_number, symbol
                        from emsadm.cor_pub_proc_application apl
                            where
                                apl.coordinator_id = p_coordinator and
                                apl.create_date between first_day and last_day and
                                apl.apl_mode = p_mode and
                                apl.estimation_type = p_estimation_type and
                                apl.apl_number is not null
                        order by apl.id desc;
                exception
                    when NO_DATA_FOUND then
                        last_application_number := null;
                        symbol := null;
            end;

            select extract(year from sysdate)
            into year
            from dual;

            if last_application_number is null then
                last_number := 1;
            else
                last_number:=to_number(substr(last_application_number,  instr(last_application_number, '/',1,4)+1, instr(last_application_number, '/',5)-7))+1;
            end if;

            if symbol is null then
                code := upper(p_coordinator);
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