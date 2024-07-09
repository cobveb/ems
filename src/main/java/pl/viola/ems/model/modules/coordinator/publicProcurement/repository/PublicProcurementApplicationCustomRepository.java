package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPayload;

import java.util.List;
import java.util.Set;

public interface PublicProcurementApplicationCustomRepository {
    Page<ApplicationPayload> findApplicationsPageable(List<OrganizationUnit> coordinators, List<SearchCondition> conditions, Pageable pageable, Boolean isExport);

    Page<ApplicationPayload> findApplicationsPageableByAccessLevel(List<Application.ApplicationStatus> statuses, List<SearchCondition> conditions, Pageable pageable, Boolean isExport);

    Page<ApplicationPayload> findApplicationsPageableByDirector(List<Application.ApplicationStatus> statuses, Set<OrganizationUnit> coordinators, String role, List<SearchCondition> conditions, Pageable pageable, Boolean isExport);
}
