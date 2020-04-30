package pl.viola.ems.service.modules.administrator;

import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.util.List;
import java.util.Optional;

public interface OrganizationUnitService {
    List<OrganizationUnit> findAll();

    OrganizationUnit findMainOu();

    OrganizationUnit saveOu(String action, OrganizationUnit ou);

    Optional<OrganizationUnit> findById(String code);

    String deleteById(String code);

    List<OrganizationUnit> findActive();

}
