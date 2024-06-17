package pl.viola.ems.payload.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.search.SearchConditions;

import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportConditions {
    private ArrayList<ExcelHeadRow> headRows;

    private SearchConditions searchConditions;
}
