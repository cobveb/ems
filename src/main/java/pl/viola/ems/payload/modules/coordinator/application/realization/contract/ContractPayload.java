package pl.viola.ems.payload.modules.coordinator.application.realization.contract;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractPayload {
    private Long id;

    private String code;

    private String number;

    private String contractObject;

    private String coordinator;

    private Date signingDate;

    private String itemName;

    private BigDecimal contractValueNet;

    private BigDecimal contractValueGross;

    private BigDecimal invoicesValueNet;

    private BigDecimal invoicesValueGross;

    private BigDecimal realPrevYearsValueNet;

    private BigDecimal realPrevYearsValueGross;

    private BigDecimal realizedValueGross;

}
