package pl.viola.ems.service.modules.administrator;

import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.api.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> findByUsernameIn(List<String> username);

    Optional<UserDetails> findById(Long userId);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<UserDetails> findAll();

    UserDetails saveUser(UserDetails userDetails);

    void saveUserPermissions(List<AcPrivilege> privileges, String username, Long acObjectId);

    void saveUserGroups (List<Group> users, String username);

    String deleteUserById(Long userId);

    List<UserDetails> findUsersByGroup(String group);

}
