package pl.viola.ems.model.modules.coordinator;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.DictionaryItem;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;


@ToString(exclude = {"unit", "amountCorrectedGross"})
@EqualsAndHashCode(exclude = {"unit", "amountCorrectedGross"}, callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_financial_sub_positions", schema = "emsadm")
public class FinancialSubPosition extends CoordinatorPlanSubPosition {

    @NonNull
    private Long quantity;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "unit_id")
    private DictionaryItem unit;

    @NonNull
    @JoinColumn(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "am_cor_net")
    private BigDecimal amountCorrectedNet;

    @Transient
    private BigDecimal amountCorrectedGross;

    public BigDecimal getAmountCorrectedGross() {
        if (amountCorrectedNet != null) {
            this.amountCorrectedGross = amountCorrectedNet.multiply(getPlanPosition().getVat()).setScale(2, RoundingMode.CEILING);
        }
        return this.amountCorrectedGross;
    }
}
