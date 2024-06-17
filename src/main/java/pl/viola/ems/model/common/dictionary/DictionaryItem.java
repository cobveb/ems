package pl.viola.ems.model.common.dictionary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;
import pl.viola.ems.model.modules.coordinator.plans.FinancialSubPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@ToString(exclude = {"dictionary", "applicationPositions", "assortmentGroups", "modes", "financialSubPositions"})
@EqualsAndHashCode(exclude = {"dictionary", "applicationPositions", "assortmentGroups", "modes", "financialSubPositions"})
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dictionary_items", schema = "emsarch")
public class DictionaryItem implements DictItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dictionaryItemSequence")
    @SequenceGenerator(name = "dictionaryItemSequence", sequenceName = "dict_item_seq", schema = "emsarch", allocationSize = 1)
    private Long id;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 10, message = "{valid.maxSize}")
    private String code;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 160, message = "{valid.maxSize}")
    private String name;
    @NonNull
    @Column(name = "is_active")
    private Boolean isActive;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "dictionary_code")
    private Dictionary dictionary;

    @JsonIgnore
    @OneToMany(mappedBy = "unit", cascade = CascadeType.MERGE)
    private Set<ApplicationPosition> applicationPositions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "unit", cascade = CascadeType.MERGE)
    private Set<FinancialSubPosition> financialSubPositions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "assortmentGroup", cascade = CascadeType.MERGE)
    private Set<PublicProcurementPosition> assortmentGroups = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "mode", cascade = CascadeType.MERGE)
    private Set<PublicProcurementPosition> modes = new HashSet<>();

    @Override
    public String getItemName() {
        return this.name;
    }
}
