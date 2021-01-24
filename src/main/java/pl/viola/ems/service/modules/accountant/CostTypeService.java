package pl.viola.ems.service.modules.accountant;

import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.payload.modules.accountant.CostTypeResponse;

import java.util.List;
import java.util.Set;

public interface CostTypeService {
    List<CostTypeResponse> findAll();

    List<CostTypeResponse> findByYearAndCoordinator(int year, String coordinator);

    Set<CostYear> findYearsByCostType(long costId);

    CostType saveCostType(CostType costType);

    String deleteCostType(Long costId);
}
