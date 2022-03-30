package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.publicProcurement.institution.plans.InstitutionPublicProcurementPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

import static pl.viola.ems.utils.Utils.getArt30percent;

@ToString(exclude = {"application", "coordinatorPlanPosition", "institutionPublicProcurementPlanPosition", "prices", "parts", "subsequentYears", "optionValue", "applicationProcurementPlanPosition", "applicationPlanPosition", "applicationAssortmentGroupPlanPositions"})
@EqualsAndHashCode(exclude = {"application", "coordinatorPlanPosition", "parts", "subsequentYears", "applicationAssortmentGroupPlanPositions"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_pub_proc_groups", schema = "emsadm")
public class ApplicationAssortmentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationGroupSequence")
    @SequenceGenerator(name = "publicApplicationGroupSequence", sequenceName = "cor_pub_proc_apl_groups_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Column(name = "order_group_value_net")
    private BigDecimal orderGroupValueNet;

    @NonNull
    private BigDecimal vat;

    @Column(name = "order_group_value_gross")
    private BigDecimal orderGroupValueGross;

    @Column(name = "order_value_year_net")
    private BigDecimal orderValueYearNet;

    @Column(name = "order_value_year_gross")
    private BigDecimal orderValueYearGross;

    @Column(name = "am_ctr_awa_net")
    private BigDecimal amountContractAwardedNet;

    @Column(name = "am_ctr_awa_gross")
    private BigDecimal amountContractAwardedGross;

    @Column(name = "is_option")
    private Boolean isOption;

    @Column(name = "am_option_net")
    private BigDecimal amountOptionNet;

    @Column(name = "am_option_gross")
    private BigDecimal amountOptionGross;

    @Transient
    private ApplicationProcurementPlanPosition applicationProcurementPlanPosition;

    @Transient
    private ApplicationPlanPosition applicationPlanPosition;

    @Transient
    private Integer optionValue;

    @Transient
    private BigDecimal amountSumNet;

    @Transient
    private BigDecimal amountSumGross;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "plan_pub_proc_pos_id")
    private InstitutionPublicProcurementPlanPosition institutionPublicProcurementPlanPosition;

//    @JsonIgnore
//    @ManyToOne
//    @JoinColumn(name = "plan_position_id")
//    private CoordinatorPlanPosition coordinatorPlanPosition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationAssortmentGroup", cascade = {CascadeType.PERSIST})
    private Set<ApplicationPart> parts;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationAssortmentGroup", cascade = {CascadeType.PERSIST})
    private Set<ApplicationProtocolPrice> prices;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationAssortmentGroup", cascade = {CascadeType.ALL})
    private Set<ApplicationAssortmentGroupPlanPosition> applicationAssortmentGroupPlanPositions;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationAssortmentGroup", cascade = {CascadeType.REMOVE})
    private Set<AssortmentGroupSubsequentYear> subsequentYears;

    public ApplicationProcurementPlanPosition getApplicationProcurementPlanPosition() {

        if (this.institutionPublicProcurementPlanPosition != null) {
            return new ApplicationProcurementPlanPosition(
                    this.institutionPublicProcurementPlanPosition.getId(),
                    this.institutionPublicProcurementPlanPosition.getAssortmentGroup().getCode(),
                    this.institutionPublicProcurementPlanPosition.getAssortmentGroup().getName(),
                    this.institutionPublicProcurementPlanPosition.getEstimationType().name(),
                    this.institutionPublicProcurementPlanPosition.getOrderType().name(),
//                this.coordinatorPlanPosition.getInitiationTerm(),
                    this.institutionPublicProcurementPlanPosition.getAmountRequestedNet(),
                    this.institutionPublicProcurementPlanPosition.getAmountRealizedNet(),
                    this.institutionPublicProcurementPlanPosition.getAmountInferredNet(),
                    getArt30percent(this.institutionPublicProcurementPlanPosition.getAmountRequestedNet(), this.institutionPublicProcurementPlanPosition.getAmountArt30Net()),
                    this.institutionPublicProcurementPlanPosition.getAmountArt30Net(),
                    this.institutionPublicProcurementPlanPosition.getAmountArt30Gross()
//                this.coordinatorPlanPosition.getVat()
            );
        }
        return this.applicationProcurementPlanPosition;
    }

    public ApplicationPlanPosition getApplicationPlanPosition() {
//        if (this.coordinatorPlanPosition != null) {
//            return new ApplicationPlanPosition(
//                this.coordinatorPlanPosition.getId(),
//                this.coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
//                    this.coordinatorPlanPosition.getCostType().getCode() : this.coordinatorPlanPosition.getId().toString(),
//                this.coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
//                    this.coordinatorPlanPosition.getCostType().getName() : this.coordinatorPlanPosition.getTask(),
//                this.coordinatorPlanPosition.getAmountAwardedNet(),
//                this.coordinatorPlanPosition.getAmountAwardedGross()
//            );
//        }
        return this.applicationPlanPosition;
    }

    public Integer getOptionValue() {
        return this.isOption != null && this.isOption ? this.amountOptionNet.divide(this.orderGroupValueNet, 2, RoundingMode.HALF_DOWN).multiply(new BigDecimal(100)).intValue() : null;
    }

    public BigDecimal getAmountSumNet() {
        return this.isOption != null && this.isOption ? this.amountOptionNet.add(this.orderGroupValueNet) : this.orderGroupValueNet;
    }

    public BigDecimal getAmountSumGross() {
        return this.isOption != null && this.isOption ? this.amountOptionGross.add(this.orderGroupValueGross) : this.orderGroupValueGross;
    }
}
