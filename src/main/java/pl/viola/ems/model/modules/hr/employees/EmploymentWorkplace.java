package pl.viola.ems.model.modules.hr.employees;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.hr.dictionary.Place;
import pl.viola.ems.model.modules.hr.dictionary.Workplace;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "hr_emp_eml_workplaces")
public class EmploymentWorkplace {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emlWorkplaceSequence")
    @SequenceGenerator(name = "emlWorkplaceSequence", sequenceName = "hr_emp_eml_workplace_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "workplace_id")
    private Workplace workplace;

    @NonNull
    @Column(name = "date_from")
    private Date dateFrom;

    @Column(name = "date_to")
    private Date dateTo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    private Text comments;

    @NonNull
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "employment_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Employment employment;

}
