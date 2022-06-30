alter table emsadm.cor_real_contracts
    add (
        rel_prev_val_net NUMBER(20,5),
        rel_prev_val_gross NUMBER(20,5),
        changes_id NUMBER(19,0)
    );

COMMENT on COLUMN cor_real_contracts.rel_prev_val_net is 'Realization previous years value net';
COMMENT on COLUMN cor_real_contracts.rel_prev_val_gross is 'Realization previous years value gross';
COMMENT on COLUMN cor_real_contracts.changes_id is 'Contract changes introduced by annexes (Text)';
/

alter table emsadm.cor_real_contracts
    modify ctr_number VARCHAR(26);

alter table emsadm.cor_real_invoices
    modify inv_number VARCHAR(26);