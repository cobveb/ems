package pl.viola.ems.payload.export;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class ExcelHeadRow {
    @NonNull
    private String id;

    @NonNull
    private String label;

    @NonNull
    private String type;

    private String dateFormat;
}
