package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@ToString(exclude = {"applicationAssortmentGroup", "coordinatorPlanPosition"})
@EqualsAndHashCode(exclude = {"applicationAssortmentGroup", "coordinatorPlanPosition"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_pub_proc_gr_pos", schema = "emsadm")
public class ApplicationAssortmentGroupPlanPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "applicationGroupPlanPositionSequence")
    @SequenceGenerator(name = "applicationGroupPlanPositionSequence", sequenceName = "cor_pub_apl_gr_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Column(name = "pos_am_net")
    private BigDecimal positionAmountNet;

    @NonNull
    private BigDecimal vat;

    @Column(name = "pos_am_gross")
    private BigDecimal positionAmountGross;

    @ManyToOne
    @JoinColumn(name = "plan_position_id")
    private CoordinatorPlanPosition coordinatorPlanPosition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "apl_pub_proc_gr_id")
    private ApplicationAssortmentGroup applicationAssortmentGroup;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationAssortmentGroupPlanPosition", cascade = {CascadeType.REMOVE})
    private Set<AssortmentGroupSubsequentYear> subsequentYears;

}
