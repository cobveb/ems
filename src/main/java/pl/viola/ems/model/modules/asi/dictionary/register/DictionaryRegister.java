package pl.viola.ems.model.modules.asi.dictionary.register;

import lombok.*;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "asi_dict_registers", schema = "emsadm")
public class DictionaryRegister implements DictItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "asiDictRegSequence")
    @SequenceGenerator(name = "asiDictRegSequence", sequenceName = "asi_dict_reg_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Size(max = 150)
    private String name;

    @NonNull
    @Column(name = "is_active")
    private Boolean isActive;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "base_type_id")
    private DictionaryItem baseType;

    @Size(max = 500)
    private String description;

    @Override
    public String getCode() {
        return this.id.toString();
    }

    @Override
    public String getItemName() {
        return this.name;
    }
}
