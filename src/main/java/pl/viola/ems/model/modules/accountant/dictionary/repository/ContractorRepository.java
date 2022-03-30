package pl.viola.ems.model.modules.accountant.dictionary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;

import java.util.List;

@Repository
public interface ContractorRepository extends JpaRepository<Contractor, Long> {

    List<Contractor> findByActiveTrue();
}
