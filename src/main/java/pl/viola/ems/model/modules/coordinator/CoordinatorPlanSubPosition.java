package pl.viola.ems.model.modules.coordinator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString(exclude = {"planPosition", "amountGross"})
@EqualsAndHashCode(exclude = {"planPosition", "amountGross"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "cor_plan_sub_positions", schema = "emsadm")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = FinancialSubPosition.class, name = "finp"),
        @JsonSubTypes.Type(value = PublicProcurementSubPosition.class, name = "pzpp"),
})
@DynamicUpdate
public abstract class CoordinatorPlanSubPosition implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPlanSubPositionSequence")
    @SequenceGenerator(name = "coordinatorPlanSubPositionSequence", sequenceName = "cor_plan_sub_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    private String name;

    @NonNull
    @Column(name = "am_net")
    private BigDecimal amountNet;

    @Transient
    private BigDecimal amountGross;

    @Column(name = "am_rea_net")
    private BigDecimal amountRealizedNet;


    @Transient
    private BigDecimal amountRealizedGross;

    private String comments;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "plan_position_id")
    private CoordinatorPlanPosition planPosition;

    public BigDecimal getAmountGross() {
        if (amountNet != null) {
            this.amountGross = amountNet.multiply(planPosition.getVat()).setScale(2, RoundingMode.CEILING);
        }
        return this.amountGross;
    }

    public BigDecimal getAmountRealizedGross() {
        if (amountRealizedNet != null) {
            return this.amountRealizedGross = amountRealizedNet.multiply(planPosition.getVat()).setScale(2, RoundingMode.CEILING);
        }
        return amountRealizedGross;
    }

}
