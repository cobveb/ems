package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString(exclude = {"assortmentGroup"})
@EqualsAndHashCode(exclude = {"assortmentGroup"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_pub_procurement_positions", schema = "emsadm")
public class PublicProcurementPosition extends CoordinatorPlanPosition {

    public enum OrderType {
        DST, USL
    }

    public enum EstimationType {
        DO50, D0130, PO130, UE139, WR, COVID
    }

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "estimation_type")
    private EstimationType estimationType;

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "order_type")
    private OrderType orderType;

    @NonNull
    @NotBlank
    @Column(name = "initiation_term")
    private String initiationTerm;

    @Column(name = "euro_ex_rate")
    private BigDecimal euroExchangeRate;

    @Transient
    private BigDecimal amountRequestedEuroNet;

    @Column(name = "am_inferred_net")
    private BigDecimal amountInferredNet;

    @Column(name = "am_inferred_gross")
    private BigDecimal amountInferredGross;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "mode_id")
    private DictionaryItem mode;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "assortment_id")
    private DictionaryItem assortmentGroup;

    public BigDecimal getAmountRequestedEuroNet() {
        if (euroExchangeRate != null && super.getAmountRequestedNet() != null) {
            this.amountRequestedEuroNet = super.getAmountRequestedNet().divide(
                    euroExchangeRate, 2, RoundingMode.HALF_EVEN);
        }
        return this.amountRequestedEuroNet;
    }

}
