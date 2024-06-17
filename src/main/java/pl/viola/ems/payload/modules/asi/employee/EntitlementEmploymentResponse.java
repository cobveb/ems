package pl.viola.ems.payload.modules.asi.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntitlementEmploymentResponse {
    private Long id;

    private String code;

    private String number;

    private String name;

    private String itemName;

    private Date dateFrom;

    private Date dateTo;
}
