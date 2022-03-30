package pl.viola.ems.model.modules.accountant.dictionary;

import lombok.*;
import pl.viola.ems.model.common.dictionary.DictItem;

import javax.persistence.*;

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

    @Override
    public String getCode() {
        return "KTR" + this.id;
    }
}
