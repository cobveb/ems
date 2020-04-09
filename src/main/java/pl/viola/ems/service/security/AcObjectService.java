package pl.viola.ems.service.security;

import pl.viola.ems.model.security.AcObject;

import java.util.List;
import java.util.Optional;

public interface AcObjectService {

    List<AcObject> findAll();

    Optional<AcObject> findById(Long acObjectId);
}
