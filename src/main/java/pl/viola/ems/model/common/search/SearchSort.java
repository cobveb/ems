package pl.viola.ems.model.common.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchSort {

    private String orderBy;

    private String orderType;
}
