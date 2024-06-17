package pl.viola.ems.model.common.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchConditions {

    private int page;

    private int rowsPerPage;

    private SearchSort sort;

    private ArrayList<SearchCondition> conditions;
}
