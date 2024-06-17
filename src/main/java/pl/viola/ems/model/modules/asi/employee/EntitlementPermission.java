package pl.viola.ems.model.modules.asi.employee;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystemPermission;
import pl.viola.ems.model.modules.hr.dictionary.Place;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "asi_emp_ent_permission", schema = "emsadm")
public class EntitlementPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entitlementPermissionSequence")
    @SequenceGenerator(name = "entitlementPermissionSequence", sequenceName = "asi_emp_ent_perm_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sys_perm_id")
    private EntitlementSystemPermission entitlementSystemPermission;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "asi_ent_perm_workplace", schema = "emsadm",
            joinColumns = @JoinColumn(name = "permission_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "workplace_id", referencedColumnName = "id"))
    private Set<Place> places = new HashSet<>();


    @NonNull
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "entitlement_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Entitlement entitlement;
}
