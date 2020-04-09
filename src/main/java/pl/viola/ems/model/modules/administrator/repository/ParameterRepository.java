package pl.viola.ems.model.modules.administrator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;

import java.util.List;

@Repository
public interface ParameterRepository extends JpaRepository<Parameter, String> {
    List<Parameter> findByCodeIn(List<String> parametersIds);

    List<Parameter> findByCategory(ParameterCategory category);

}
