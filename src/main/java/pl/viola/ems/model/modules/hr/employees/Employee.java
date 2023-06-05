package pl.viola.ems.model.modules.hr.employees;

import lombok.*;
import pl.viola.ems.model.common.Text;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hr_employees", schema = "emsadm")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employeeSequence")
    @SequenceGenerator(name = "employeeSequence", sequenceName = "hr_employee_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 15)
    private String name;

    @NonNull
    @Size(max = 80)
    private String surname;

    @Size(max = 15)
    private String hrNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "comments_id", referencedColumnName = "id")
    private Text comments;

}
