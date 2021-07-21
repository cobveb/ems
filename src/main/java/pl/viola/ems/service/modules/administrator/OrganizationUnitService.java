package pl.viola.ems.service.modules.administrator;

import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface OrganizationUnitService {
    List<OrganizationUnit> findAll();

    OrganizationUnit findMainOu();

    OrganizationUnit saveOu(String action, OrganizationUnit ou);

    Optional<OrganizationUnit> findById(String code);

    String deleteById(String code);

    List<OrganizationUnit> findActive();

    List<OrganizationUnit> findCoordinators();

    List<OrganizationUnit> findCoordinatorsPublicProcurementApplication();

    List<OrganizationUnit> findUnassignedCoordinators();

    Set<OrganizationUnit> addDirectorCoordinators(String directorCode, List<OrganizationUnit> coordinators);

    Set<OrganizationUnit> removeDirectorCoordinators(String directorCode, OrganizationUnit coordinator);

    List<OrganizationUnit> findCoordinatorsByDirector(String code);

    Optional<OrganizationUnit> findCoordinatorByCode(String code);

    List<OrganizationUnit> findByParent(String parent);

}
