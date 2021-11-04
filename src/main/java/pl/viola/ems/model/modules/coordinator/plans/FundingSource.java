package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import java.math.BigDecimal;

@ToString(exclude = {"coordinatorPlanSubPosition", "coordinatorPlanSubPositionExp"})
@EqualsAndHashCode(exclude = {"coordinatorPlanSubPosition", "coordinatorPlanSubPositionExp"})
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Data
@Entity
@Table(name = "cor_inv_founding_source", schema = "emsadm")
public class FundingSource {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPositionSourceSequence")
    @SequenceGenerator(name = "coordinatorPositionSourceSequence", sequenceName = "cor_pos_inv_source_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "type_id")
    private DictionaryItem type;

    @Column(name = "so_am_net")
    private BigDecimal sourceAmountNet;

    @Column(name = "so_am_gross")
    private BigDecimal sourceAmountGross;

    @Column(name = "so_awa_net")
    private BigDecimal sourceAmountAwardedNet;

    @Column(name = "so_awa_gross")
    private BigDecimal sourceAmountAwardedGross;

    @Column(name = "so_exp_net")
    private BigDecimal sourceExpensesPlanNet;

    @Column(name = "so_exp_gross")
    private BigDecimal sourceExpensesPlanGross;

    @Column(name = "so_exp_awa_net")
    private BigDecimal sourceExpensesPlanAwardedNet;

    @Column(name = "so_exp_awa_gross")
    private BigDecimal sourceExpensesPlanAwardedGross;

    @Column(name = "so_rea_net")
    private BigDecimal sourceRealizedAmountNet;

    @Column(name = "so_rea_gross")
    private BigDecimal sourceRealizedAmountGross;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "sub_position_id")
    private CoordinatorPlanSubPosition coordinatorPlanSubPosition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "position_id")
    private CoordinatorPlanPosition coordinatorPlanPosition;

}
