package pl.viola.ems.model.modules.asi.dictionary.employee;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"description", "dictionaryRegister"})
@EqualsAndHashCode(exclude = {"description", "dictionaryRegister"})
@Table(name = "asi_entitlement_system", schema = "emsadm")
public class EntitlementSystem implements DictItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entitlementSystemSequence")
    @SequenceGenerator(name = "entitlementSystemSequence", sequenceName = "asi_entitlement_sys_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @NotBlank
    @Size(max = 100)
    private String name;

    @NonNull
    @Column(name = "is_active")
    private Boolean isActive;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "desc_id", referencedColumnName = "id")
    private Text description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "register_id")
    @JsonIgnore
    private DictionaryRegister register;

    @Override
    public String getCode() {
        return this.getId().toString();
    }

    @Override
    public String getItemName() {
        return this.getName();
    }
}
