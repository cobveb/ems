package pl.viola.ems.model.modules.hr.dictionary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;

import java.util.Set;

@NoRepositoryBean
public interface AbstractPlaceRepository<T extends AbstractPlace> extends JpaRepository<T, Long> {
    Set<T> findByType(AbstractPlace.Type type);

    Set<T> findByActiveTrueAndType(AbstractPlace.Type type);
}
