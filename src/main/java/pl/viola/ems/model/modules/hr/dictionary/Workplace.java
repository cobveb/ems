package pl.viola.ems.model.modules.hr.dictionary;

import lombok.*;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import javax.persistence.*;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
@Table(name = "hr_places", schema = "emsadm")
public class Workplace extends AbstractPlace implements DictItem {

    @NonNull
    @ManyToOne
    @JoinColumn(name = "group_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private DictionaryItem group;

    @Override
    public String getCode() {
        return super.getId().toString();
    }

}
