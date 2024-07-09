package pl.viola.ems.payload.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

@Data
@AllArgsConstructor
public class UserSummary {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private OrganizationUnit.Role ouRole;
}
