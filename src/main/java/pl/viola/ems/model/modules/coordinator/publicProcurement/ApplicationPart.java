package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@ToString(exclude = {"application"})
@EqualsAndHashCode(exclude = {"application"})
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
    @Size(max = 120)
    private String name;

    @NonNull
    @Column(name = "amount_net")
    private BigDecimal amountNet;

    @NonNull
    private BigDecimal vat;


    @NonNull
    @Column(name = "amount_gross")
    private BigDecimal amountGross;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
}
