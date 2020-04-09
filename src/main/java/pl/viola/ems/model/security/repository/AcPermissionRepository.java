package pl.viola.ems.model.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcObject;
import pl.viola.ems.model.security.AcPermission;

import java.util.List;

@Repository
public interface AcPermissionRepository extends JpaRepository<AcPermission, Long> {

    List<AcPermission> findByUserAndAcObject(User user, AcObject acObject);

    List<AcPermission> findByGroupAndAcObject(Group group, AcObject acObject);


}
