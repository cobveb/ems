package pl.viola.ems.model.modules.administrator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationUnitRepository extends JpaRepository<OrganizationUnit, String> {
    @Query("SELECT ou FROM OrganizationUnit ou WHERE ou.parent is null")
    OrganizationUnit findMainOu();

    List<OrganizationUnit> findByActiveTrueAndParentIsNotNullOrderByName();

    Optional<OrganizationUnit> findByCode(String code);

    List<OrganizationUnit> findByActiveTrueAndRoleOrderByName(OrganizationUnit.Role role);

    List<OrganizationUnit> findByActiveTrueAndRoleAndCodeNot(OrganizationUnit.Role role, String code);

    Optional<OrganizationUnit> findByCodeAndActiveTrueAndRole(String code, OrganizationUnit.Role role);

    Optional<OrganizationUnit> findByCodeAndActiveTrueAndRoleIn(String code, List<OrganizationUnit.Role> roles);

    List<OrganizationUnit> findByParentAndActiveTrue(String parent);

    List<OrganizationUnit> findByDirectorAndRole(OrganizationUnit director, OrganizationUnit.Role role);

    List<OrganizationUnit> findByDirectorIsNullAndActiveTrueAndRole(OrganizationUnit.Role role);
}
