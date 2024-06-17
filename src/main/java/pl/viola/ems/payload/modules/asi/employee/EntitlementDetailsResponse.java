package pl.viola.ems.payload.modules.asi.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;

import java.time.Instant;
import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntitlementDetailsResponse {

    private Long id;

    private String username;

    private Date dateFrom;

    private Date dateTo;

    private Date dateWithdrawal;

    private Text comments;

    private EntitlementEmploymentResponse employment;

    private EntitlementSystem entitlementSystem;

    private String createdByStr;

    private Long createdBy;

    private String createdAtStr;

    private Instant createdAt;

    private String updatedByStr;

    private String updatedAtStr;

    private Set<EntitlementPermission> permissions;

}
