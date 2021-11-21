package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Data
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        InvestmentSubPosition that = (InvestmentSubPosition) o;

        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return 636438430;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + getId() + ")";
    }
}
