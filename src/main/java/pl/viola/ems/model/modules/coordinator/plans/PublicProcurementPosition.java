package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@ToString(exclude = {"assortmentGroup"})
@EqualsAndHashCode(exclude = {"assortmentGroup"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_pub_procurement_positions", schema = "emsadm")
public class PublicProcurementPosition extends CoordinatorPlanPosition {

    public enum OrderType {
        DST, USL, RBD,
    }

    public enum EstimationType {
        DO50, DO130, PO130, UE139,
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

    @Override
    public BigDecimal getExpensesPositionAwardedNet() {
        return null;
    }

    @Override
    public BigDecimal getExpensesPositionAwardedGross() {
        return null;
    }

    @Override
    public List<FundingSource> getPositionFundingSources() {
        return null;
    }

    @Override
    public void setPositionFundingSources(List<FundingSource> fundingSources) {
    }

    @Override
    public DictionaryItem getCategory() {
        return null;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getTask() {
        return null;
    }

    @Override
    public String getApplication() {
        return null;
    }

    @Override
    public String getSubstantiation() {
        return null;
    }

    @Override
    public Date getRealizationDate() {
        return null;
    }

    @Override
    public BigDecimal getTaskPositionNet() {
        return null;
    }

    @Override
    public BigDecimal getTaskPositionGross() {
        return null;
    }

    @Override
    public BigDecimal getRealizedPositionNet() {
        return null;
    }

    @Override
    public BigDecimal getRealizedPositionGross() {
        return null;
    }

    @Override
    public CostType getCostType() {
        return null;
    }

    @Override
    public String getCode() {
        return null;
    }

    @Override
    public String getItemName() {
        return null;
    }

}
