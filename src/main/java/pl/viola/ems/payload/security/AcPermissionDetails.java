package pl.viola.ems.payload.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcPermissionDetails {

    private Long id;

    private String code;

    private String name;

}
