package pl.viola.ems.model.modules.asi.dictionary.employee;

import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.dictionary.DictItem;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
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

    @Override
    public String getCode() {
        return this.getId().toString();
    }

    @Override
    public String getItemName() {
        return this.getName();
    }
}
