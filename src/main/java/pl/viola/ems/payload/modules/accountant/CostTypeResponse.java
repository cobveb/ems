package pl.viola.ems.payload.modules.accountant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.accountant.CostYear;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostTypeResponse {

    private Long id;

    private String code;

    private String name;

    private String itemName;

    private Boolean active;

    private Set<CostYear> years;
}
