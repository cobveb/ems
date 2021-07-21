package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@ToString(exclude = {"application"})
@EqualsAndHashCode(exclude = {"application"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cor_pub_proc_criteria", schema = "emsadm")
public class ApplicationCriterion {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationCriteriaSequence")
    @SequenceGenerator(name = "publicApplicationCriteriaSequence", sequenceName = "cor_pub_proc_apl_criteria_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NotNull
    private BigDecimal value;

    @NotNull
    @NotBlank
    @Size(max = 120)
    private String name;

    @Column(name = "scoring_description")
    @Size(max = 256)
    private String scoringDescription;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
}
