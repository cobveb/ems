package pl.viola.ems.model.modules.coordinator.publicProcurement;

import lombok.*;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_pub_proc_application", schema = "emsadm")
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(
                name = "publicProcurementGenerateApplicationNumber",
                procedureName = "emsadm.cor_public_procurement_mgmt.generate_application_number",
                parameters = {
                        @StoredProcedureParameter(name = "coordinator", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "application_mode", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "new_number", type = String.class, mode = ParameterMode.OUT)
                }
        )
})
public class Application {

    public enum ApplicationMode {
        PL, UP
    }

    public enum ApplicationStatus {
        ZP, WY, RE, ZR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationSequence")
    @SequenceGenerator(name = "publicApplicationSequence", sequenceName = "cor_pub_proc_apl_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Column(name = "apl_number")
    private String number;

    @Enumerated(EnumType.STRING)
    @Column(name = "apl_mode")
    private ApplicationMode mode;

    @Size(max = 256)
    @Column(name = "reason_not_included")
    private String reasonNotIncluded;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "send_date")
    private Date sendDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @NonNull
    @Size(max = 256)
    @Column(name = "ordered_object")
    private String orderedObject;

    @NonNull
    @Column(name = "is_combined")
    private Boolean isCombined;

    @Size(max = 20)
    @Column(name = "order_realization_term")
    private String orderRealizationTerm;

    @Enumerated(EnumType.STRING)
    @Column(name = "estimation_type")
    private PublicProcurementPosition.EstimationType estimationType;

    @Column(name = "order_value_net")
    private BigDecimal orderValueNet;

    @Column(name = "orderValueGross")
    private BigDecimal orderValueGross;

    @Column(name = "is_parts")
    private Boolean isParts;

    @Size(max = 256)
    @Column(name = "order_reason_lack_parts")
    private String orderReasonLackParts;

    @Size(max = 256)
    private String cpv;

    @Column(name = "order_value_based")
    private String orderValueBased;

    @Size(max = 100)
    @Column(name = "order_value_setting_person")
    private String orderValueSettingPerson;

    @Column(name = "date_established_value")
    private Date dateEstablishedValue;

    @Size(max = 256)
    @Column(name = "justification_purchase")
    private String justificationPurchase;

    @Size(max = 256)
    @Column(name = "order_description")
    private String orderDescription;

    @Size(max = 100)
    @Column(name = "persons_prep_description")
    private String personsPreparingDescription;

    @Size(max = 256)
    @Column(name = "requirements_variant_bids")
    private String requirementsVariantBids;

    @Size(max = 256)
    @Column(name = "proposed_ordering_procedure")
    private String proposedOrderingProcedure;

    @Size(max = 100)
    @Column(name = "persons_prep_justification")
    private String personsPreparingJustification;

    @Size(max = 256)
    @Column(name = "order_contractor_name")
    private String orderContractorName;

    @Size(max = 100)
    @Column(name = "persons_choosing_contractor")
    private String personsChoosingContractor;

    @Size(max = 256)
    @Column(name = "order_contractor_conditions")
    private String orderContractorConditions;

    @Size(max = 100)
    @Column(name = "persons_preparing_conditions")
    private String personsPreparingConditions;

    @Size(max = 256)
    @Column(name = "order_important_records")
    private String orderImportantRecords;

    @Size(max = 100)
    @Column(name = "persons_preparing_criteria")
    private String personsPreparingCriteria;

    @Size(max = 256)
    @Column(name = "tender_committee")
    private String tenderCommittee;

    @Size(max = 256)
    @Column(name = "warranty_requirements")
    private String warrantyRequirements;

    @Size(max = 256)
    private String description;

    @ManyToOne
    @JoinColumn(name = "create_user_id")
    private User createUser;

    @ManyToOne
    @JoinColumn(name = "send_user_id")
    private User sendUser;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @ManyToOne
    @JoinColumn(name = "coordinator_combined_id")
    private OrganizationUnit coordinatorCombined;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationAssortmentGroup> assortmentGroups = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationPart> parts = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationCriterion> criteria = new HashSet<>();
}
