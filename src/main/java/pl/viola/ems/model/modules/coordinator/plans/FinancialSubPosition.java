package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.List;


@ToString(exclude = {"unit"})
@EqualsAndHashCode(exclude = {"unit"}, callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
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

    @Override
    public List<FundingSource> getFundingSources() {
        return null;
    }

    @Override
    public OrganizationUnit getTargetUnit() {
        return null;
    }
}
