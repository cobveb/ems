package pl.viola.ems.model.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
@ToString(exclude = {"acPermissions", "privileges"})
@EqualsAndHashCode(exclude = {"acPermissions", "privileges"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ac_objects", schema = "emsarch", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
        "domain_model_id",
        "domain_model_class"
    })
})
public class AcObject {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "acObjectSequence")
    @SequenceGenerator(name = "acObjectSequence", sequenceName = "ac_objects_seq", schema = "emsarch", allocationSize = 1)
    private Long id;

    @NonNull
    @Column(name = "domain_model_id")
    private Long domainModelId;

    @NonNull
    private String name;

    @Column(name = "domain_model_class")
    private String objectClass;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,  mappedBy = "acObject")
    private Set<AcPermission> acPermissions = new HashSet<AcPermission>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "ac_object_privileges", schema = "emsarch",
            joinColumns = @JoinColumn (name = "ac_object_id"),
            inverseJoinColumns = @JoinColumn (name = "ac_privilege_id"))
    private Set<AcPrivilege> privileges = new HashSet<AcPrivilege>();

}
