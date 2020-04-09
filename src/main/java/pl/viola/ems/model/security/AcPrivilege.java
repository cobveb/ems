package pl.viola.ems.model.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"acObjects", "acPermissions"})
@EqualsAndHashCode(exclude = {"acObjects", "acPermissions"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ac_privileges", schema = "emsarch")
public class AcPrivilege {
    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "privilegeSequence")
    @SequenceGenerator(name = "privilegesSequence", sequenceName = "ac_privilege_seq", schema = "emsarch", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 6)
    private String code;

    @NonNull
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "privileges")
    private Set<AcObject> acObjects = new HashSet<AcObject>();

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,  mappedBy = "acPrivilege")
    private Set<AcPermission> acPermissions = new HashSet<AcPermission>();

}
