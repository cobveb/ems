package pl.viola.ems.model.modules.iod.register.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.register.repository.RegisterPositionRepository;
import pl.viola.ems.model.modules.iod.register.RegisterCpdoPosition;

@Repository
public interface RegisterCpdoPositionRepository extends RegisterPositionRepository<RegisterCpdoPosition> {
}
