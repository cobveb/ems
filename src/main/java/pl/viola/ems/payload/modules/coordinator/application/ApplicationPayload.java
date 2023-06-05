package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationPayload {
    private Long id;

    private String number;

    private String orderedObject;

    private PublicProcurementPosition.EstimationType estimationType;

    private Application.ApplicationMode mode;

    private BigDecimal orderValueNet;

    private Application.ApplicationStatus status;

    private OrganizationUnit coordinator;

    private Date createDate;

    private Date sendDate;

}
