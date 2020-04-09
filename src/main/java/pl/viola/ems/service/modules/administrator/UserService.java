package pl.viola.ems.service.modules.administrator;

import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.payload.api.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> findByUsernameIn(List<String> username);

    Optional<UserDetails> findById(Long userId);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<UserDetails> findAll();

    void saveUser(UserDetails userDetails);

    String deleteUserById(Long userId);

    List<UserDetails> findUsersByGroup(String group);

}
