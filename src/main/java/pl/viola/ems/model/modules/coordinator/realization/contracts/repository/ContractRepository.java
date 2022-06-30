package pl.viola.ems.model.modules.coordinator.realization.contracts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;

import java.util.List;
import java.util.Set;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Set<Contract> findByCoordinatorIn(List<OrganizationUnit> coordinators);
}
