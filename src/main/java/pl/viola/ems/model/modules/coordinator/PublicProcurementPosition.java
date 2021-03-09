package pl.viola.ems.model.modules.coordinator;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.DictionaryItem;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "order_type")
    private OrderType orderType;

    @NonNull
    @NotBlank
    @Column(name = "initiation_term")
    private String initiationTerm;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "assortment_id")
    private DictionaryItem assortmentGroup;

}
