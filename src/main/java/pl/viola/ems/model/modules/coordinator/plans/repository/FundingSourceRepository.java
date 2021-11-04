package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.FundingSource;

@Repository
public interface FundingSourceRepository extends JpaRepository<FundingSource, Long> {

}
