package pl.viola.ems.service.modules.coordinator.publicProcurement.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocolPrice;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.ApplicationProtocolPriceRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.ApplicationProtocolRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementApplicationRepository;
import pl.viola.ems.payload.modules.accountant.coordinator.publicProcurement.ApplicationProtocolResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProtocolPayload;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

@Service
public class ApplicationProtocolServiceImpl implements ApplicationProtocolService {
    private static final Logger logger = LoggerFactory.getLogger(PublicProcurementApplicationServiceImpl.class);

    @Autowired
    ApplicationProtocolRepository applicationProtocolRepository;

    @Autowired
    ApplicationProtocolPriceRepository applicationProtocolPriceRepository;

    @Autowired
    PublicProcurementApplicationRepository publicProcurementApplicationRepository;

    @Autowired
    MessageSource messageSource;

    @Autowired
    JasperPrintService jasperPrintService;

    @Override
    public Set<ApplicationProtocolResponse> getProtocolsByAccessLevel(final int year, final String accessLevel) {
        Set<ApplicationProtocol> protocols = new HashSet<>();
        Set<ApplicationProtocolResponse> applicationProtocolResponses = new HashSet<>();
        List<Long> ids = new ArrayList<>();
        LocalDate curYear = LocalDate.of(year, Month.JANUARY, 1);
        Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
        Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));

        Set<Application> applications = publicProcurementApplicationRepository.
                findBySendDateBetweenAndEstimationTypeAndApplicationProtocolIsNotNull(firstDay, lastDay, PublicProcurementPosition.EstimationType.DO130);

        applications.forEach(application -> ids.add(application.getApplicationProtocol().getId()));

        System.out.println(year);
        System.out.println(ids.size());


        switch (accessLevel) {
            case "public":
                protocols = applicationProtocolRepository.findByIdInAndStatusIn(ids, new ArrayList<>(Arrays.asList(
                        ApplicationProtocol.ProtocolStatus.WY,
                        ApplicationProtocol.ProtocolStatus.AZ,
                        ApplicationProtocol.ProtocolStatus.AK,
                        ApplicationProtocol.ProtocolStatus.ZA
                )));
                break;
            case "accountant":
                protocols = applicationProtocolRepository.findByIdInAndStatusIn(ids, new ArrayList<>(Arrays.asList(
                        ApplicationProtocol.ProtocolStatus.AZ,
                        ApplicationProtocol.ProtocolStatus.AK,
                        ApplicationProtocol.ProtocolStatus.ZA
                )));
                break;
            case "director":
                protocols = applicationProtocolRepository.findByIdInAndStatusIn(ids, new ArrayList<>(Arrays.asList(
                        ApplicationProtocol.ProtocolStatus.AK,
                        ApplicationProtocol.ProtocolStatus.ZA
                )));
                break;
        }

        protocols.forEach(protocol -> {
            ApplicationProtocolResponse applicationProtocolResponse = new ApplicationProtocolResponse(
                    protocol.getId(),
                    protocol.getApplication().getId(),
                    protocol.getStatus(),
                    protocol.getApplication().getOrderedObject().getContent(),
                    protocol.getApplication().getNumber(),
                    protocol.getApplication().getStatus(),
                    protocol.getApplication().getCoordinator()
            );
            applicationProtocolResponses.add(applicationProtocolResponse);
        });
        return applicationProtocolResponses;
    }

    @Override
    public ApplicationProtocolPayload getProtocolByApplication(final Long applicationId) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        if (application.getApplicationProtocol() != null) {
            return generateApplicationProtocolPayload(applicationProtocolRepository.findById(application.getApplicationProtocol().getId())
                    .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.protocolNotFound", HttpStatus.NOT_FOUND)));
        } else {
            return null;
        }
    }

    @Transactional
    @Override
    public ApplicationProtocolPayload saveProtocol(final ApplicationProtocolPayload protocol) {
        ApplicationProtocol applicationProtocol = applicationProtocolRepository.findById(protocol.getId())
                .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND));
        if (!protocol.getPrices().isEmpty()) {
            protocol.getPrices().forEach(price -> price.setApplicationProtocol(applicationProtocol));
        }
        applicationProtocol.setPrices(protocol.getPrices());

        if (applicationProtocol.getOtherDesc() != null && protocol.getOtherDesc() != null && !applicationProtocol.getOtherDesc().getContent().equals(protocol.getOtherDesc())) {
            applicationProtocol.getOtherDesc().setContent(protocol.getOtherDesc());
        } else if (protocol.getOtherDesc() != null) {
            applicationProtocol.setOtherDesc(new Text(protocol.getOtherDesc()));
        }
        if (applicationProtocol.getJustificationChoosingOffer() != null && protocol.getJustificationChoosingOffer() != null) {
            applicationProtocol.getJustificationChoosingOffer().setContent(protocol.getJustificationChoosingOffer());
        } else if (protocol.getJustificationChoosingOffer() != null) {
            applicationProtocol.setJustificationChoosingOffer(new Text(protocol.getJustificationChoosingOffer()));
        }
        if (applicationProtocol.getNonCompetitiveOffer() != null && protocol.getNonCompetitiveOffer() != null) {
            applicationProtocol.getNonCompetitiveOffer().setContent(protocol.getNonCompetitiveOffer());
        } else if (protocol.getNonCompetitiveOffer() != null) {
            applicationProtocol.setNonCompetitiveOffer(new Text(protocol.getNonCompetitiveOffer()));
        }
        if (applicationProtocol.getReceivedOffers() != null && protocol.getReceivedOffers() != null) {
            applicationProtocol.getReceivedOffers().setContent(protocol.getReceivedOffers());
        } else if (protocol.getReceivedOffers() != null) {
            applicationProtocol.setReceivedOffers(new Text(protocol.getReceivedOffers()));
        }
        if (applicationProtocol.getContractorDesc() != null && protocol.getContractorDesc() != null) {
            applicationProtocol.getContractorDesc().setContent(protocol.getContractorDesc());
        } else if (protocol.getContractorDesc() != null) {
            applicationProtocol.setContractorDesc(new Text(protocol.getContractorDesc()));
        }

        if (protocol.getStatus() == null) {
            applicationProtocol.setStatus(ApplicationProtocol.ProtocolStatus.ZP);
        }
        return generateApplicationProtocolPayload(applicationProtocolRepository.save(applicationProtocol));
    }

    @Transactional
    @Override
    public ApplicationProtocolPayload saveProtocol(ApplicationProtocolPayload protocolPayload, Long applicationId) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        ApplicationProtocol protocol;
        if (!protocolPayload.getPrices().isEmpty()) {
            protocolPayload.getPrices().forEach(price -> price.setApplicationProtocol(application.getApplicationProtocol()));
        }
        if (application.getApplicationProtocol() == null) {
            protocol = generateApplicationProtocol(protocolPayload, new ApplicationProtocol());
            protocol.setStatus(ApplicationProtocol.ProtocolStatus.ZP);
            application.setApplicationProtocol(protocol);
        } else {
            protocol = generateApplicationProtocol(protocolPayload, application.getApplicationProtocol());
        }
        return generateApplicationProtocolPayload(applicationProtocolRepository.save(protocol));
    }

    @Transactional
    @Override
    public String deleteApplicationProtocol(final Long protocolId) {
        if (applicationProtocolRepository.existsById(protocolId)) {
            applicationProtocolRepository.deleteById(protocolId);
            return messageSource.getMessage("Coordinator.publicProcurement.application.protocolDeleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Coordinator.publicProcurement.application.protocolNotFound", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @Override
    public ApplicationProtocolPayload deleteApplicationProtocolPrice(final Long protocolId, final Long priceId) {
        ApplicationProtocol applicationProtocol = applicationProtocolRepository.findById(protocolId)
                .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND));
        if (applicationProtocol.getPrices().stream().filter(price -> priceId.equals(price.getId())).findFirst().orElse(null) != null) {
            applicationProtocolPriceRepository.deleteById(priceId);
            applicationProtocol.setPrices(applicationProtocol.getPrices().stream().filter(price -> !price.getId().equals(priceId)).collect(Collectors.toSet()));

            return generateApplicationProtocolPayload(applicationProtocol);

        } else {
            throw new AppException("Coordinator.publicProcurement.application.protocolNotContainMsg", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ApplicationProtocolPayload updateProtocolStatus(final Long protocolId, final ApplicationProtocol.ProtocolStatus status) {
        User user = Utils.getCurrentUser();

        ApplicationProtocol protocol = applicationProtocolRepository.findById(protocolId)
                .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND));
        if (status.equals(ApplicationProtocol.ProtocolStatus.WY)) {
            protocol.setStatus(ApplicationProtocol.ProtocolStatus.WY);
            protocol.setSendUser(user);
        }

        return generateApplicationProtocolPayload(applicationProtocolRepository.save(protocol));
    }

    @Override
    @Transactional
    public ApplicationProtocolPayload approveProtocol(Long protocolId, String levelAccess) {
        User user = Utils.getCurrentUser();

        ApplicationProtocol protocol = applicationProtocolRepository.findById(protocolId)
                .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND));

        if (levelAccess.equals("public")) {
            protocol.setStatus(ApplicationProtocol.ProtocolStatus.AZ);
            protocol.setPublicAcceptUser(user);
        } else if (levelAccess.equals("accountant")) {
            protocol.setStatus(ApplicationProtocol.ProtocolStatus.AK);
            protocol.setAccountantAcceptUser(user);
        } else {
            protocol.setStatus(ApplicationProtocol.ProtocolStatus.ZA);
            protocol.setChiefAcceptUser(user);
        }

        return generateApplicationProtocolPayload(applicationProtocolRepository.save(protocol));
    }

    @Override
    public ApplicationProtocol.ProtocolStatus sendBackProtocol(Long protocolId) {
        ApplicationProtocol protocol = applicationProtocolRepository.findById(protocolId)
                .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND));

        protocol.setStatus(ApplicationProtocol.ProtocolStatus.ZP);
        protocol.setSendUser(null);
        protocol.setPublicAcceptUser(null);
        protocol.setAccountantAcceptUser(null);

        return applicationProtocolRepository.save(protocol).getStatus();
    }

    @Override
    public void exportProtocolToJasper(Long protocolId, HttpServletResponse response) throws IOException, JRException, SQLException {
        logger.info("generate protocol pdf " + protocolId);
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(protocolId, "/jasper/prints/modules/coordinator/publicProcurement/protocol.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    private ApplicationProtocolPayload generateApplicationProtocolPayload(ApplicationProtocol protocol) {
        ApplicationProtocolPayload protocolPayload = new ApplicationProtocolPayload();

        protocolPayload.setId(protocol.getId());
        protocolPayload.setStatus(protocol.getStatus());
        protocolPayload.setEmail(protocol.getEmail());
        protocolPayload.setPhone(protocol.getPhone());
        protocolPayload.setInternet(protocol.getInternet());
        protocolPayload.setPaper(protocol.getPaper());
        protocolPayload.setOther(protocol.getOther());
        if (protocol.getOtherDesc() != null) {
            protocolPayload.setOtherDesc(protocol.getOtherDesc().getContent());
        }
        protocolPayload.setRenouncement(protocol.getRenouncement());
        if (protocol.getNonCompetitiveOffer() != null) {
            protocolPayload.setNonCompetitiveOffer(protocol.getNonCompetitiveOffer().getContent());
        }
        if (protocol.getReceivedOffers() != null) {
            protocolPayload.setReceivedOffers(protocol.getReceivedOffers().getContent());
        }
        if (protocol.getJustificationChoosingOffer() != null) {
            protocolPayload.setJustificationChoosingOffer(protocol.getJustificationChoosingOffer().getContent());
        }
        protocolPayload.setContractor(protocol.getContractor());
        if (protocol.getContractorDesc() != null) {
            protocolPayload.setContractorDesc(protocol.getContractorDesc().getContent());
        }
        protocolPayload.setSendUser(protocol.getSendUser());
        protocolPayload.setPublicAcceptUser(protocol.getPublicAcceptUser());
        protocolPayload.setAccountantAcceptUser(protocol.getAccountantAcceptUser());
        protocolPayload.setChiefAcceptUser(protocol.getChiefAcceptUser());
        protocolPayload.setPrices(protocol.getPrices());
        if (!protocol.getPrices().isEmpty()) {
            protocolPayload.setPricesAmountNet(protocol.getPrices().stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            protocolPayload.setPricesAmountGross(protocol.getPrices().stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return protocolPayload;
    }

    private ApplicationProtocol generateApplicationProtocol(ApplicationProtocolPayload protocolPayload, ApplicationProtocol protocol) {
        protocol.setId(protocolPayload.getId());
        protocol.setStatus(protocolPayload.getStatus());
        protocol.setEmail(protocolPayload.getEmail());
        protocol.setPhone(protocolPayload.getPhone());
        protocol.setInternet(protocolPayload.getInternet());
        protocol.setPaper(protocolPayload.getPaper());
        protocol.setOther(protocolPayload.getOther());
        if (protocol.getOtherDesc() != null && protocolPayload.getOtherDesc() != null) {
            protocol.getOtherDesc().setContent(protocolPayload.getOtherDesc());
        } else if (protocolPayload.getOtherDesc() != null) {
            protocol.setOtherDesc(new Text(protocolPayload.getOtherDesc()));
        }
        protocol.setRenouncement(protocolPayload.getRenouncement());
        if (protocol.getNonCompetitiveOffer() != null && protocolPayload.getNonCompetitiveOffer() != null) {
            protocol.getNonCompetitiveOffer().setContent(protocolPayload.getNonCompetitiveOffer());
        } else if (protocolPayload.getNonCompetitiveOffer() != null) {
            protocol.setNonCompetitiveOffer(new Text(protocolPayload.getNonCompetitiveOffer()));
        }
        if (protocol.getReceivedOffers() != null && protocolPayload.getReceivedOffers() != null) {
            protocol.getReceivedOffers().setContent(protocolPayload.getReceivedOffers());
        } else if (protocolPayload.getReceivedOffers() != null) {
            protocol.setReceivedOffers(new Text(protocolPayload.getReceivedOffers()));
        }
        if (protocol.getJustificationChoosingOffer() != null && protocolPayload.getJustificationChoosingOffer() != null) {
            protocol.getJustificationChoosingOffer().setContent(protocolPayload.getJustificationChoosingOffer());
        } else if (protocolPayload.getJustificationChoosingOffer() != null) {
            protocol.setJustificationChoosingOffer(new Text(protocolPayload.getJustificationChoosingOffer()));
        }
        protocol.setContractor(protocolPayload.getContractor());
        if (protocol.getContractorDesc() != null && protocolPayload.getContractorDesc() != null) {
            protocol.getContractorDesc().setContent(protocolPayload.getContractorDesc());
        } else if (protocolPayload.getContractorDesc() != null) {
            protocol.setContractorDesc(new Text(protocolPayload.getContractorDesc()));
        }
        protocol.setSendUser(protocolPayload.getSendUser());
        protocol.setAccountantAcceptUser(protocolPayload.getAccountantAcceptUser());
        protocol.setChiefAcceptUser(protocolPayload.getChiefAcceptUser());
        protocol.setPrices(protocolPayload.getPrices());

        return protocol;
    }
}
