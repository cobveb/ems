package pl.viola.ems.model.modules.module.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.module.Module;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
}
