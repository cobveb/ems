package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.*;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDetailsPayload {
    private Long id;
    private String number;
    private Application.ApplicationMode mode;
    private String reasonNotIncluded;
    private Date createDate;
    private Date sendDate;
    @Enumerated(EnumType.STRING)
    private Application.ApplicationStatus status;
    private Boolean isReplay;
    private String orderedObject;
    private Boolean isCombined;
    private String orderRealizationTerm;
    @Enumerated(EnumType.STRING)
    private PublicProcurementPosition.EstimationType estimationType;
    private BigDecimal orderValueNet;
    private BigDecimal orderValueGross;
    private Boolean isParts;
    private BigDecimal partsAmountNet;
    private BigDecimal partsAmountGross;
    private String orderReasonLackParts;
    private String cpv;
    private String orderValueBased;
    private String orderValueSettingPerson;
    private Date dateEstablishedValue;
    private String justificationPurchase;
    private String orderDescription;
    private String personsPreparingDescription;
    private String requirementsVariantBids;
    private String proposedOrderingProcedure;
    private String personsPreparingJustification;
    private String orderContractorName;
    private String personsChoosingContractor;
    private String orderContractorConditions;
    private String personsPreparingConditions;
    private String orderImportantRecords;
    private String personsPreparingCriteria;
    private String tenderCommittee;
    private String warrantyRequirements;
    private String description;
    @Enumerated(EnumType.STRING)
    private CoordinatorPlan.PlanType orderIncludedPlanType;
    private Boolean isArt30;
    private String contractorContract;
    private BigDecimal offerPriceGross;
    private String receivedOffers;
    private String justificationChoosingOffer;
    private String justificationNonCompetitiveProcedure;
    private String conditionsParticipation;
    private Boolean isMarketConsultation;
    private Boolean isOrderFinanced;
    private Boolean isParticipatedPreparation;
    private Boolean isSecuringContract;
    private DictionaryItem orderProcedure;
    private User createUser;
    private User sendUser;
    private User publicAcceptUser;
    private User directorAcceptUser;
    private User medicalDirectorAcceptUser;
    private User accountantAcceptUser;
    private User chiefAcceptUser;
    private OrganizationUnit coordinator;
    private OrganizationUnit coordinatorCombined;
    private Set<ApplicationAssortmentGroup> assortmentGroups;
    private Set<ApplicationPart> parts;
    private Set<ApplicationCriterion> criteria;
    private ApplicationProtocolPayload applicationProtocol;
    private ApplicationPayload replaySourceApplication;
    private Boolean isPublicRealization;
}
