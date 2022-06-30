package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@EqualsAndHashCode(exclude = {"fundingSources"}, callSuper = false)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_inv_sub_positions", schema = "emsadm")
@DynamicUpdate
public class InvestmentSubPosition extends CoordinatorPlanSubPosition {

    @NonNull
    private Long quantity;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "target_unit")
    private OrganizationUnit targetUnit;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "coordinatorPlanSubPosition", cascade = {CascadeType.ALL})
    private List<FundingSource> fundingSources;

    @Override
    public DictionaryItem getUnit() {
        return null;
    }

    @Override
    public BigDecimal getUnitPrice() {
        return null;
    }

    public BigDecimal getTaskGross() {
        BigDecimal taskGross = new BigDecimal(0);
        for (FundingSource source : fundingSources) {
            taskGross = taskGross.add(source.getSourceAmountGross());
        }
        return taskGross;
    }

    public BigDecimal getAmountRequestedGross() {
        BigDecimal amountGross = new BigDecimal(0);
        for (FundingSource source : fundingSources) {
            amountGross = amountGross.add(source.getSourceExpensesPlanGross());
        }
        return amountGross;
    }
}
