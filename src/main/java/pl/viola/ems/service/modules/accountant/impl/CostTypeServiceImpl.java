package pl.viola.ems.service.modules.accountant.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.model.modules.accountant.repository.CostTypeRepository;
import pl.viola.ems.model.modules.accountant.repository.CostYearRepository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.modules.accountant.CostTypeResponse;
import pl.viola.ems.service.modules.accountant.CostTypeService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CostTypeServiceImpl implements CostTypeService {

    @Autowired
    CostTypeRepository costTypeRepository;

    @Autowired
    CostYearRepository costYearRepository;

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    MessageSource messageSource;

    @Override
    public List<CostTypeResponse> findAll() {
        return costTypeRepository.findAll().stream().map(cost ->
                new CostTypeResponse(cost.getId(), cost.getCode(), cost.getName(), cost.getActive())
        ).collect(Collectors.toList());
    }

    @Override
    public List<CostTypeResponse> findByYearAndCoordinator(final int year, final String coordinatorCode) {

        Optional<OrganizationUnit> coordinator = Optional.ofNullable(organizationUnitService.findCoordinatorByCode(coordinatorCode)
                .orElseThrow(() -> new AppException("Applicant.coordinator.notFound", HttpStatus.NOT_FOUND)));

        return costTypeRepository.findByActiveTrueAndYearsIn(
                costYearRepository.findByYearAndCoordinatorsIn(
                        year, coordinator.orElse(null)
                )
        ).stream().map(cost ->
                new CostTypeResponse(cost.getId(), cost.getCode(), cost.getName(), cost.getActive())
        ).collect(Collectors.toList());

    }

    @Override
    public Set<CostYear> findYearsByCostType(final long costId) {
        return costYearRepository.findByCostType(
                costTypeRepository.findById(costId).orElseThrow(() -> new AppException("Accountant.costType.notFound", HttpStatus.NOT_FOUND))
        );
    }

    @Override
    @Transactional
    public CostType saveCostType(final CostType costType) {

        if (!costType.getYears().isEmpty()) {
            costType.getYears().forEach(year -> year.setCostType(costType));
        }

        return costTypeRepository.save(costType);
    }

    @Override
    @Transactional
    public String deleteCostType(Long costId) {
        if (!costTypeRepository.existsById(costId)) {
            throw new AppException("Accountant.costType.notFound", HttpStatus.BAD_REQUEST);
        }

        costTypeRepository.deleteById(costId);

        return messageSource.getMessage("Accountant.costType.deleteMsg", null, Locale.getDefault());
    }

}


