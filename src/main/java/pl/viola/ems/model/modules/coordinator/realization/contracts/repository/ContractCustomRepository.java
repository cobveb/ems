package pl.viola.ems.model.modules.coordinator.realization.contracts.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.modules.coordinator.application.realization.contract.ContractPayload;

import java.util.List;

public interface ContractCustomRepository {
    Page<ContractPayload> findByCoordinatorAsDictionary(List<OrganizationUnit> coordinators, List<SearchCondition> conditions, Pageable pageable, Boolean isExport);

    Page<ContractPayload> findContractsPageable(List<OrganizationUnit> coordinators, List<SearchCondition> conditions, Pageable pageable, Boolean isExport, String accessLevel);
}
