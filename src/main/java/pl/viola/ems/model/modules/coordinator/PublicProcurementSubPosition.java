package pl.viola.ems.model.modules.coordinator;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.DictionaryItem;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString(exclude = {"mode"})
@EqualsAndHashCode(exclude = {"mode"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_pub_sub_proc_positions", schema = "emsadm")
public class PublicProcurementSubPosition extends CoordinatorPlanSubPosition {
    public enum EstimationType {
        DO50, D0130, PO130, UE139, WR, COVID
    }

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "estimation_type")
    private EstimationType estimationType;

    @Column(name = "euro_ex_rate")
    private BigDecimal euroExchangeRate;

    @Transient
    private BigDecimal amountRequestedEuroNet;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "mode_id")
    private DictionaryItem mode;

    public BigDecimal getAmountRequestedEuroNet() {
        if (euroExchangeRate != null) {
            this.amountRequestedEuroNet = super.getAmountNet().divide(
                    euroExchangeRate, 2, RoundingMode.HALF_EVEN);
        }
        return this.amountRequestedEuroNet;
    }
}
