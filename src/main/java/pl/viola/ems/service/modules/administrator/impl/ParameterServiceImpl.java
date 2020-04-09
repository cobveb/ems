package pl.viola.ems.service.modules.administrator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.model.modules.administrator.ParameterCategory;
import pl.viola.ems.model.modules.administrator.repository.ParameterRepository;
import pl.viola.ems.service.modules.administrator.ParameterService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ParameterServiceImpl implements ParameterService {

    @Autowired
    ParameterRepository parameterRepository;

    @Override
    public List<Parameter> findByCodeIn(List<String> parameterCodes) {
        return parameterRepository.findByCodeIn(parameterCodes);
    }

    @Override
    public Optional<Parameter> findById(String code) {
        return Optional.ofNullable(parameterRepository.findById(code)
            .orElseThrow(() -> new AppException("Administrator.parameter.notFound", HttpStatus.BAD_REQUEST)));
    }

    @Override
    public List<Parameter> findAll() {
        return parameterRepository.findAll();
    }

    @Override
    public List<Parameter> findByCategory(ParameterCategory category) {
        return parameterRepository.findByCategory(category);
    }

    @Override
    public void save(Parameter parameter) {
        parameterRepository.save(parameter);
    }

    @Override
    public List<ParameterCategory> findAllCategory() {
        return Arrays.asList(ParameterCategory.values());
    }
}
