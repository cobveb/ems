package pl.viola.ems.service.modules.administrator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.repository.OrganizationUnitRepository;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

@Service
public class OrganizationUnitServiceImpl implements OrganizationUnitService {

    @Autowired
    private OrganizationUnitRepository organizationUnitRepository;

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
        if (action.toLowerCase().equals("add")) {
            if (!organizationUnitRepository.existsById(ou.getCode())) {
                return organizationUnitRepository.saveAndFlush(ou);
            } else {
                throw new AppException("Administrator.organizationUnit.exists", HttpStatus.BAD_REQUEST);
            }
        } else if (action.toLowerCase().equals("edit")) {
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
        if (!organizationUnitRepository.findById(code).get().getUsers().isEmpty()) {
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
        return organizationUnitRepository.findByActiveTrueAndCoordinatorTrue();
    }

    @Override
    public Optional<OrganizationUnit> findCoordinatorByCode(String code) {
        return organizationUnitRepository.findByCodeAndActiveTrueAndCoordinatorTrue(code);
    }

    @Override
    public List<OrganizationUnit> findByParent(String parent) {
        return organizationUnitRepository.findByParentAndActiveTrue(parent);
    }
}
