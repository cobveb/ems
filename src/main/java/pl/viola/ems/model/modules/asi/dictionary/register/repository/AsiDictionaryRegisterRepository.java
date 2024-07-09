package pl.viola.ems.model.modules.asi.dictionary.register.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;

import java.util.Set;

@Repository
public interface AsiDictionaryRegisterRepository extends JpaRepository<DictionaryRegister, Long>, AsiDictionaryRegisterCustomRepository {

    Set<DictionaryRegister> findByIsActiveTrueOrderByName();
}
