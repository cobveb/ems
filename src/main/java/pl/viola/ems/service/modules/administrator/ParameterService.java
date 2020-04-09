package pl.viola.ems.service.modules.administrator;

import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;

import java.util.List;
import java.util.Optional;

public interface ParameterService {

    List<Parameter> findByCodeIn(List<String> parameterCodes);

    Optional<Parameter> findById(String code);

    List<Parameter> findAll();

    List<Parameter> findByCategory(ParameterCategory category);

    void save(Parameter parameter);

    List<ParameterCategory> findAllCategory();
}
