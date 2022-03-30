package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@ToString(exclude = {"applicationAssortmentGroup", "applicationProtocol"})
@EqualsAndHashCode(exclude = {"applicationAssortmentGroup", "applicationProtocol"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cor_pub_proc_prices", schema = "emsadm")
public class ApplicationProtocolPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationPriceSequence")
    @SequenceGenerator(name = "publicApplicationPriceSequence", sequenceName = "cor_pub_proc_apl_price_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Column(name = "amount_contract_awa_net")
    private BigDecimal amountContractAwardedNet;

    @NonNull
    private BigDecimal vat;

    @NonNull
    @Column(name = "amount_contract_awa_gross")
    private BigDecimal amountContractAwardedGross;

    @ManyToOne
    @JoinColumn(name = "apl_pub_proc_gr_id")
    private ApplicationAssortmentGroup applicationAssortmentGroup;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "protocol_id")
    private ApplicationProtocol applicationProtocol;
}
