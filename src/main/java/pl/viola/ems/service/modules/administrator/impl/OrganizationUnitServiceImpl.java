package pl.viola.ems.service.modules.administrator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.repository.OrganizationUnitRepository;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.utils.Utils;

import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.Set;

@Service
public class OrganizationUnitServiceImpl implements OrganizationUnitService {

    @Autowired
    OrganizationUnitRepository organizationUnitRepository;

    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

    @Override
    public List<OrganizationUnit> findAll() {
        if (organizationUnitRepository.findAll().isEmpty()) {
            throw new AppException("Administrator.organizationUnits.notFound", HttpStatus.NOT_FOUND);
        } else if (organizationUnitRepository.findMainOu() == null) {
            throw new AppException("Administrator.organizationUnit.mainNotFound", HttpStatus.NOT_FOUND);
        }

        return organizationUnitRepository.findAll();
    }

    @Override
    public OrganizationUnit findMainOu() {

        if (organizationUnitRepository.findMainOu() == null) {
            if (organizationUnitRepository.count() > 0) {
                throw new AppException("Administrator.organizationUnit.mainNotFound", HttpStatus.NOT_FOUND);
            }
        }

        return organizationUnitRepository.findMainOu();
    }

    @Override
    public OrganizationUnit saveOu(final String action, final OrganizationUnit ou) {
        if (action.equalsIgnoreCase("add")) {
            if (!organizationUnitRepository.existsById(ou.getCode())) {
                return organizationUnitRepository.saveAndFlush(ou);
            } else {
                throw new AppException("Administrator.organizationUnit.exists", HttpStatus.BAD_REQUEST);
            }
        } else if (action.equalsIgnoreCase("edit")) {
            return organizationUnitRepository.saveAndFlush(ou);
        } else {
            throw new AppException("Administrator.organizationUnit.invalidAction", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Optional<OrganizationUnit> findById(String code) {
        return organizationUnitRepository.findById(code);
    }

    @Override
    public String deleteById(String code) {
        if (!organizationUnitRepository.findById(code)
                .orElseThrow(() -> new AppException("Administrator.organizationUnits.notFound", HttpStatus.NOT_FOUND)).getUsers().isEmpty()) {
            throw new AppException("Administrator.organizationUnits.deleteOu.userFound", HttpStatus.BAD_REQUEST);
        } else {
            organizationUnitRepository.deleteById(code);
            return bundle.getString("Administrator.organizationUnits.deleteOu");
        }
    }

    @Override
    public List<OrganizationUnit> findActive() {
        return organizationUnitRepository.findByActiveTrueAndParentIsNotNullOrderByName();
    }

    @Override
    public List<OrganizationUnit> findCoordinators() {
        return organizationUnitRepository.findByActiveTrueAndRole(OrganizationUnit.Role.COORDINATOR);
    }

    @Override
    public List<OrganizationUnit> findCoordinatorsPublicProcurementApplication() {
        return organizationUnitRepository.findByActiveTrueAndRoleAndCodeNot(OrganizationUnit.Role.COORDINATOR, Utils.getCurrentUser().getOrganizationUnit().getCode());
    }

    @Override
    public List<OrganizationUnit> findUnassignedCoordinators() {
        return organizationUnitRepository.findByDirectorIsNullAndActiveTrueAndRole(OrganizationUnit.Role.COORDINATOR);
    }

    @Override
    public Set<OrganizationUnit> addDirectorCoordinators(String directorCode, List<OrganizationUnit> coordinators) {
        OrganizationUnit director = organizationUnitRepository.findByCodeAndActiveTrueAndRole(directorCode, OrganizationUnit.Role.DIRECTOR)
                .orElseThrow(() -> new AppException("Administrator.organizationUnit.directorNotFound", HttpStatus.NOT_FOUND));
        if (!coordinators.isEmpty()) {
            coordinators.forEach(coordinator -> coordinator.setDirector(director));
            organizationUnitRepository.saveAll(coordinators);
            director.getDirectorCoordinators();
        }

        return director.getDirectorCoordinators();
    }

    @Override
    public Set<OrganizationUnit> removeDirectorCoordinators(String directorCode, OrganizationUnit coordinator) {
        OrganizationUnit director = organizationUnitRepository.findByCodeAndActiveTrueAndRole(directorCode, OrganizationUnit.Role.DIRECTOR)
                .orElseThrow(() -> new AppException("Administrator.organizationUnit.directorNotFound", HttpStatus.NOT_FOUND));
        if (coordinator.getRole().equals(OrganizationUnit.Role.COORDINATOR)) {
            coordinator.setDirector(null);
            organizationUnitRepository.save(coordinator);
            director.removeDirectorCoordinator(coordinator);
        } else {
            throw new AppException("Administrator.organizationUnit.coordinatorNotFound", HttpStatus.BAD_REQUEST);
        }

        return director.getDirectorCoordinators();
    }

    @Override
    public List<OrganizationUnit> findCoordinatorsByDirector(String code) {
        OrganizationUnit director = organizationUnitRepository.findByCodeAndActiveTrueAndRole(code, OrganizationUnit.Role.DIRECTOR)
                .orElseThrow(() -> new AppException("Administrator.organizationUnit.directorNotFound", HttpStatus.NOT_FOUND));
        return organizationUnitRepository.findByDirectorAndRole(director, OrganizationUnit.Role.COORDINATOR);
    }

    @Override
    public Optional<OrganizationUnit> findCoordinatorByCode(String code) {
        return organizationUnitRepository.findByCodeAndActiveTrueAndRole(code, OrganizationUnit.Role.COORDINATOR);
    }

    @Override
    public List<OrganizationUnit> findByParent(String parent) {
        return organizationUnitRepository.findByParentAndActiveTrue(parent);
    }
}
