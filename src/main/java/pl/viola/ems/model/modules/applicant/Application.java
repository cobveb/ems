package pl.viola.ems.model.modules.applicant;


import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"applicant", "coordinator", "positions"})
@EqualsAndHashCode(exclude = {"applicant", "coordinator", "positions"})
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "application", schema = "emsadm", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "app_number"
        })
})
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(
                name = "generateApplicationNumber",
                procedureName = "emsadm.application_mgmt.generate_number",
                parameters = {
                        @StoredProcedureParameter(name = "applicant", type = String.class, mode = ParameterMode.IN),
                        @StoredProcedureParameter(name = "new_number", type = String.class, mode = ParameterMode.OUT)
                }
        )
})
@DynamicUpdate()
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "applicationSequence")
    @SequenceGenerator(name = "applicationSequence", sequenceName = "application_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Column(name = "app_number")
    private String number;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private OrganizationUnit applicant;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private OrganizationUnit coordinator;

    @NonNull
    @NotBlank
    private String status;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "send_date")
    private Date sendDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "application", cascade = {CascadeType.ALL})
    private Set<ApplicationPosition> positions = new HashSet<>();

}
