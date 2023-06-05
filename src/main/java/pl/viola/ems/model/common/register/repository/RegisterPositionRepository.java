package pl.viola.ems.model.common.register.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.common.register.Register;
import pl.viola.ems.model.common.register.RegisterPosition;

import java.util.Set;

@NoRepositoryBean
public interface RegisterPositionRepository<T extends RegisterPosition> extends JpaRepository<T, Long> {
    Set<T> findByRegister(Register register);

    Set<T> findByRegisterAndIsActiveTrueOrderByName(Register register);
}
