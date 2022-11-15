package pl.viola.ems.payload.modules.accountant.coordinator.publicProcurement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationProtocolResponse {

    private Long id;

    private Long applicationId;

    private ApplicationProtocol.ProtocolStatus status;

    //Application ordered object
    private String orderedObject;

    //Application number
    private String number;

    private Application.ApplicationStatus applicationStatus;

    private OrganizationUnit applicationCoordinator;
}
