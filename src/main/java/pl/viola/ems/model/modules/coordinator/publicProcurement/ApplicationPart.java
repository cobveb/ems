package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString(exclude = {"application", "applicationAssortmentGroup"})
@EqualsAndHashCode(exclude = {"application", "applicationAssortmentGroup"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_pub_proc_parts", schema = "emsadm")
public class ApplicationPart {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationPartSequence")
    @SequenceGenerator(name = "publicApplicationPartSequence", sequenceName = "cor_pub_proc_apl_parts_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @NotBlank
    @Size(max = 200)
    private String name;

    @NonNull
    @Column(name = "amount_net")
    private BigDecimal amountNet;

    @NonNull
    private BigDecimal vat;

    @NonNull
    @Column(name = "amount_gross")
    private BigDecimal amountGross;

    @Column(name = "is_realized")
    private Boolean isRealized;

    @Column(name = "am_ctr_awa_net")
    private BigDecimal amountContractAwardedNet;

    @Column(name = "am_ctr_awa_gross")
    private BigDecimal amountContractAwardedGross;

    @Column(name = "is_option")
    private Boolean isOption;

    @Column(name = "am_option_net")
    private BigDecimal amountOptionNet;

    @Column(name = "am_option_gross")
    private BigDecimal amountOptionGross;

    @Transient
    private Integer optionValue;

    @Transient
    private BigDecimal amountSumNet;

    @Transient
    private BigDecimal amountSumGross;

    @ManyToOne
    @JoinColumn(name = "reason_not_rea_id")
    private DictionaryItem reasonNotRealized;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "desc_not_rea_id", referencedColumnName = "id")
    private Text descNotRealized;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne
    @JoinColumn(name = "apl_pub_proc_gr_id")
    private ApplicationAssortmentGroup applicationAssortmentGroup;

    public Integer getOptionValue() {
        return this.isOption != null && this.isOption ? this.amountOptionNet.divide(this.amountNet, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue() : null;
    }

    public BigDecimal getAmountSumNet() {
        return this.isOption != null && this.isOption ? this.amountOptionNet.add(this.amountNet) : this.amountNet;
    }

    public BigDecimal getAmountSumGross() {
        return this.isOption != null && this.isOption ? this.amountOptionGross.add(this.amountGross) : this.amountGross;
    }
}
