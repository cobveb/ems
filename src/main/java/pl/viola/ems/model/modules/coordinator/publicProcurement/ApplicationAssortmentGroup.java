package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;

import javax.persistence.*;
import java.math.BigDecimal;

@ToString(exclude = {"application", "planPosition"})
@EqualsAndHashCode(exclude = {"application", "planPosition"})
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
    private BigDecimal orderGroupValueNet;

    @NonNull
    private BigDecimal vat;

    private BigDecimal orderGroupValueGross;

    @NonNull
    private BigDecimal orderValueYearNet;

    private BigDecimal orderValueYearGross;

    public ApplicationProcurementPlanPosition getApplicationProcurementPlanPosition() {

        if (this.planPosition != null) {
            return new ApplicationProcurementPlanPosition(
                    this.planPosition.getId(),
                    this.planPosition.getAssortmentGroup().getCode(),
                    this.planPosition.getAssortmentGroup().getName(),
                    this.planPosition.getEstimationType().name(),
                    this.planPosition.getOrderType().name(),
                    this.planPosition.getInitiationTerm(),
                    this.planPosition.getAmountRequestedNet(),
                    this.planPosition.getAmountRealizedNet(),
                    this.planPosition.getAmountInferredNet(),
                    this.planPosition.getVat()
            );
        }
        return this.applicationProcurementPlanPosition;
    }


    @Transient
    private ApplicationProcurementPlanPosition applicationProcurementPlanPosition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "plan_position_id")
    private PublicProcurementPosition planPosition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
}
