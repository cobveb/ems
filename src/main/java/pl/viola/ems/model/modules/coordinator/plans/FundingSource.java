package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString(exclude = {"investmentPosition"})
@EqualsAndHashCode(exclude = {"investmentPosition"})
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

    @Column(name = "so_am_awa_net")
    private BigDecimal sourceAmountRequestedNet;

    @Transient
    private BigDecimal sourceAmountRequestedGross;

    @Column(name = "so_ex_plan_net")
    private BigDecimal sourceExpensesPlanNet;

    @Transient
    private BigDecimal sourceExpensesPlanGross;

    @JsonIgnore
    @NonNull
    @ManyToOne
    @JoinColumn(name = "position_id")
    private InvestmentPosition investmentPosition;

    public BigDecimal getSourceAmountRequestedGross() {
        this.sourceAmountRequestedGross = sourceAmountRequestedNet.multiply(investmentPosition.getVat());
        return this.sourceAmountRequestedGross.setScale(2, RoundingMode.CEILING);
    }

    public BigDecimal getSourceExpensesPlanGross() {
        this.sourceExpensesPlanGross = sourceExpensesPlanNet.multiply(investmentPosition.getVat());
        return this.sourceExpensesPlanGross.setScale(2, RoundingMode.CEILING);
    }
}
