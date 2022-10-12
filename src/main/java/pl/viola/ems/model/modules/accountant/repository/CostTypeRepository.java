package pl.viola.ems.model.modules.accountant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;

import java.util.List;

@Repository
public interface CostTypeRepository extends JpaRepository<CostType, Long> {
    List<CostType> findByActiveTrueAndYearsIn(List<CostYear> year);

    @Procedure(name = "generateCostsType")
    String generateCostsTypesOnYear(@Param("p_source_year") int sourceYear, @Param("p_target_year") int targetYear);
}
