package pl.viola.ems.service.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;
import pl.viola.ems.payload.modules.accountant.coordinator.publicProcurement.ApplicationProtocolResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProtocolPayload;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface ApplicationProtocolService {
    List<ApplicationProtocolResponse> getProtocolsByAccessLevel(String accessLevel);

    ApplicationProtocolPayload getProtocolByApplication(Long applicationId);

    ApplicationProtocolPayload saveProtocol(ApplicationProtocolPayload protocol);

    ApplicationProtocolPayload saveProtocol(ApplicationProtocolPayload protocol, Long applicationId);

    String deleteApplicationProtocol(Long protocolId);

    ApplicationProtocolPayload deleteApplicationProtocolPrice(Long protocolId, Long priceId);

    ApplicationProtocolPayload updateProtocolStatus(Long protocolId, ApplicationProtocol.ProtocolStatus status);

    ApplicationProtocolPayload approveProtocol(Long protocolId, String levelAccess);

    ApplicationProtocol.ProtocolStatus sendBackProtocol(Long protocolId);

    void exportProtocolToJasper(Long applicationId, HttpServletResponse response) throws IOException, JRException, SQLException;

}
