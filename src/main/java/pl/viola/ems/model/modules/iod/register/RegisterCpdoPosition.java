package pl.viola.ems.model.modules.iod.register;

import lombok.Getter;
import lombok.Setter;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.register.RegisterPosition;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "iod_reg_pos_cpdo", schema = "emsadm")
public class RegisterCpdoPosition extends RegisterPosition {
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ou_id", referencedColumnName = "id")
    private Text ou;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "data_set_conn_id", referencedColumnName = "id")
    private Text dataSetConnection;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "purpose_proc_id", referencedColumnName = "id")
    private Text purposeProcessing;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cat_people_id", referencedColumnName = "id")
    private Text categoriesPeople;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "data_cat_id", referencedColumnName = "id")
    private Text dataCategories;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "legal_basis_id", referencedColumnName = "id")
    private Text legalBasis;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "date_source_id", referencedColumnName = "id")
    private Text dataSource;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cat_rem_date_id", referencedColumnName = "id")
    private Text categoryRemovalDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "co_adm_name_id", referencedColumnName = "id")
    private Text coAdminName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "processor_name_id", referencedColumnName = "id")
    private Text processorName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipient_cat_id", referencedColumnName = "id")
    private Text recipientCategories;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "sys_soft_name_id", referencedColumnName = "id")
    private Text systemSoftwareName;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "sec_measures_id", referencedColumnName = "id")
    private Text securityMeasures;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpia_id", referencedColumnName = "id")
    private Text dpia;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "third_country_id", referencedColumnName = "id")
    private Text thirdCountry;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "third_country_doc_id", referencedColumnName = "id")
    private Text thirdCountryDoc;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    private Text comments;

    @Override
    public String getCode() {
        return super.getId().toString();
    }

}
