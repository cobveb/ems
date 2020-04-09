package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.repository.AcObjectRepository;
import pl.viola.ems.service.security.AcObjectService;

import java.util.List;
import java.util.Optional;

@Service
public class AcObjectServiceImpl implements AcObjectService {

    @Autowired
    private AcObjectRepository acObjectRepository;

    @Override
    public List<AcObject> findAll() {
        return acObjectRepository.findAll();
    }

    @Override
    public Optional<AcObject> findById(Long acObjectId) {
        return acObjectRepository.findById(acObjectId);
    }
}
