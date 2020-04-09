package pl.viola.ems.service.modules.module.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.module.Module;
import pl.viola.ems.model.modules.module.repository.ModuleRepository;
import pl.viola.ems.service.modules.module.ModuleService;

import java.util.List;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @PostFilter("hasPermission(filterObject, '0001') or hasGroup('admin')")
    public List<Module> findAll() {
        if(moduleRepository.findAll().isEmpty()){
            throw new AppException("Administrator.modules.notFound", HttpStatus.NOT_FOUND);
        }
        return moduleRepository.findAll();
    }
}
