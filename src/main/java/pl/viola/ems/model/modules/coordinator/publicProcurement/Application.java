package pl.viola.ems.model.modules.coordinator.publicProcurement;

import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"assortmentGroups", "parts", "criteria", "applicationProtocol"})
@EqualsAndHashCode(exclude = {"assortmentGroups", "parts", "criteria"})
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
                        @StoredProcedureParameter(name = "p_coordinator", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "p_mode", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "p_estimation_type", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "new_number", type = String.class, mode = ParameterMode.OUT)
                }
        )
})
public class Application {

    public enum ApplicationMode {
        PL, UP
    }

    public enum ApplicationStatus {
        ZP, WY, AZ, AD, AM, AK, ZA, RE, ZR, AN
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reason_not_included_id", referencedColumnName = "id")
    private Text reasonNotIncluded;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "send_date")
    private Date sendDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "is_replay")
    private Boolean isReplay;

    @NonNull
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ordered_object_id", referencedColumnName = "id")
    private Text orderedObject;

    @NonNull
    @Column(name = "is_combined")
    private Boolean isCombined;

    @Size(max = 20)
    @Column(name = "order_realization_term")
    private String orderRealizationTerm;

    @Enumerated(EnumType.STRING)
    @Column(name = "estimation_type")
    private PublicProcurementPosition.EstimationType estimationType;

    @Column(name = "is_art30")
    private Boolean isArt30;

    @Column(name = "order_value_net")
    private BigDecimal orderValueNet;

    @Column(name = "order_value_gross")
    private BigDecimal orderValueGross;

    @Column(name = "is_parts")
    private Boolean isParts;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_reason_lack_parts_id", referencedColumnName = "id")
    private Text orderReasonLackParts;

    @Size(max = 200)
    private String cpv;

    @Size(max = 200)
    @Column(name = "order_value_based")
    private String orderValueBased;

    @Size(max = 200)
    @Column(name = "order_value_setting_person")
    private String orderValueSettingPerson;

    @Column(name = "date_established_value")
    private Date dateEstablishedValue;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "justification_purchase_id", referencedColumnName = "id")
    private Text justificationPurchase;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_description_id", referencedColumnName = "id")
    private Text orderDescription;

    @Size(max = 200)
    @Column(name = "persons_prep_description")
    private String personsPreparingDescription;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "requirements_variant_bids_id", referencedColumnName = "id")
    private Text requirementsVariantBids;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "proposed_ordering_proc_id", referencedColumnName = "id")
    private Text proposedOrderingProcedure;

    @Size(max = 200)
    @Column(name = "persons_prep_justification")
    private String personsPreparingJustification;

    @Size(max = 200)
    @Column(name = "order_contractor_name")
    private String orderContractorName;

    @Size(max = 200)
    @Column(name = "persons_choosing_contractor")
    private String personsChoosingContractor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_contra_conditions_id", referencedColumnName = "id")
    private Text orderContractorConditions;

    @Size(max = 200)
    @Column(name = "persons_preparing_conditions")
    private String personsPreparingConditions;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_important_records_id", referencedColumnName = "id")
    private Text orderImportantRecords;

    @Size(max = 200)
    @Column(name = "persons_preparing_criteria")
    private String personsPreparingCriteria;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tender_committee_id", referencedColumnName = "id")
    private Text tenderCommittee;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "warranty_requirements_id", referencedColumnName = "id")
    private Text warrantyRequirements;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "description_id", referencedColumnName = "id")
    private Text description;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_included_plan_type")
    private CoordinatorPlan.PlanType orderIncludedPlanType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contractor_contract_id", referencedColumnName = "id")
    private Text contractorContract;

    @Column(name = "offer_price_gross")
    private BigDecimal offerPriceGross;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "received_offers_id", referencedColumnName = "id")
    private Text receivedOffers;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "just_choosing_offer_id", referencedColumnName = "id")
    private Text justificationChoosingOffer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "just_non_competitive_proc_id", referencedColumnName = "id")
    private Text justificationNonCompetitiveProcedure;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "conditions_participation_id", referencedColumnName = "id")
    private Text conditionsParticipation;

    @Column(name = "is_market_consultation")
    private Boolean isMarketConsultation;

    @Column(name = "is_order_financed")
    private Boolean isOrderFinanced;

    @Column(name = "is_participated_prep")
    private Boolean isParticipatedPreparation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "meas_avoid_dist_id", referencedColumnName = "id")
    private Text measuresAvoidanceDistortions;

    @Column(name = "is_securing_ctr")
    private Boolean isSecuringContract;

    @ManyToOne
    @JoinColumn(name = "ord_proc_id")
    private DictionaryItem orderProcedure;

    @ManyToOne
    @JoinColumn(name = "create_user_id")
    private User createUser;

    @ManyToOne
    @JoinColumn(name = "send_user_id")
    private User sendUser;

    @ManyToOne
    @JoinColumn(name = "public_accept_user_id")
    private User publicAcceptUser;

    @ManyToOne
    @JoinColumn(name = "med_dir_accept_user_id")
    private User medicalDirectorAcceptUser;

    @ManyToOne
    @JoinColumn(name = "director_accept_user_id")
    private User directorAcceptUser;

    @ManyToOne
    @JoinColumn(name = "accountant_accept_user_id")
    private User accountantAcceptUser;

    @ManyToOne
    @JoinColumn(name = "chief_accept_user_id")
    private User chiefAcceptUser;

    @ManyToOne
    @JoinColumn(name = "cancel_user_id")
    private User cancelUser;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @ManyToOne
    @JoinColumn(name = "coordinator_combined_id")
    private OrganizationUnit coordinatorCombined;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "rep_sour_app_id", referencedColumnName = "id")
    private Application replaySourceApplication;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "apl_protocol_id")
    private ApplicationProtocol applicationProtocol;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationAssortmentGroup> assortmentGroups = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationPart> parts = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.REMOVE})
    private Set<ApplicationCriterion> criteria = new HashSet<>();
}
