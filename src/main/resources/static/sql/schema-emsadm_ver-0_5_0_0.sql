/* Create the table of Invoices */
drop table emsadm.cor_real_invoices cascade constraints purge;
/
create TABLE emsadm.cor_real_invoices(
    id NUMBER(19,0) NOT NULL,
    inv_number VARCHAR2(20) NOT NULL,
    sell_date DATE NOT NULL,
    desc_id NUMBER(19,0),
    coordinator_id VARCHAR2(10) NOT NULL,
    contractor_id NUMBER(19,0) NOT NULL,
    pub_proc_app_id NUMBER(19,0),
    contract_id NUMBER(19,0),
    CONSTRAINT cor_real_inv_pk PRIMARY KEY(id),
    CONSTRAINT cor_real_inv_cor_fk FOREIGN KEY (coordinator_id) REFERENCES emsadm.organization_units(code),
    CONSTRAINT cor_real_inv_ctr_fk FOREIGN KEY (contractor_id) REFERENCES emsadm.acc_contractors(id),
    CONSTRAINT cor_real_inv_pub_proc_apl_fk FOREIGN KEY (pub_proc_app_id) REFERENCES emsadm.cor_pub_proc_application(id),
    CONSTRAINT cor_real_inv_ctrt_fk FOREIGN KEY (contract_id) REFERENCES emsadm.cor_real_contracts(id)
)TABLESPACE  ems_data;

COMMENT on COLUMN cor_real_invoices.id is 'Invoice PK';
COMMENT on COLUMN cor_real_invoices.inv_number is 'Invoice number';
COMMENT on COLUMN cor_real_invoices.sell_date is 'Invoice sell date';
COMMENT on COLUMN cor_real_invoices.desc_id is 'Invoice description (text)';
COMMENT on COLUMN cor_real_invoices.coordinator_id is 'Coordinator FK (organization_units)';
COMMENT on COLUMN cor_real_invoices.contractor_id is 'Contractor FK (acc_contractors)';
COMMENT on COLUMN cor_real_invoices.pub_proc_app_id is 'Public procurenment application FK (cor_pub_proc_application)';
COMMENT on COLUMN cor_real_invoices.contract_id is 'Realization contract FK (cor_real_contracts)';
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
    vat NUMBER(3,2),
    desc_id NUMBER(19,0),
    plan_position_id NUMBER(19,0) NOT NULL,
    invoice_id NUMBER(19,0) NOT NULL,
    CONSTRAINT cor_real_inv_pos_pk PRIMARY KEY(id),
    CONSTRAINT cor_real_inv_pos_pl_pos_fk FOREIGN KEY (plan_position_id) REFERENCES emsadm.cor_plan_positions(id),
    CONSTRAINT cor_real_inv_fk FOREIGN KEY (invoice_id) REFERENCES emsadm.cor_real_invoices(id)
) TABLESPACE ems_data;

COMMENT on COLUMN cor_real_invoice_positions.id is 'Invoice PK';
COMMENT on COLUMN cor_real_invoice_positions.name_id is 'Invoice position name (text)';
COMMENT on COLUMN cor_real_invoice_positions.pos_incl_plan_type is 'Invoice position included in plan FIN or INW';
COMMENT on COLUMN cor_real_invoice_positions.amount_net is 'Invoice position amount net';
COMMENT on COLUMN cor_real_invoice_positions.amount_gross is 'Invoice position amount gross';
COMMENT on COLUMN cor_real_invoice_positions.vat is 'Invoice position vat, if null then vat is diff';
COMMENT on COLUMN cor_real_invoice_positions.desc_id is 'Invoice position description (text)';
COMMENT on COLUMN cor_real_invoice_positions.plan_position_id is 'Financial or inwestment plan position FK (cor_plan_positions)';
COMMENT on COLUMN cor_real_invoice_positions.invoice_id is 'Invoice FK (cor_real_invoices)';
/

/* Create the table of Contracts */
drop table emsadm.cor_real_contracts cascade constraints purge;
/
create TABLE emsadm.cor_real_contracts(
    id NUMBER(19,0) NOT NULL,
    ctr_number VARCHAR2(20) NOT NULL,
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

-- Add column nip to Contractors Table
ALTER TABLE emsadm.acc_contractors ADD nip varchar2(10);

COMMENT on COLUMN acc_contractors.nip is 'Contractor nip number';
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
/

