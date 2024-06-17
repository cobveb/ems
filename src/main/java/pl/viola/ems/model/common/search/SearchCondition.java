package pl.viola.ems.model.common.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchCondition {
    private String name;

    private String type;

    private String value;
}
