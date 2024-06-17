package pl.viola.ems.model.modules.accountant.dictionary;

import lombok.*;
import pl.viola.ems.model.common.dictionary.DictItem;

import javax.persistence.*;
import javax.validation.constraints.Pattern;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "acc_contractors", schema = "emsadm")
public class Contractor implements DictItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contractorSequence")
    @SequenceGenerator(name = "contractorSequence", sequenceName = "contractor_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    private String name;

    private Boolean active;

    @Pattern(regexp = "^$|[0-9]{10}$", message = "{valid.nip}")
    private String nip;

    @Override
    public String getCode() {
        return "KTR" + this.id;
    }

    @Override
    public String getItemName() {
        return this.name;
    }
}
