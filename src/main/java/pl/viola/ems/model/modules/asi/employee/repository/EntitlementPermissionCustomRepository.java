package pl.viola.ems.model.modules.asi.employee.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.asi.register.AsiRegisterPosition;

import java.util.List;

public interface EntitlementPermissionCustomRepository {
    Page<AsiRegisterPosition> findRegistersPositionsPageable(List<SearchCondition> conditions, Pageable pageable, Boolean isExport);
}
