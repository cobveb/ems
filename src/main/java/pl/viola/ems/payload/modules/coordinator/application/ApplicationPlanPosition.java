package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationPlanPosition {
    private Long id;

    private String code;

    private String name;

    private BigDecimal amountAwardedNet;

    private BigDecimal amountAwardedGross;

}
