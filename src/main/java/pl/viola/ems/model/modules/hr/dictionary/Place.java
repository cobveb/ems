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
public class Place extends AbstractPlace implements DictItem {

    @NonNull
    @ManyToOne
    @JoinColumn(name = "location_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private DictionaryItem location;

    @Override
    public String getCode() {
        return super.getId().toString();
    }

    @Override
    public String getItemName() {
        return super.getName();
    }

}
