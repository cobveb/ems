package pl.viola.ems.model.modules.coordinator.plans;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.List;

@ToString(exclude = {"mode"})
@EqualsAndHashCode(exclude = {"mode"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_pub_sub_proc_positions", schema = "emsadm")
public class PublicProcurementSubPosition extends CoordinatorPlanSubPosition {
    @Override
    public Long getQuantity() {
        return null;
    }

    @Override
    public DictionaryItem getUnit() {
        return null;
    }

    @Override
    public BigDecimal getUnitPrice() {
        return null;
    }

    @Override
    public List<FundingSource> getFundingSources() {
        return null;
    }
}
