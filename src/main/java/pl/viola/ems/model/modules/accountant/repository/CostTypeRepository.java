package pl.viola.ems.model.modules.accountant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;

import java.util.List;

@Repository
public interface CostTypeRepository extends JpaRepository<CostType, Long> {
    List<CostType> findByActiveTrueAndYearsIn(List<CostYear> year);
}
