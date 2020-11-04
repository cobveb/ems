package pl.viola.ems.model.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@ToString(exclude = {"dictionary", "applicationPositions"})
@EqualsAndHashCode(exclude = {"dictionary", "applicationPositions"})
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dictionary_items", schema = "emsarch")
public class DictionaryItem {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "dictionaryItemSequence")
    @SequenceGenerator(name = "dictionaryItemSequence", sequenceName = "dict_item_seq", schema = "emsarch", allocationSize = 1)
    private Long id;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 10, message = "{valid.maxSize}")
    private String code;
    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 120, message = "{valid.maxSize}")
    private String name;
    @NonNull
    @Column(name = "is_active")
    private Boolean isActive;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="dictionary_code")
    private Dictionary dictionary;

    @JsonIgnore
    @OneToMany(mappedBy = "unit", cascade = CascadeType.MERGE)
    private Set<ApplicationPosition> applicationPositions = new HashSet<ApplicationPosition>();
}
