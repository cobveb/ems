package pl.viola.ems.payload.modules.coordinator.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocolPrice;

import java.math.BigDecimal;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationProtocolPayload {
    private Long id;

    private ApplicationProtocol.ProtocolStatus status;

    private Boolean email;

    private Boolean phone;

    private Boolean internet;

    private Boolean paper;

    private Boolean other;

    private String otherDesc;

    private Boolean renouncement;

    private String nonCompetitiveOffer;

    private String receivedOffers;

    private String justificationChoosingOffer;

    private Contractor contractor;

    private String contractorDesc;

    private User sendUser;

    private User publicAcceptUser;

    private User accountantAcceptUser;

    private User chiefAcceptUser;

    private Set<ApplicationProtocolPrice> prices;

    private BigDecimal pricesAmountNet;

    private BigDecimal pricesAmountGross;
}
