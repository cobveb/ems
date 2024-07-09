package pl.viola.ems.model.modules.asi.dictionary.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;

import java.util.Set;

@Repository
public interface EntitlementSystemRepository extends JpaRepository<EntitlementSystem, Long> {

    Set<EntitlementSystem> findAllByOrderByName();

    Set<EntitlementSystem> findByIsActiveTrueOrderByName();

    Set<EntitlementSystem> findByRegisterIsNullAndIsActiveTrueOrderByName();

    Set<EntitlementSystem> findByRegisterAndIsActiveTrueOrderByName(DictionaryRegister register);
}
