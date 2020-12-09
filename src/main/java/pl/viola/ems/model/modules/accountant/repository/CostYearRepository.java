package pl.viola.ems.model.modules.accountant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.util.List;
import java.util.Set;

@Repository
public interface CostYearRepository extends JpaRepository<CostYear, Long> {
    List<CostYear> findByYearAndCoordinatorsIn(int year, OrganizationUnit coordinator);

    Set<CostYear> findByCostType(CostType costType);
}
