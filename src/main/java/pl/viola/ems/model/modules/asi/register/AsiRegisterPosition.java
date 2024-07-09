package pl.viola.ems.model.modules.asi.register;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AsiRegisterPosition {
    private Long id;

    private String register;

    private String entitlementSystem;

    private String entitlementSystemPermission;

    private String employee;

    private String username;

}
