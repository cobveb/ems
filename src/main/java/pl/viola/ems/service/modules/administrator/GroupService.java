package pl.viola.ems.service.modules.administrator;


import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.UserDetails;

import java.util.List;
import java.util.Optional;

public interface GroupService {

    List<Group> findAllGroups();

    Optional<Group> findGroupByCode(String code);

    List<Group> findGroupsByUser(String username);

    void saveGroup(Group group);

    void saveGroupUsers(List<UserDetails> users, String groupCode);

    void saveGroupPermissions(List<AcPrivilege> privileges, String groupCode, Long acObjectId);

    String deleteGroup(String groupCode);

}
