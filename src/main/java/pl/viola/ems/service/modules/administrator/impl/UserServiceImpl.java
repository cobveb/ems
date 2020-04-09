package pl.viola.ems.service.modules.administrator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.OrganizationUnitRepository;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.payload.api.UserDetails;
import pl.viola.ems.service.modules.administrator.GroupService;
import pl.viola.ems.service.modules.administrator.UserService;
import pl.viola.ems.service.security.PasswordService;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private OrganizationUnitRepository organizationUnitRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordService passwordService;

    private static final ResourceBundle bundle = ResourceBundle.getBundle("messages");

    private UserDetails userDetails;

    @Override
    public List<User> findByUsernameIn(List<String> usersNames) {
        return userRepository.findByUsernameIn(usersNames);
    }

    @Override
    public Optional<UserDetails> findById(Long userId) {
        return userRepository.findById(userId).map(user -> {
            userDetails = new UserDetails(
                    user.getId(),
                    user.getUsername(),
                    user.getSurname(),
                    user.getName(),
                    user.getPassword(),
                    user.getIsActive(),
                    user.getIsLocked(),
                    user.getIsExpired(),
                    user.getIsCredentialsExpired(),
                    user.getOrganizationUnit().getCode(),
                    user.getAcPermissions(),
                    user.getGroups()
            );
            return Optional.of(userDetails);
        }).orElseThrow(() -> new AppException("Administrator.user.notFound", HttpStatus.BAD_REQUEST));
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public List<UserDetails> findAll() {
        List<UserDetails> usersDetails = new ArrayList<UserDetails>();

        userRepository.findAll().forEach((user) -> {
            userDetails = new UserDetails(
                    user.getId(),
                    user.getUsername(),
                    user.getSurname(),
                    user.getName(),
                    user.getPassword(),
                    user.getIsActive(),
                    user.getIsLocked(),
                    user.getIsExpired(),
                    user.getIsCredentialsExpired(),
                    user.getOrganizationUnit().getCode(),
                    user.getAcPermissions(),
                    user.getGroups()
            );
            usersDetails.add(userDetails);
        });

        return usersDetails;
    }

    @Override
    @Transactional
    public void saveUser(UserDetails userDetails) {

        //If exist user id update user data
        if(userDetails.getId() != null){
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new AppException("Administrator.user.notFound", HttpStatus.BAD_REQUEST));
            user.setName(userDetails.getName());
            user.setSurname(userDetails.getSurname());
            user.setIsActive(userDetails.getIsActive());
            user.setIsLocked(userDetails.getIsLocked());
            user.setIsExpired(userDetails.getIsExpired());
            user.setIsCredentialsExpired(userDetails.getIsCredentialsExpired());
            user.setOrganizationUnit(organizationUnitRepository.findByCode(userDetails.getUnit()).orElseThrow(() -> new AppException("Administrator.user.organizationUnit.notFound", HttpStatus.BAD_REQUEST)));
            if (userDetails.getPassword() != null) {
                if(passwordService.validatePassword(userDetails.getPassword())){
                    user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                }
            }
            userRepository.save(user);

        //else create new user
        } else {
            if(!userRepository.existsByUsername(userDetails.getUsername())){
                if(userDetails.getPassword() != null) {
                    if(passwordService.validatePassword(userDetails.getPassword())){
                        User user = new User(
                                userDetails.getUsername(),
                                passwordEncoder.encode(userDetails.getPassword()),
                                userDetails.getName(),
                                userDetails.getSurname(),
                                userDetails.getIsActive(),
                                userDetails.getIsLocked(),
                                userDetails.getIsExpired(),
                                userDetails.getIsCredentialsExpired(),
                                organizationUnitRepository.findByCode(userDetails.getUnit()).orElseThrow(() -> new AppException("Administrator.user.organizationUnit.notFound", HttpStatus.BAD_REQUEST))
                        );
                        userRepository.save(user);
                    }
                } else {
                    throw new AppException("Administrator.user.passwordNotSet", HttpStatus.BAD_REQUEST);
                }
            } else {
                throw new AppException("Administrator.user.usernameExist", HttpStatus.BAD_REQUEST);
            }
        }
    }

    @Override
    @Transactional
    public String deleteUserById(Long userId) {
        return userRepository.findById(userId).map(user -> {
            userRepository.deleteById(userId);
            return bundle.getString("Administrator.user.deleteUser");
        }).orElseThrow(() ->new AppException("Administrator.user.notFound", HttpStatus.NOT_FOUND));
    }

    @Override
    public List<UserDetails> findUsersByGroup(String groupCode) {
        List<UserDetails> groupUsers = new ArrayList<UserDetails>();
        Optional<Group> userGroup = groupService.findGroupByCode(groupCode);

        userRepository.findByGroups(userGroup.get()).forEach((user) -> {
            userDetails = new UserDetails(
                    user.getId(),
                    user.getUsername(),
                    user.getSurname(),
                    user.getName(),
                    user.getPassword(),
                    user.getIsActive(),
                    user.getIsLocked(),
                    user.getIsExpired(),
                    user.getIsCredentialsExpired(),
                    user.getOrganizationUnit().getCode(),
                    user.getAcPermissions(),
                    user.getGroups()
            );
            groupUsers.add(userDetails);
        });
        return groupUsers;
    }

}
