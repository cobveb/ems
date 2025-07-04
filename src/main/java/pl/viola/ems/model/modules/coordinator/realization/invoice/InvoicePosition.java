package pl.viola.ems.model.modules.coordinator.realization.invoice;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import javax.persistence.*;
import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_real_invoice_positions", schema = "emsadm")
public class InvoicePosition {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invoicePositionSequence")
    @SequenceGenerator(name = "invoicePositionSequence", sequenceName = "cor_real_inv_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "name_id", referencedColumnName = "id")
    private Text name;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "pos_incl_plan_type")
    private CoordinatorPlan.PlanType positionIncludedPlanType;

    @NonNull
    @Column(name = "amount_net")
    private BigDecimal amountNet;

    @NonNull
    @Column(name = "amount_gross")
    private BigDecimal amountGross;

    private BigDecimal vat;

    @Column(name = "opt_val_net")
    private BigDecimal optionValueNet;

    @Column(name = "opt_val_gross")
    private BigDecimal optionValueGross;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "desc_id", referencedColumnName = "id")
    private Text description;

    @ToString.Exclude
    @ManyToOne
    @NonNull
    @JoinColumn(name = "plan_position_id")
    private CoordinatorPlanPosition coordinatorPlanPosition;

    @ToString.Exclude
    @JsonIgnore
    @NonNull
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

}
