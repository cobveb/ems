package pl.viola.ems.payload.modules.accountant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostTypeResponse {

    private Long id;

    private String code;

    private String name;

    private Boolean active;
}
